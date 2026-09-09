import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  IoPerson,
  IoLogOut,
  IoFitness,
  IoCalendar,
  IoBarbell,
  IoNutrition,
  IoChevronForward,
  IoShield
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="profile-card" padding="lg">
        <div className="profile-avatar">
          {userProfile?.name?.charAt(0) || 'U'}
        </div>
        <h2 className="profile-name">{userProfile?.name || 'User'}</h2>
        <p className="profile-email">{userProfile?.email}</p>
        <div className="profile-badges">
          <Badge variant="primary" dot>
            {userProfile?.membershipType === 'pt' ? 'PT Member' : 'Regular Member'}
          </Badge>
          {userProfile?.isActive && (
            <Badge variant="success">Active</Badge>
          )}
        </div>
      </Card>

      {/* Profile Details */}
      <div className="profile-details">
        <Card className="profile-detail-item" padding="md">
          <IoPerson className="profile-detail-icon" />
          <div className="profile-detail-info">
            <span className="profile-detail-label">Phone</span>
            <span className="profile-detail-value">{userProfile?.phone || 'Not set'}</span>
          </div>
        </Card>

        <Card className="profile-detail-item" padding="md">
          <IoCalendar className="profile-detail-icon" />
          <div className="profile-detail-info">
            <span className="profile-detail-label">Member Since</span>
            <span className="profile-detail-value">
              {formatDate(userProfile?.createdAt, 'MMMM yyyy', 'N/A')}
            </span>
          </div>
        </Card>

        {userProfile?.assignedTrainer && (
          <Card className="profile-detail-item" padding="md">
            <IoShield className="profile-detail-icon" />
            <div className="profile-detail-info">
              <span className="profile-detail-label">Personal Trainer</span>
              <span className="profile-detail-value">Assigned</span>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Links */}
      <div className="profile-links">
        <Card
          className="profile-link-item"
          padding="md"
          onClick={() => navigate('/member/workouts/plans')}
        >
          <IoBarbell className="profile-link-icon" />
          <span className="profile-link-label">My Workout Plans</span>
          <IoChevronForward className="profile-link-arrow" />
        </Card>

        <Card
          className="profile-link-item"
          padding="md"
          onClick={() => navigate('/member/diet')}
        >
          <IoNutrition className="profile-link-icon" />
          <span className="profile-link-label">My Diet Plans</span>
          <IoChevronForward className="profile-link-arrow" />
        </Card>

        <Card
          className="profile-link-item"
          padding="md"
          onClick={() => navigate('/member/attendance')}
        >
          <IoCalendar className="profile-link-icon" />
          <span className="profile-link-label">Attendance History</span>
          <IoChevronForward className="profile-link-arrow" />
        </Card>
      </div>

      {/* Logout */}
      <Button
        variant="danger"
        fullWidth
        icon={IoLogOut}
        onClick={handleLogout}
        className="profile-logout"
      >
        Sign Out
      </Button>
    </div>
  );
}
