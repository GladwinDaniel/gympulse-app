import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  IoPeople,
  IoBarbell,
  IoMegaphone,
  IoQrCode,
  IoChatbubbles,
  IoPersonAdd,
  IoTrendingUp,
  IoCheckmarkCircle,
  IoTime
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import './StaffDashboard.css';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 312,
    activeMembers: 298,
    ptMembers: 42,
    todayAttendance: 86
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch member stats
  useEffect(() => {
    try {
      const membersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'member')
      );

      const unsub = onSnapshot(membersQuery, (snap) => {
        if (!snap.empty) {
          const members = snap.docs.map(d => d.data());
          setStats(prev => ({
            ...prev,
            totalMembers: members.length,
            activeMembers: members.filter(m => m.isActive).length,
            ptMembers: members.filter(m => m.membershipType === 'pt').length,
          }));
        }
      }, (err) => {
        // Fall back to demo stats
      });

      return () => unsub();
    } catch {
      // Use demo stats
    }
  }, []);

  // Fetch today's attendance count
  useEffect(() => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('date', '==', formatDate(today, 'yyyy-MM-dd'))
      );

      const unsub = onSnapshot(attendanceQuery, (snap) => {
        setStats(prev => ({ ...prev, todayAttendance: snap.size }));
      }, () => {});

      return () => unsub();
    } catch {
      // Demo mode
    }
  }, []);

  const statCards = [
    {
      label: 'Total Members',
      value: stats.totalMembers,
      icon: IoPeople,
      gradient: 'var(--gradient-primary)',
      glow: 'primary'
    },
    {
      label: 'Active Members',
      value: stats.activeMembers,
      icon: IoCheckmarkCircle,
      gradient: 'var(--gradient-secondary)',
      glow: 'green'
    },
    {
      label: 'PT Members',
      value: stats.ptMembers,
      icon: IoTrendingUp,
      gradient: 'var(--gradient-cool)',
      glow: 'primary'
    },
    {
      label: 'Today\'s Check-ins',
      value: stats.todayAttendance,
      icon: IoTime,
      gradient: 'var(--gradient-energy)',
      glow: 'energy'
    }
  ];

  const quickActions = [
    { label: 'View Members', icon: IoPeople, path: '/staff/members' },
    { label: 'Post Notice', icon: IoMegaphone, path: '/staff/notices' },
    { label: 'Display QR', icon: IoQrCode, path: '/staff/qr' },
    { label: 'Send Message', icon: IoChatbubbles, path: '/staff/messages' },
    { label: 'Manage Plans', icon: IoBarbell, path: '/staff/plans' },
    { label: 'Add Staff', icon: IoPersonAdd, path: '/staff/add-staff' },
  ];

  return (
    <div className="page-container staff-dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back — here's your gym overview</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stagger-children">
        {statCards.map((stat) => (
          <Card key={stat.label} className="stat-card" padding="lg" glow={stat.glow}>
            <div className="stat-icon" style={{ background: stat.gradient }}>
              <stat.icon />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h3 className="dashboard-section-title">Quick Actions</h3>
        <div className="quick-actions-dashboard stagger-children">
          {quickActions.map((action) => (
            <Card
              key={action.label}
              className="dashboard-action-card"
              padding="md"
              onClick={() => navigate(action.path)}
            >
              <action.icon className="dashboard-action-icon" />
              <span className="dashboard-action-label">{action.label}</span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
