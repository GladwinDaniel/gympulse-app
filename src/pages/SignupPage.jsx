import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMail, IoLockClosed, IoPerson, IoCall, IoFitness, IoArrowBack, IoShieldCheckmark, IoBarbell } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './LoginPage.css'; // Reuse login styles

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('member'); // 'member' or 'staff'
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setErrorBanner('');

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await signup(email, password, name, phone, role);
      toast.success(`Account created! Welcome, ${name}! 🎉`);
      if (role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/member');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const code = err.code || '';
      const msg = err.message || '';

      if (code === 'auth/configuration-not-found' || msg.includes('configuration-not-found')) {
        const errorText = 'Authentication is not activated yet! Open Firebase Console → Authentication and click the "Get started" button.';
        setErrorBanner(errorText);
        toast.error(errorText, { duration: 10000 });
      } else if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        const errorText = 'Email/Password sign-in is disabled in your Firebase Console! Go to Authentication → Sign-in method and enable Email/Password.';
        setErrorBanner(errorText);
        toast.error(errorText, { duration: 10000 });
      } else if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
        setErrorBanner('An account with this email already exists. Try logging in!');
        toast.error('An account with this email already exists.');
      } else if (code === 'auth/weak-password' || msg.includes('weak-password')) {
        setErrorBanner('Password is too weak. Please use at least 6 characters.');
        toast.error('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
        setErrorBanner('Invalid email address format.');
        toast.error('Invalid email address format.');
      } else if (code === 'auth/network-request-failed' || msg.includes('network-request-failed')) {
        setErrorBanner('Network connection error. Please check your connection.');
        toast.error('Network connection error.');
      } else {
        setErrorBanner(msg || 'Registration failed. Please try again.');
        toast.error(msg || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1"></div>
        <div className="login-bg-orb login-bg-orb-2"></div>
        <div className="login-bg-orb login-bg-orb-3"></div>
      </div>

      <div className="login-container animate-fade-in-up">
        <div className="login-logo">
          <div className="login-logo-icon">
            <IoFitness />
          </div>
          <h1 className="login-logo-text">
            Gym<span className="gradient-text">Pulse</span>
          </h1>
          <p className="login-tagline">Create your account</p>
        </div>

        <div className="login-card glass-card-static">
          <form onSubmit={handleSignup} className="login-form">
            <h2 className="login-form-title">Join GymPulse</h2>
            <p className="login-form-desc">Select your role and start today</p>

            {errorBanner && (
              <div className="auth-alert-banner">
                <p>{errorBanner}</p>
              </div>
            )}

            {/* Role Selection Toggle */}
            <div className="signup-role-selector">
              <button
                type="button"
                className={`signup-role-btn ${role === 'member' ? 'active' : ''}`}
                onClick={() => setRole('member')}
              >
                <IoBarbell />
                <span>Gym Member</span>
              </button>
              <button
                type="button"
                className={`signup-role-btn ${role === 'staff' ? 'active' : ''}`}
                onClick={() => setRole('staff')}
              >
                <IoShieldCheckmark />
                <span>Staff / Admin</span>
              </button>
            </div>

            <Input
              id="signup-name"
              label="Full Name"
              type="text"
              icon={IoPerson}
              placeholder="e.g. Alex Hunter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="signup-email"
              label="Email"
              type="email"
              icon={IoMail}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="signup-phone"
              label="Phone (optional)"
              type="tel"
              icon={IoCall}
              placeholder="+1 555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              id="signup-password"
              label="Password"
              type="password"
              icon={IoLockClosed}
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              id="signup-confirm-password"
              label="Confirm Password"
              type="password"
              icon={IoLockClosed}
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign Up as {role === 'staff' ? 'Staff / Admin' : 'Member'}
            </Button>
          </form>

          <div className="login-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="login-signup-link">
            <Button variant="outline" fullWidth icon={IoArrowBack}>
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
