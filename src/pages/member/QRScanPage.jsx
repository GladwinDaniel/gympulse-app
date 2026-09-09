import { useState, useRef, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  IoQrCode,
  IoCamera,
  IoCheckmarkCircle,
  IoCalendar,
  IoClose
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './QRScanPage.css';

export default function QRScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [todayStatus, setTodayStatus] = useState(() => {
    const saved = localStorage.getItem('gympulse_attendance_today');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) return data;
    }
    return null;
  });
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('gympulse_attendance_history') || '[]').slice(0, 7);
  });
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  async function startScanner() {
    setScanning(true);
    setScanResult(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
          stopScanner();
        },
        () => {} // Ignore scan errors
      );
    } catch (err) {
      console.error('Scanner error:', err);
      // Demo fallback — simulate a scan
      toast('Camera not available — simulating scan for demo', { icon: '📸' });
      setTimeout(() => {
        handleScanSuccess(JSON.stringify({
          app: 'gympulse',
          purpose: 'attendance',
          token: 'demo-attendance-token',
          issuedAt: Date.now(),
        }));
        setScanning(false);
      }, 2000);
    }
  }

  function stopScanner() {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(() => {});
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  }

  function handleScanSuccess(token) {
    let payload;
    try {
      payload = JSON.parse(token);
    } catch {
      toast.error('Invalid GymPulse QR code');
      return;
    }

    const issuedAt = Number(payload.issuedAt);
    const isFresh = Number.isFinite(issuedAt) && Date.now() - issuedAt < 5 * 60 * 1000;
    if (payload.app !== 'gympulse' || payload.purpose !== 'attendance' || !isFresh) {
      toast.error('This QR code has expired. Scan the current code at the entrance.');
      return;
    }

    const now = new Date();
    const today = now.toDateString();
    const isCheckOut = todayStatus?.checkedIn && !todayStatus?.checkedOut;

    if (isCheckOut) {
      // Check-out
      const updated = {
        ...todayStatus,
        checkedOut: true,
        checkOutTime: now.toISOString(),
      };
      setTodayStatus(updated);
      localStorage.setItem('gympulse_attendance_today', JSON.stringify(updated));

      // Add to history
      const entry = {
        date: today,
        checkIn: todayStatus.checkInTime,
        checkOut: now.toISOString(),
        duration: Math.round((now.getTime() - new Date(todayStatus.checkInTime).getTime()) / 60000),
      };
      const updatedHistory = [entry, ...history].slice(0, 7);
      setHistory(updatedHistory);
      localStorage.setItem('gympulse_attendance_history', JSON.stringify(updatedHistory));

      setScanResult({ type: 'checkout', time: now });
      toast.success('Checked out successfully! 💪');
    } else {
      // Check-in
      const data = {
        date: today,
        checkedIn: true,
        checkedOut: false,
        checkInTime: now.toISOString(),
      };
      setTodayStatus(data);
      localStorage.setItem('gympulse_attendance_today', JSON.stringify(data));
      setScanResult({ type: 'checkin', time: now });
      toast.success('Checked in! Let\'s go! 🔥');
    }
  }

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Scan QR</h1>
        <p className="page-subtitle">Scan the current gym QR code to check in or out</p>
      </div>

      {/* Today's Status */}
      <Card className="qr-status-card" padding="md" glow={todayStatus?.checkedIn ? 'green' : undefined}>
        <div className="qr-status-content">
          <div className="qr-status-icon" style={{
            background: todayStatus?.checkedIn ? 'var(--gradient-secondary)' : 'var(--bg-glass)'
          }}>
            {todayStatus?.checkedIn ? <IoCheckmarkCircle /> : <IoQrCode />}
          </div>
          <div className="qr-status-info">
            <h3>{todayStatus?.checkedIn
              ? (todayStatus.checkedOut ? 'Session Complete' : 'Currently at Gym')
              : 'Not Checked In'
            }</h3>
            {todayStatus?.checkedIn && (
              <p className="qr-status-time">
                In: {formatDate(todayStatus.checkInTime, 'h:mm a')}
                {todayStatus.checkedOut && ` · Out: ${formatDate(todayStatus.checkOutTime, 'h:mm a')}`}
              </p>
            )}
          </div>
          {todayStatus?.checkedIn && !todayStatus?.checkedOut && (
            <Badge variant="success" dot>Active</Badge>
          )}
        </div>
      </Card>

      {/* Scanner Area */}
      <div className="qr-scanner-area">
        {scanning ? (
          <div className="qr-scanner-active">
            <div id="qr-reader" ref={scannerRef} className="qr-reader-container" />
            <Button variant="danger" icon={IoClose} onClick={stopScanner} fullWidth>
              Cancel Scan
            </Button>
          </div>
        ) : scanResult ? (
          <Card className="qr-result animate-scale-in" padding="lg">
            <div className="qr-result-content">
              <div className="qr-result-icon">
                {scanResult.type === 'checkin' ? '🏋️' : '👋'}
              </div>
              <h3>{scanResult.type === 'checkin' ? 'Checked In!' : 'Checked Out!'}</h3>
              <p>{formatDate(scanResult.time, 'h:mm a — EEEE, MMM d')}</p>
              {!todayStatus?.checkedOut && (
                <Button
                  variant="primary"
                  icon={IoQrCode}
                  onClick={() => { setScanResult(null); startScanner(); }}
                  style={{ marginTop: 16 }}
                >
                  Scan to Check Out
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="qr-scan-prompt">
            <div className="qr-scan-icon">
              <IoCamera />
            </div>
            <p className="qr-scan-text">
              {todayStatus?.checkedIn && !todayStatus?.checkedOut
                ? 'Scan the current QR code to check out'
                : 'Scan the current QR code at the gym entrance'
              }
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={IoCamera}
              onClick={startScanner}
              fullWidth
            >
              {todayStatus?.checkedIn && !todayStatus?.checkedOut ? 'Scan to Check Out' : 'Scan Gym QR'}
            </Button>
          </div>
        )}
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="qr-history">
          <h3 className="qr-history-title">
            <IoCalendar /> Recent Attendance
          </h3>
          <div className="qr-history-list stagger-children">
            {history.map((entry, idx) => (
              <Card key={idx} className="qr-history-item" padding="sm">
                <div className="qr-history-date">
                  {formatDate(entry.checkIn, 'EEE, MMM d')}
                </div>
                <div className="qr-history-times">
                  <span>In: {formatDate(entry.checkIn, 'h:mm a')}</span>
                  <span>Out: {formatDate(entry.checkOut, 'h:mm a')}</span>
                </div>
                {entry.duration && (
                  <Badge variant="default" size="sm">{entry.duration} min</Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
