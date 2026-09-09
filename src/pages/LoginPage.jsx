import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMail, IoLockClosed, IoFitness } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { login, loginAsDemo, resetPassword } = useAuth();
  const navigate = useNavigate();

  function handleQuickDemo(emailKey) {
    const success = loginAsDemo(emailKey);
    if (success) {
      toast.success(`Logged in as ${emailKey}`);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      // Navigation handled by App.jsx based on role
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg.includes('deactivated')) {
        toast.error(msg);
      } else if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(msg);
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

          {/* Quick Demo Test Buttons */}
          <div className="login-demo-section">
            <div className="login-demo-header">
              <span>⚡ Quick Demo Logins</span>
            </div>
            <div className="login-demo-grid">
              <button
                type="button"
                className="demo-chip demo-chip-staff"
                onClick={() => handleQuickDemo('staff@gym.com')}
                title="Log in as Gym Staff / Admin"
              >
                <span className="demo-chip-role">Staff</span>
                <span className="demo-chip-email">staff@gym.com</span>
              </button>
              <button
                type="button"
                className="demo-chip demo-chip-pt"
                onClick={() => handleQuickDemo('pt@gym.com')}
                title="Log in as Personal Training Member"
              >
                <span className="demo-chip-role">PT Member</span>
                <span className="demo-chip-email">pt@gym.com</span>
              </button>
              <button
                type="button"
                className="demo-chip demo-chip-member"
                onClick={() => handleQuickDemo('member@gym.com')}
                title="Log in as Regular Gym Member"
              >
                <span className="demo-chip-role">Member</span>
                <span className="demo-chip-email">member@gym.com</span>
              </button>
            </div>
            <p className="demo-chip-note">Test password for all: <code>admin123</code> / <code>member123</code></p>
          </div>

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
