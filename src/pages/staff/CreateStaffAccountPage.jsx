import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { IoPersonAdd, IoPerson, IoMail, IoLockClosed, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CreateStaffAccountPage.css';

export default function CreateStaffAccountPage() {
  const { createStaffAccount } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await createStaffAccount(email, password, name, role);
      toast.success(`${role === 'trainer' ? 'Trainer' : 'Staff'} account created!`);
      navigate('/staff');
    } catch (err) {
      if (err.message?.includes('email-already-in-use')) {
        toast.error('An account with this email already exists');
      } else {
        toast.error('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container create-staff-page">
      <div className="page-header">
        <Button variant="ghost" icon={IoArrowBack} onClick={() => navigate('/staff')} size="sm">
          Back
        </Button>
        <h1 className="page-title">Add Staff Account</h1>
        <p className="page-subtitle">Create a new staff or trainer account</p>
      </div>

      <Card className="create-staff-card" padding="lg">
        <form onSubmit={handleCreate} className="create-staff-form">
          <Input
            id="staff-name"
            label="Full Name"
            icon={IoPerson}
            placeholder="Staff name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="staff-email"
            label="Email"
            type="email"
            icon={IoMail}
            placeholder="staff@gym.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="staff-password"
            label="Temporary Password"
            type="password"
            icon={IoLockClosed}
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="input-group">
            <label className="input-label">Role</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${role === 'staff' ? 'role-btn-active' : ''}`}
                onClick={() => setRole('staff')}
              >
                Staff
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'trainer' ? 'role-btn-active' : ''}`}
                onClick={() => setRole('trainer')}
              >
                Trainer
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg" icon={IoPersonAdd}>
            Create Account
          </Button>
        </form>
      </Card>
    </div>
  );
}
