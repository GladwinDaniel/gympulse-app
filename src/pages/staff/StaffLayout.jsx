import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoGrid,
  IoPeople,
  IoBarbell,
  IoMegaphone,
  IoChatbubbles,
  IoQrCode,
  IoLogOut,
  IoMenu,
  IoClose,
  IoFitness,
  IoBody
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import './StaffLayout.css';

const navItems = [
  { path: '/staff', icon: IoGrid, label: 'Dashboard', end: true },
  { path: '/staff/members', icon: IoPeople, label: 'Members' },
  { path: '/staff/plans', icon: IoBarbell, label: 'Plans' },
  { path: '/staff/anatomy-planner', icon: IoBody, label: 'Anatomy Planner' },
  { path: '/staff/notices', icon: IoMegaphone, label: 'Notices' },
  { path: '/staff/messages', icon: IoChatbubbles, label: 'Messages' },
  { path: '/staff/qr', icon: IoQrCode, label: 'QR Display' },
];

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
  }

  return (
    <div className="staff-layout">
      {/* Mobile header */}
      <header className="staff-mobile-header">
        <button
          className="staff-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <IoMenu />
        </button>
        <span className="staff-mobile-title">
          <IoFitness className="staff-mobile-logo" />
          GymPulse
        </span>
        <div style={{ width: 40 }} />
      </header>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="staff-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`staff-sidebar ${sidebarOpen ? 'staff-sidebar-open' : ''}`}>
        <div className="staff-sidebar-header">
          <div className="staff-sidebar-brand">
            <div className="staff-sidebar-logo">
              <IoFitness />
            </div>
            <div>
              <h2 className="staff-sidebar-title">GymPulse</h2>
              <span className="staff-sidebar-role">Staff Panel</span>
            </div>
          </div>
          <button
            className="staff-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <IoClose />
          </button>
        </div>

        <nav className="staff-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `staff-nav-item ${isActive ? 'staff-nav-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="staff-nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="staff-sidebar-footer">
          <div className="staff-user-info">
            <div className="staff-user-avatar">
              {userProfile?.name?.charAt(0) || 'S'}
            </div>
            <div className="staff-user-details">
              <span className="staff-user-name">{userProfile?.name || 'Staff'}</span>
              <span className="staff-user-role">
                {userProfile?.role === 'trainer' ? 'Trainer' : 'Staff'}
              </span>
            </div>
          </div>
          <button className="staff-logout-btn" onClick={handleLogout}>
            <IoLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="staff-content">
        <Outlet />
      </main>
    </div>
  );
}
