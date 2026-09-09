import { useState, useEffect } from 'react';
import { IoDownload, IoClose } from 'react-icons/io5';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('gympulse_install_dismissed') === 'true'
  );

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000); // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [dismissed]);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('gympulse_install_dismissed', 'true');
  }

  if (!showBanner) return null;

  return (
    <div className="install-banner animate-fade-in-up">
      <div className="install-content">
        <div className="install-icon">
          <IoDownload />
        </div>
        <div className="install-text">
          <strong>Install GymPulse</strong>
          <span>Add to home screen for faster access</span>
        </div>
      </div>
      <div className="install-actions">
        <button className="install-btn-install" onClick={handleInstall}>Install</button>
        <button className="install-btn-dismiss" onClick={handleDismiss}>
          <IoClose />
        </button>
      </div>
    </div>
  );
}
