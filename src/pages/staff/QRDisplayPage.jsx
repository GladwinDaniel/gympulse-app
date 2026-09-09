import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { IoQrCode, IoRefresh, IoExpand, IoContract, IoTime } from 'react-icons/io5';
import './QRDisplayPage.css';

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function QRDisplayPage() {
  const [token, setToken] = useState('');
  const [issuedAt, setIssuedAt] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Keep one attendance QR active for exactly five minutes.
  useEffect(() => {
    regenerateToken();

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          regenerateToken();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function regenerateToken() {
    const newToken = generateToken();
    setToken(newToken);
    setIssuedAt(Date.now());
    setTimeRemaining(300);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }

  useEffect(() => {
    function handleFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const qrData = JSON.stringify({
    app: 'gympulse',
    purpose: 'attendance',
    token,
    issuedAt,
  });

  return (
    <div className="page-container qr-display-page" ref={containerRef}>
      {!isFullscreen && (
        <div className="page-header">
          <h1 className="page-title">QR Display</h1>
          <p className="page-subtitle">Display this QR code at the gym entrance</p>
        </div>
      )}

      {/* QR Code Display */}
      <Card className={`qr-card ${isFullscreen ? 'qr-card-fullscreen' : ''}`} padding="lg" hover={false}>
        <div className="qr-label">
          <IoQrCode />
          GYM ATTENDANCE
        </div>

        <div className="qr-code-wrapper">
          <QRCodeSVG
            value={qrData}
            size={isFullscreen ? 400 : 280}
            bgColor="transparent"
            fgColor="#ffffff"
            level="M"
            includeMargin={true}
          />
        </div>

        <div className="qr-timer">
          <IoTime className="qr-timer-icon" />
          <span>New code in <strong>{formatTime(timeRemaining)}</strong></span>
        </div>

        <div className="qr-actions">
          <Button variant="ghost" size="sm" icon={IoRefresh} onClick={regenerateToken}>
            Refresh Now
          </Button>
          <Button variant="ghost" size="sm" icon={isFullscreen ? IoContract : IoExpand} onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
