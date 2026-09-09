import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_WEEKLY_ASSIGNMENT, WORKOUT_CATEGORIES } from '../../data/workoutData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  IoFlame,
  IoLeaf,
  IoTrendingUp,
  IoBody,
  IoBarbell,
  IoArrowForward,
  IoAdd,
  IoCalendar
} from 'react-icons/io5';
import './WorkoutCategoriesPage.css';

const categories = [
  {
    id: 'fat-loss',
    name: 'Fat Loss',
    icon: IoFlame,
    description: 'High-intensity cardio & circuit training to maximize fat burn',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    exerciseCount: 6,
    duration: '45 min',
  },
  {
    id: 'lean-bulking',
    name: 'Lean Bulking',
    icon: IoTrendingUp,
    description: 'Progressive overload with controlled volume for lean gains',
    color: '#6c5ce7',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    exerciseCount: 5,
    duration: '60 min',
  },
  {
    id: 'bulking',
    name: 'Bulking',
    icon: IoBody,
    description: 'Heavy compound lifts focused on maximum muscle growth',
    color: '#00bcd4',
    gradient: 'linear-gradient(135deg, #00bcd4, #4fc3f7)',
    exerciseCount: 6,
    duration: '70 min',
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    icon: IoLeaf,
    description: 'Balanced cardio & resistance training for sustainable results',
    color: '#00e676',
    gradient: 'linear-gradient(135deg, #00e676, #00bcd4)',
    exerciseCount: 7,
    duration: '50 min',
  },
];

export default function WorkoutCategoriesPage() {
  const navigate = useNavigate();
  const { isPTMember } = useAuth();
  const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todayCategory = WORKOUT_CATEGORIES[DEMO_WEEKLY_ASSIGNMENT.categoryId];
  const todayWorkout = todayCategory?.weekPlan[dayIndex];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Workouts</h1>
        <p className="page-subtitle">Choose a program or build your own</p>
      </div>

      {/* Today's workout comes before the program library */}
      <Card className="today-workout-preview animate-fade-in-up" padding="lg">
        <div className="today-workout-preview-top">
          <div>
            <span className="today-workout-kicker">TODAY'S PLAN</span>
            <h2>{todayWorkout?.label || 'Rest Day'}</h2>
            <p>{todayCategory?.name || 'Your weekly routine'} · {todayWorkout?.exercises?.length || 0} exercises</p>
          </div>
          <IoBarbell className="today-workout-preview-icon" />
        </div>
        {todayWorkout?.exercises?.length ? (
          <Button variant="primary" icon={IoBarbell} onClick={() => navigate('/member/workouts/player', { state: { planName: `${todayCategory.name} · ${todayWorkout.label}`, exercises: todayWorkout.exercises } })}>
            Start Today's Workout
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate('/member/workouts/plans')}>View My Plans</Button>
        )}
      </Card>

      {/* Secondary workout tools */}
      <div className="workout-actions">
        <Button variant="secondary" icon={IoCalendar} onClick={() => navigate('/member/workouts/plans')}>My Plans</Button>
        <Button variant="ghost" icon={IoBody} onClick={() => navigate('/member/workouts/anatomy-planner')}>Anatomy Planner</Button>
        <Button variant="ghost" icon={IoAdd} onClick={() => navigate('/member/workouts/create')}>Create Workout</Button>
      </div>

      {/* PT Badge */}
      {isPTMember && (
        <Card className="pt-banner" padding="md" glow="primary">
          <div className="pt-banner-content">
            <span className="pt-banner-emoji">⭐</span>
            <div>
              <strong>PT Member</strong>
              <p className="pt-banner-text">Check your exclusive trainer plans in My Plans</p>
            </div>
          </div>
        </Card>
      )}

      {/* Categories */}
      <section className="categories-section">
        <h3 className="categories-title">Workout Programs</h3>
        <div className="categories-grid stagger-children">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="category-card"
              padding="none"
              onClick={() => navigate(`/member/workouts/category/${cat.id}`)}
            >
              <div className="category-header" style={{ background: cat.gradient }}>
                <cat.icon className="category-icon" />
              </div>
              <div className="category-body">
                <h4 className="category-name">{cat.name}</h4>
                <p className="category-desc">{cat.description}</p>
                <div className="category-meta">
                  <Badge variant="default" size="sm">{cat.exerciseCount} exercises</Badge>
                  <Badge variant="default" size="sm">{cat.duration}</Badge>
                </div>
                <div className="category-cta">
                  <span>View Program</span>
                  <IoArrowForward />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
