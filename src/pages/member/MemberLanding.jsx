import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  IoBarbell,
  IoNutrition,
  IoQrCode,
  IoChatbubbles,
  IoChevronForward,
  IoFlame,
  IoCalendar,
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import { DEMO_NOTICES } from '../../data/demoData';
import { DEMO_WEEKLY_ASSIGNMENT, WORKOUT_CATEGORIES } from '../../data/workoutData';
import './MemberLanding.css';

export default function MemberLanding() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState(DEMO_NOTICES);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch latest notices
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'notices'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      }, () => {
        // Keep DEMO_NOTICES
      });

      return () => unsub();
    } catch {
      // Keep DEMO_NOTICES
    }
  }, []);

  // Fetch unread message count
  useEffect(() => {
    if (!userProfile?.uid) return;
    try {
      const q = query(
        collection(db, 'messages'),
        where('toMemberId', '==', userProfile.uid),
        where('isRead', '==', false)
      );

      const unsub = onSnapshot(q, (snap) => {
        setUnreadMessages(snap.size);
      }, () => {});

      return () => unsub();
    } catch {
      // Demo mode — no messages
    }
  }, [userProfile?.uid]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const featuredNotice = notices.find(notice => notice.isFeatured) || notices[0];
  const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todayCategory = WORKOUT_CATEGORIES[DEMO_WEEKLY_ASSIGNMENT.categoryId];
  const todayWorkout = todayCategory?.weekPlan[dayIndex];

  const quickActions = [
    {
      id: 'workouts',
      icon: IoBarbell,
      label: 'Workouts',
      desc: 'Start training',
      gradient: 'var(--gradient-primary)',
      glow: 'primary',
      path: '/member/workouts'
    },
    {
      id: 'diet',
      icon: IoNutrition,
      label: 'Diet Plans',
      desc: 'Meal planning',
      gradient: 'var(--gradient-secondary)',
      glow: 'green',
      path: '/member/diet'
    },
    {
      id: 'scan',
      icon: IoQrCode,
      label: 'Scan QR',
      desc: 'Check in/out',
      gradient: 'var(--gradient-cool)',
      glow: 'primary',
      path: '/member/scan'
    },
    {
      id: 'messages',
      icon: IoChatbubbles,
      label: 'Messages',
      desc: unreadMessages > 0 ? `${unreadMessages} new` : 'From staff',
      gradient: 'var(--gradient-energy)',
      glow: 'energy',
      path: '/member/messages',
      badge: unreadMessages
    }
  ];

  return (
    <div className="member-landing">
      {/* Hero Section */}
      <div className="landing-hero">
        <div className="landing-hero-bg"></div>
        <div className="landing-hero-content">
          <p className="landing-greeting">{greeting}</p>
          <h1 className="landing-name">
            {userProfile?.name?.split(' ')[0] || 'Champ'} 💪
          </h1>
          <div className="landing-meta">
            <Badge variant="primary" dot>
              {userProfile?.membershipType === 'pt' ? 'PT Member' : 'Member'}
            </Badge>
            <span className="landing-date">
              <IoCalendar />
              {formatDate(new Date(), 'EEE, MMM d')}
            </span>
          </div>
        </div>
      </div>

      <div className="landing-body">
        {/* Featured poster */}
        {featuredNotice && (
          <section className="landing-section">
            <div className="featured-poster" style={featuredNotice.imageUrl ? { backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.05), rgba(10,10,15,0.96)), url(${featuredNotice.imageUrl})` } : undefined}>
              <div className="featured-poster-content">
                <span className="featured-poster-kicker">FEATURED AT GYMPULSE</span>
                <h2>{featuredNotice.title}</h2>
                <p>{featuredNotice.content}</p>
              </div>
            </div>
          </section>
        )}

        {/* Today's workout is the primary home action */}
        <section className="landing-section">
          <h3 className="landing-section-title">
            <IoCalendar className="section-icon" />
            Today's Workout
          </h3>
          <Card className="today-plan-card today-workout-card" padding="lg">
            {todayWorkout?.exercises?.length ? (
              <>
                <div className="today-workout-heading">
                  <div>
                    <span className="today-workout-kicker">{todayCategory.name}</span>
                    <h2>{todayWorkout.label}</h2>
                    <p>{todayWorkout.exercises.length} exercises · {todayWorkout.exercises.reduce((sum, exercise) => sum + (exercise.sets || 1), 0)} sets</p>
                  </div>
                  <IoBarbell className="today-plan-icon" />
                </div>
                <Button variant="primary" icon={IoBarbell} onClick={() => navigate('/member/workouts/player', { state: { planName: `${todayCategory.name} · ${todayWorkout.label}`, exercises: todayWorkout.exercises } })}>
                  Start Today's Workout
                </Button>
              </>
            ) : (
              <div className="today-plan-empty">
                <IoBarbell className="today-plan-icon" />
                <p className="today-plan-text">Rest day. Ready to train tomorrow?</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/member/workouts')}>Browse Workouts</Button>
              </div>
            )}
          </Card>
        </section>

        {/* Secondary navigation */}
        <section className="landing-section secondary-actions-section">
          <h3 className="landing-section-title"><IoFlame className="section-icon" /> Quick Access</h3>
          <div className="quick-actions-grid stagger-children">
            {quickActions.filter(action => action.id !== 'workouts').map((action) => (
              <Card key={action.id} className="quick-action-card" padding="md" glow={action.glow} onClick={() => navigate(action.path)}>
                <div className="quick-action-icon" style={{ background: action.gradient }}><action.icon /></div>
                <div className="quick-action-info"><span className="quick-action-label">{action.label}</span><span className="quick-action-desc">{action.desc}</span></div>
                {action.badge > 0 && <Badge variant="danger" size="sm">{action.badge}</Badge>}
                <IoChevronForward className="quick-action-arrow" />
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
