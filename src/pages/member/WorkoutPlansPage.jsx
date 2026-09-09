import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_SAVED_PLANS, DEMO_WEEKLY_ASSIGNMENT, DEMO_PT_PLANS, WORKOUT_CATEGORIES, formatDuration } from '../../data/workoutData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TabBar from '../../components/ui/TabBar';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoBarbell,
  IoAdd,
  IoPlayCircle,
  IoCalendar,
  IoTrash,
  IoTime,
  IoStar,
  IoArrowBack,
  IoCreateOutline
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './WorkoutPlansPage.css';

const tabs = [
  { key: 'week', label: 'This Week' },
  { key: 'custom', label: 'My Plans' },
  { key: 'pt', label: 'From Trainer' },
];

export default function WorkoutPlansPage() {
  const navigate = useNavigate();
  const { isPTMember } = useAuth();
  const [activeTab, setActiveTab] = useState('week');
  const [customPlans, setCustomPlans] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('gympulse_custom_plans') || '[]');
    return saved.length ? saved : DEMO_SAVED_PLANS.map(plan => ({ ...plan, source: 'member' }));
  });

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();

  function handleDeletePlan(planId) {
    if (!window.confirm('Delete this plan?')) return;
    setCustomPlans(prev => prev.filter(p => p.id !== planId));
    const saved = JSON.parse(localStorage.getItem('gympulse_custom_plans') || '[]');
    localStorage.setItem('gympulse_custom_plans', JSON.stringify(saved.filter(p => p.id !== planId)));
    toast.success('Plan deleted');
  }

  function handleStartPlan(plan) {
    navigate('/member/workouts/player', {
      state: {
        planName: plan.name,
        exercises: plan.exercises,
      }
    });
  }

  // Get weekly assignment category data
  const weekCategory = DEMO_WEEKLY_ASSIGNMENT?.categoryId
    ? WORKOUT_CATEGORIES[DEMO_WEEKLY_ASSIGNMENT.categoryId]
    : null;

  return (
    <div className="page-container">
      <Button variant="ghost" icon={IoArrowBack} onClick={() => navigate('/member/workouts')} className="back-btn">
        Back
      </Button>

      <div className="page-header">
        <h1 className="page-title">My Workout Plans</h1>
        <p className="page-subtitle">Your assigned and custom workout plans</p>
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* This Week Tab */}
      {activeTab === 'week' && (
        <div className="wp-tab-content animate-fade-in">
          {weekCategory ? (
            <>
              <Card className="wp-week-banner" padding="md" glow="primary">
                <div className="wp-week-banner-content">
                  <div>
                    <h3>{weekCategory.name}</h3>
                    <p className="wp-week-assigned">
                      Assigned {formatDate(DEMO_WEEKLY_ASSIGNMENT.assignedAt, 'MMM d')}
                    </p>
                  </div>
                  <Badge variant="primary">{weekCategory.duration}</Badge>
                </div>
              </Card>
              <div className="wp-week-days stagger-children">
                {dayNames.map((day, i) => {
                  const dayPlan = weekCategory.weekPlan[i];
                  const isToday = i === todayIndex;
                  const isRest = dayPlan.exercises.length === 0;
                  return (
                    <Card
                      key={day}
                      className={`wp-week-day ${isToday ? 'wp-week-today' : ''}`}
                      padding="sm"
                      onClick={() => {
                        if (!isRest) {
                          navigate('/member/workouts/player', {
                            state: {
                              planName: `${weekCategory.name} — ${dayPlan.label}`,
                              exercises: dayPlan.exercises,
                            }
                          });
                        }
                      }}
                    >
                      <div className="wp-day-left">
                        <span className={`wp-day-name ${isToday ? 'wp-day-name-today' : ''}`}>
                          {isToday ? '▸ Today' : day.slice(0, 3)}
                        </span>
                        <span className="wp-day-label">{dayPlan.label}</span>
                      </div>
                      <div className="wp-day-right">
                        {isRest ? (
                          <span className="wp-day-rest">Rest 😴</span>
                        ) : (
                          <>
                            <Badge variant="default" size="sm">{dayPlan.exercises.length} ex</Badge>
                            {isToday && <IoPlayCircle className="wp-day-play" />}
                          </>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon={IoCalendar}
              title="No weekly plan assigned"
              description="Browse workout categories and assign one for the week"
              action={
                <Button variant="primary" onClick={() => navigate('/member/workouts')}>
                  Browse Workouts
                </Button>
              }
            />
          )}
        </div>
      )}

      {/* Custom Plans Tab */}
      {activeTab === 'custom' && (
        <div className="wp-tab-content animate-fade-in">
          <Button
            variant="primary"
            icon={IoAdd}
            onClick={() => navigate('/member/workouts/create')}
            className="wp-create-btn"
          >
            Create New Plan
          </Button>
          {customPlans.length === 0 ? (
            <EmptyState
              icon={IoBarbell}
              title="No custom plans yet"
              description="Create your own workout routine tailored to your goals"
            />
          ) : (
            <div className="wp-plans-list stagger-children">
              {customPlans.map(plan => (
                <Card key={plan.id} className="wp-plan-card" padding="md">
                  <div className="wp-plan-info">
                    <h4 className="wp-plan-name">{plan.name}</h4>
                    <div className="wp-plan-meta">
                      <Badge variant="default" size="sm">{plan.exercises.length} exercises</Badge>
                      <Badge variant="default" size="sm">{plan.timerMode}</Badge>
                      <span className="wp-plan-date">
                        <IoTime /> {formatDate(plan.createdAt, 'MMM d')}
                      </span>
                    </div>
                  </div>
                  <div className="wp-plan-actions">
                    <Button size="sm" variant="ghost" icon={IoCreateOutline} onClick={() => navigate('/member/workouts/create', { state: { editPlan: plan } })}>
                      Edit
                    </Button>
                    <Button size="sm" variant="primary" icon={IoPlayCircle} onClick={() => handleStartPlan(plan)}>
                      Start
                    </Button>
                    <Button size="sm" variant="ghost" icon={IoTrash} onClick={() => handleDeletePlan(plan.id)} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PT Plans Tab */}
      {activeTab === 'pt' && (
        <div className="wp-tab-content animate-fade-in">
          {!isPTMember ? (
            <EmptyState
              icon={IoStar}
              title="PT Members Only"
              description="Exclusive workout plans are available for Personal Training members. Contact the gym to upgrade."
            />
          ) : DEMO_PT_PLANS.length === 0 ? (
            <EmptyState
              icon={IoBarbell}
              title="No trainer plans yet"
              description="Your trainer hasn't assigned any plans yet — check back soon!"
            />
          ) : (
            <div className="wp-plans-list stagger-children">
              {DEMO_PT_PLANS.map(plan => (
                <Card key={plan.id} className="wp-plan-card wp-plan-pt" padding="md" glow="primary">
                  <div className="wp-plan-info">
                    <div className="wp-plan-pt-badge">
                      <IoStar /> From {plan.trainerName}
                    </div>
                    <h4 className="wp-plan-name">{plan.name}</h4>
                    <div className="wp-plan-meta">
                      <Badge variant="primary" size="sm">{plan.exercises.length} exercises</Badge>
                      <span className="wp-plan-date">
                        Valid until {formatDate(plan.validTo, 'MMM d')}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary" icon={IoPlayCircle} onClick={() => handleStartPlan(plan)}>
                    Start
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
