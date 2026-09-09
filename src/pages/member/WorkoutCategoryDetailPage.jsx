import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WORKOUT_CATEGORIES, formatDuration, DEMO_WEEKLY_ASSIGNMENT } from '../../data/workoutData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoPlayCircle,
  IoTime,
  IoBarbell,
  IoCalendar,
  IoRepeat
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import './WorkoutCategoryDetailPage.css';

export default function WorkoutCategoryDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = WORKOUT_CATEGORIES[categoryId];
  const [selectedDay, setSelectedDay] = useState(() => {
    const dayIndex = new Date().getDay();
    // Convert JS day (0=Sun) to our array (0=Mon)
    return dayIndex === 0 ? 6 : dayIndex - 1;
  });
  const [assigned, setAssigned] = useState(
    DEMO_WEEKLY_ASSIGNMENT?.categoryId === categoryId
  );

  if (!category) {
    return (
      <div className="page-container">
        <Button variant="ghost" icon={IoArrowBack} onClick={() => navigate(-1)}>Back</Button>
        <p style={{ marginTop: 20, color: 'var(--text-secondary)' }}>Category not found.</p>
      </div>
    );
  }

  const todayDayIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const dayPlan = category.weekPlan[selectedDay];

  function handleAssignWeek() {
    setAssigned(true);
    toast.success(`${category.name} assigned for this week!`);
  }

  function handleStartWorkout() {
    if (!dayPlan || dayPlan.exercises.length === 0) {
      toast('Rest day — enjoy your recovery! 🧘', { icon: '😴' });
      return;
    }
    // Navigate to workout player with this day's exercises
    navigate('/member/workouts/player', {
      state: {
        planName: `${category.name} — ${dayPlan.label}`,
        exercises: dayPlan.exercises,
      }
    });
  }

  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="page-container category-detail-page">
      <Button
        variant="ghost"
        icon={IoArrowBack}
        onClick={() => navigate('/member/workouts')}
        className="back-btn"
      >
        Back
      </Button>

      {/* Category Header */}
      <div className="cd-header" style={{ background: category.gradient }}>
        <h1 className="cd-title">{category.name}</h1>
        <p className="cd-desc">{category.description}</p>
        <div className="cd-meta">
          <Badge variant="default" size="sm">{category.duration}</Badge>
          <Badge variant="default" size="sm">7-Day Program</Badge>
        </div>
      </div>

      {/* Week Day Selector */}
      <div className="cd-week-selector">
        <h3 className="cd-section-title">
          <IoCalendar /> Weekly Schedule
        </h3>
        <div className="cd-days-row">
          {dayLetters.map((letter, i) => (
            <button
              key={i}
              className={`cd-day-btn ${selectedDay === i ? 'cd-day-active' : ''} ${i === todayDayIndex ? 'cd-day-today' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              <span className="cd-day-letter">{letter}</span>
              {i === todayDayIndex && <span className="cd-day-dot" />}
            </button>
          ))}
        </div>
      </div>

      {/* Day's Workout */}
      <div className="cd-day-workout">
        <div className="cd-day-header">
          <div>
            <h3 className="cd-day-name">{category.weekPlan[selectedDay].day}</h3>
            <p className="cd-day-label">{category.weekPlan[selectedDay].label}</p>
          </div>
          {dayPlan.exercises.length > 0 && (
            <Badge variant="primary" size="sm">
              {dayPlan.exercises.length} exercises
            </Badge>
          )}
        </div>

        {dayPlan.exercises.length === 0 ? (
          <Card className="cd-rest-card" padding="lg">
            <div className="cd-rest-content">
              <span className="cd-rest-emoji">😴</span>
              <h4>Rest Day</h4>
              <p>Time to recover and let your muscles grow!</p>
            </div>
          </Card>
        ) : (
          <div className="cd-exercise-list stagger-children">
            {dayPlan.exercises.map((ex, idx) => (
              <Card key={idx} className="cd-exercise-card" padding="md">
                <div className="cd-exercise-num">{idx + 1}</div>
                <div className="cd-exercise-info">
                  <span className="cd-exercise-name">{ex.name}</span>
                  <div className="cd-exercise-meta">
                    <span>
                      <IoRepeat /> {ex.sets} sets
                    </span>
                    <span>
                      {ex.reps
                        ? `${ex.reps} reps`
                        : <><IoTime /> {formatDuration(ex.duration)}</>
                      }
                    </span>
                    {ex.rest > 0 && (
                      <span className="cd-exercise-rest">
                        Rest: {formatDuration(ex.rest)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="cd-actions">
        {dayPlan.exercises.length > 0 && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            icon={IoPlayCircle}
            onClick={handleStartWorkout}
          >
            Start Today's Workout
          </Button>
        )}
        {!assigned ? (
          <Button
            variant="outline"
            fullWidth
            icon={IoCheckmarkCircle}
            onClick={handleAssignWeek}
          >
            Assign for This Week
          </Button>
        ) : (
          <Button variant="ghost" fullWidth icon={IoCheckmarkCircle} disabled>
            ✓ Assigned for This Week
          </Button>
        )}
      </div>
    </div>
  );
}
