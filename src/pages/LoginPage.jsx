import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMail, IoLockClosed, IoFitness, IoDownloadOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErrorBanner('');
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      console.error('Login error:', err);
      const code = err.code || '';
      const msg = err.message || '';
      if (code === 'auth/configuration-not-found' || msg.includes('configuration-not-found')) {
        const errText = 'Authentication is not activated yet in Firebase Console! Go to Firebase Console → Authentication and click "Get started".';
        setErrorBanner(errText);
        toast.error(errText, { duration: 10000 });
      } else if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        const errText = 'Email/Password login is not enabled in Firebase Console! Go to Firebase Console → Authentication → Sign-in method and enable Email/Password.';
        setErrorBanner(errText);
        toast.error(errText, { duration: 10000 });
      } else if (msg.includes('deactivated')) {
        setErrorBanner(msg);
        toast.error(msg);
      } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential' || msg.includes('invalid-credential') || msg.includes('user-not-found')) {
        setErrorBanner('Invalid email or password. Please check your credentials or click Create Account.');
        toast.error('Invalid email or password.');
      } else if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
        setErrorBanner('Invalid email address format.');
        toast.error('Invalid email address format.');
      } else {
        setErrorBanner(msg || 'Login failed.');
        toast.error(msg || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success('Password reset email sent!');
      setResetMode(false);
    } catch {
      toast.error('Failed to send reset email. Check your email address.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1"></div>
        <div className="login-bg-orb login-bg-orb-2"></div>
        <div className="login-bg-orb login-bg-orb-3"></div>
      </div>

      <div className="login-container animate-fade-in-up">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <IoFitness />
          </div>
          <h1 className="login-logo-text">
            Gym<span className="gradient-text">Pulse</span>
          </h1>
          <p className="login-tagline">Your complete gym companion</p>
          
          <button 
            type="button"
            className="login-install-pill"
            onClick={() => window.dispatchEvent(new Event('gympulse-open-install'))}
            title="Download / Install GymPulse app"
          >
            <IoDownloadOutline />
            <span>Install / Download App</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="login-card glass-card-static">
          {resetMode ? (
            <form onSubmit={handleResetPassword} className="login-form">
              <h2 className="login-form-title">Reset Password</h2>
              <p className="login-form-desc">Enter your email and we'll send you a reset link</p>

              <Input
                id="reset-email"
                label="Email"
                type="email"
                icon={IoMail}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Send Reset Link
              </Button>

              <button
                type="button"
                className="login-link"
                onClick={() => setResetMode(false)}
              >
                Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="login-form">
              <h2 className="login-form-title">Welcome Back</h2>
              <p className="login-form-desc">Sign in to your account</p>

              {errorBanner && (
                <div className="auth-alert-banner">
                  <p>{errorBanner}</p>
                </div>
              )}

              <Input
                id="login-email"
                label="Email"
                type="email"
                icon={IoMail}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                id="login-password"
                label="Password"
                type="password"
                icon={IoLockClosed}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="login-forgot"
                onClick={() => setResetMode(true)}
              >
                Forgot password?
              </button>

              <Button type="submit" fullWidth loading={loading} size="lg">
                Sign In
              </Button>
            </form>
          )}

          <div className="login-divider">
            <span>New to GymPulse?</span>
          </div>

          <Link to="/signup" className="login-signup-link">
            <Button variant="outline" fullWidth>
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
