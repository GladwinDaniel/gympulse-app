import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMail, IoLockClosed, IoPerson, IoCall, IoFitness, IoArrowBack } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './LoginPage.css'; // Reuse login styles

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

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
      await signup(email, password, name, phone);
      toast.success('Account created. Waiting for staff approval.');
      navigate('/member');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('email-already-in-use')) {
        toast.error('An account with this email already exists');
      } else if (msg.includes('weak-password')) {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else if (msg.includes('invalid-email')) {
        toast.error('Invalid email address');
      } else {
        toast.error('Registration failed. Please try again.');
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
            <p className="login-form-desc">Start your fitness journey today</p>

            <Input
              id="signup-name"
              label="Full Name"
              type="text"
              icon={IoPerson}
              placeholder="John Doe"
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
              placeholder="+91 98765 43210"
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
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Account
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
