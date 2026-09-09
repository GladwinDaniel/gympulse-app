import { useState, useEffect } from 'react';
import { 
  IoDownloadOutline, 
  IoClose, 
  IoShareOutline, 
  IoAddCircleOutline, 
  IoPhonePortraitOutline,
  IoCheckmarkCircle,
  IoSparkles
} from 'react-icons/io5';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    
    setIsStandalone(checkStandalone);
    if (checkStandalone) return;

    // 2. Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    // 3. Listen for Android/Chrome beforeinstallprompt
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto-show banner if not dismissed recently
      const dismissedTime = localStorage.getItem('gympulse_install_dismissed_at');
      const now = Date.now();
      // Show if never dismissed or dismissed more than 24 hours ago
      if (!dismissedTime || now - parseInt(dismissedTime) > 24 * 60 * 60 * 1000) {
        setTimeout(() => setShowBanner(true), 1200);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS or browsers without beforeinstallprompt, still show banner for first time visitors
    const dismissedTime = localStorage.getItem('gympulse_install_dismissed_at');
    const now = Date.now();
    if (!dismissedTime || now - parseInt(dismissedTime) > 24 * 60 * 60 * 1000) {
      setTimeout(() => setShowBanner(true), 1800);
    }

    // 4. Listen for custom event triggered from anywhere in the app (e.g. Login button)
    function handleManualOpen() {
      setShowBanner(false);
      if (deferredPrompt) {
        promptNativeInstall();
      } else {
        setShowGuideModal(true);
      }
    }
    window.addEventListener('gympulse-open-install', handleManualOpen);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('gympulse-open-install', handleManualOpen);
    };
  }, [deferredPrompt]);

  async function promptNativeInstall() {
    if (!deferredPrompt) {
      setShowGuideModal(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setShowGuideModal(false);
    }
    setDeferredPrompt(null);
  }

  function handleInstallClick() {
    if (deferredPrompt) {
      promptNativeInstall();
    } else {
      setShowGuideModal(true);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem('gympulse_install_dismissed_at', Date.now().toString());
  }

  // If already running standalone as an installed app, don't show anything
  if (isStandalone) return null;

  return (
    <>
      {/* Floating Bottom / Banner Prompt */}
      {showBanner && !showGuideModal && (
        <div className="install-banner animate-fade-in-up" role="region" aria-label="Install App">
          <div className="install-banner-glow"></div>
          <div className="install-content">
            <div className="install-app-icon">
              <img src="/icons/icon-192.png" alt="GymPulse Logo" className="install-icon-img" />
              <span className="install-icon-badge"><IoSparkles /></span>
            </div>
            <div className="install-text">
              <div className="install-text-title">
                <strong>Install GymPulse App</strong>
                <span className="install-badge-free">FREE</span>
              </div>
              <p className="install-text-desc">
                Fast full-screen access, live workout timers & offline mode!
              </p>
            </div>
          </div>

          <div className="install-actions">
            <button 
              className="install-btn-install" 
              onClick={handleInstallClick}
              id="btn-install-app"
            >
              <IoDownloadOutline className="btn-icon" />
              <span>Download App</span>
            </button>
            <button 
              className="install-btn-dismiss" 
              onClick={handleDismiss} 
              title="Dismiss"
              aria-label="Close"
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}

      {/* Step-by-Step Installation Modal (especially for iOS Safari and other browsers) */}
      {showGuideModal && (
        <div className="install-modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="install-modal-sheet animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="install-modal-header">
              <div className="install-modal-brand">
                <img src="/icons/icon-192.png" alt="GymPulse" className="install-modal-logo" />
                <div>
                  <h3>Install GymPulse</h3>
                  <p>Add to your device home screen</p>
                </div>
              </div>
              <button 
                className="install-modal-close" 
                onClick={() => setShowGuideModal(false)}
              >
                <IoClose />
              </button>
            </div>

            <div className="install-benefits">
              <div className="benefit-item">
                <IoCheckmarkCircle className="benefit-icon" />
                <span>Zero browser address bars</span>
              </div>
              <div className="benefit-item">
                <IoCheckmarkCircle className="benefit-icon" />
                <span>Works offline in the gym</span>
              </div>
              <div className="benefit-item">
                <IoCheckmarkCircle className="benefit-icon" />
                <span>1-Tap quick launch from home screen</span>
              </div>
            </div>

            <div className="install-steps">
              {isIOS ? (
                <>
                  <div className="install-step">
                    <div className="step-num">1</div>
                    <div className="step-body">
                      <p>Tap the <strong>Share button</strong> <span className="step-icon-badge"><IoShareOutline /></span> at the bottom of Safari.</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-num">2</div>
                    <div className="step-body">
                      <p>Scroll down and tap <strong>"Add to Home Screen"</strong> <span className="step-icon-badge"><IoAddCircleOutline /></span>.</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-num">3</div>
                    <div className="step-body">
                      <p>Tap <strong>"Add"</strong> in the top right corner. GymPulse is ready!</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="install-step">
                    <div className="step-num">1</div>
                    <div className="step-body">
                      <p>Tap the browser menu <strong>(⋮ 3 dots)</strong> at the top right of Chrome/Edge.</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-num">2</div>
                    <div className="step-body">
                      <p>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="install-modal-footer">
              {deferredPrompt && (
                <button className="install-native-btn" onClick={promptNativeInstall}>
                  <IoDownloadOutline />
                  <span>Install Automatically</span>
                </button>
              )}
              <button className="install-gotit-btn" onClick={() => setShowGuideModal(false)}>
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
