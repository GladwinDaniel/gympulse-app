import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import {
  IoPlay,
  IoTrash,
  IoAdd,
  IoSave,
  IoTime,
  IoRepeat,
  IoBarbell,
  IoArrowUp,
  IoArrowDown,
  IoCheckmarkCircle,
  IoSend,
  IoFlame
} from 'react-icons/io5';
import { MUSCLE_GROUPS } from '../../data/exercisesData';
import { formatDuration } from '../../data/workoutData';
import toast from 'react-hot-toast';
import './WeeklyRoutineBuilder.css';

export default function WeeklyRoutineBuilder({
  routine,
  onUpdateRoutine,
  onSaveRoutine,
  onAssignToMember,
  isTrainer = false,
  onOpenAnatomyToBrowse,
}) {
  const navigate = useNavigate();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [routineName, setRoutineName] = useState(routine?.name || 'My Weekly Split');
  const [routineDesc, setRoutineDesc] = useState(routine?.description || '');

  const days = routine?.days || [];
  const currentDay = days[selectedDayIndex] || days[0];

  function handleDayChange(index) {
    setSelectedDayIndex(index);
  }

  function toggleRestDay(dayIndex) {
    const updatedDays = [...days];
    const target = updatedDays[dayIndex];
    updatedDays[dayIndex] = {
      ...target,
      isRest: !target.isRest,
    };
    onUpdateRoutine?.({ ...routine, days: updatedDays });
    toast.success(`${target.day} marked as ${!target.isRest ? 'Rest Day' : 'Workout Day'}`);
  }

  function updateDayLabel(dayIndex, newLabel) {
    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      label: newLabel,
    };
    onUpdateRoutine?.({ ...routine, days: updatedDays });
  }

  function updateExerciseParam(dayIndex, exIndex, field, value) {
    const updatedDays = [...days];
    const dayExs = [...updatedDays[dayIndex].exercises];
    dayExs[exIndex] = {
      ...dayExs[exIndex],
      [field]: value,
    };
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      exercises: dayExs,
    };
    onUpdateRoutine?.({ ...routine, days: updatedDays });
  }

  function removeExercise(dayIndex, exIndex) {
    const updatedDays = [...days];
    const dayExs = updatedDays[dayIndex].exercises.filter((_, idx) => idx !== exIndex);
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      exercises: dayExs,
    };
    onUpdateRoutine?.({ ...routine, days: updatedDays });
    toast.success('Exercise removed');
  }

  function moveExercise(dayIndex, exIndex, direction) {
    const updatedDays = [...days];
    const dayExs = [...updatedDays[dayIndex].exercises];
    const targetIdx = exIndex + direction;
    if (targetIdx < 0 || targetIdx >= dayExs.length) return;
    const temp = dayExs[exIndex];
    dayExs[exIndex] = dayExs[targetIdx];
    dayExs[targetIdx] = temp;
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      exercises: dayExs,
    };
    onUpdateRoutine?.({ ...routine, days: updatedDays });
  }

  function handleSave() {
    if (!routineName.trim()) {
      toast.error('Please enter a routine name');
      return;
    }
    const toSave = {
      ...routine,
      name: routineName.trim(),
      description: routineDesc.trim(),
      days,
    };
    onSaveRoutine?.(toSave);
  }

  function handleStartDayWorkout(day) {
    if (!day.exercises || day.exercises.length === 0) {
      toast.error('No exercises scheduled for this day');
      return;
    }
    // Navigate into full-screen workout player
    navigate('/member/workouts/player', {
      state: {
        planName: `${routineName} · ${day.day}`,
        exercises: day.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets || 3,
          reps: ex.reps || 12,
          duration: ex.duration || null,
          rest: ex.rest || 60,
        })),
      },
    });
  }

  // Calculate day metrics
  function calculateDayStats(day) {
    if (!day || day.isRest || !day.exercises) return { sets: 0, timeSec: 0, muscles: [] };
    const sets = day.exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0);
    const muscles = [...new Set(day.exercises.map(ex => ex.muscle).filter(Boolean))];
    // Approx 45s per set + rest
    const timeSec = day.exercises.reduce((acc, ex) => {
      const exTime = ex.duration ? ex.duration * (ex.sets || 3) : 40 * (ex.sets || 3);
      const restTime = (ex.rest || 60) * (ex.sets || 3);
      return acc + exTime + restTime;
    }, 0);
    return { sets, timeSec, muscles };
  }

  const currentStats = calculateDayStats(currentDay);

  return (
    <div className="wrb-container">
      {/* Header Info */}
      <div className="wrb-header-card">
        <div className="wrb-title-row">
          <div className="wrb-title-field">
            <label className="wrb-label">Weekly Routine Name</label>
            <input
              type="text"
              className="wrb-name-input"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="e.g. 5-Day Push/Pull/Legs Split"
            />
          </div>

          <div className="wrb-header-actions">
            {isTrainer && onAssignToMember && (
              <Button
                variant="secondary"
                icon={IoSend}
                size="sm"
                onClick={() => onAssignToMember({ ...routine, name: routineName, days })}
              >
                Assign to Member
              </Button>
            )}
            <Button
              variant="primary"
              icon={IoSave}
              size="sm"
              onClick={handleSave}
            >
              Save Routine
            </Button>
          </div>
        </div>

        <input
          type="text"
          className="wrb-desc-input"
          value={routineDesc}
          onChange={(e) => setRoutineDesc(e.target.value)}
          placeholder="Brief description or goals (e.g. Hypertrophy focus with high volume)..."
        />
      </div>

      {/* 7-Day Week Strip Selector */}
      <div className="wrb-days-strip">
        {days.map((day, idx) => {
          const stats = calculateDayStats(day);
          const isSelected = idx === selectedDayIndex;
          return (
            <button
              key={day.day}
              type="button"
              className={`wrb-day-pill ${isSelected ? 'is-selected' : ''} ${day.isRest ? 'is-rest' : ''}`}
              onClick={() => handleDayChange(idx)}
            >
              <span className="day-pill-name">{day.day.slice(0, 3)}</span>
              {day.isRest ? (
                <span className="day-pill-sub rest">Rest</span>
              ) : (
                <span className="day-pill-sub">{stats.sets} sets</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Panel */}
      {currentDay && (
        <Card className="wrb-day-detail-card" padding="lg">
          <div className="wrb-day-header">
            <div>
              <div className="wrb-day-title-badge">
                <h3 className="wrb-day-name">{currentDay.day}</h3>
                {currentDay.isRest ? (
                  <Badge variant="default">Recovery Day</Badge>
                ) : (
                  <Badge variant="primary">{currentStats.sets} Total Sets · ~{Math.round(currentStats.timeSec / 60)} min</Badge>
                )}
              </div>
              <input
                type="text"
                className="wrb-day-label-input"
                value={currentDay.label || ''}
                onChange={(e) => updateDayLabel(selectedDayIndex, e.target.value)}
                placeholder="Day Focus (e.g. Chest & Triceps Pump)..."
              />
            </div>

            <div className="wrb-day-quick-toggles">
              <button
                type="button"
                className={`wrb-rest-toggle-btn ${currentDay.isRest ? 'active' : ''}`}
                onClick={() => toggleRestDay(selectedDayIndex)}
              >
                {currentDay.isRest ? '💤 Rest Day Active' : 'Switch to Rest Day'}
              </button>

              {!currentDay.isRest && currentDay.exercises?.length > 0 && (
                <Button
                  variant="primary"
                  icon={IoPlay}
                  size="sm"
                  onClick={() => handleStartDayWorkout(currentDay)}
                >
                  Start Workout
                </Button>
              )}
            </div>
          </div>

          {/* If Day is marked as Rest */}
          {currentDay.isRest ? (
            <div className="wrb-rest-empty-state">
              <span className="rest-icon">🧘‍♂️</span>
              <h4>Scheduled Recovery Day</h4>
              <p>
                Rest is where muscle growth and nervous system repair happen. Focus on hydration, mobility, and proper nutrition.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRestDay(selectedDayIndex)}
              >
                Enable Workout Day
              </Button>
            </div>
          ) : (
            <div className="wrb-exercises-section">
              <div className="wrb-ex-section-header">
                <h4>Scheduled Exercises ({currentDay.exercises?.length || 0})</h4>
                <Button
                  variant="outline"
                  icon={IoAdd}
                  size="sm"
                  onClick={() => onOpenAnatomyToBrowse?.(currentDay.day)}
                >
                  + Add from Body Anatomy
                </Button>
              </div>

              {/* Exercises List */}
              {(!currentDay.exercises || currentDay.exercises.length === 0) ? (
                <div className="wrb-no-ex-box">
                  <IoBarbell className="wrb-no-ex-icon" />
                  <p>No exercises scheduled for {currentDay.day} yet.</p>
                  <Button
                    variant="primary"
                    icon={IoAdd}
                    size="sm"
                    onClick={() => onOpenAnatomyToBrowse?.(currentDay.day)}
                  >
                    Select Muscles on Body Map
                  </Button>
                </div>
              ) : (
                <div className="wrb-ex-list">
                  {currentDay.exercises.map((ex, exIdx) => (
                    <div key={`${ex.id || ex.name}-${exIdx}`} className="wrb-ex-item animate-fade-in">
                      <div className="wrb-ex-left">
                        <div className="wrb-ex-order-btns">
                          <button
                            type="button"
                            className="order-btn"
                            disabled={exIdx === 0}
                            onClick={() => moveExercise(selectedDayIndex, exIdx, -1)}
                          >
                            <IoArrowUp />
                          </button>
                          <button
                            type="button"
                            className="order-btn"
                            disabled={exIdx === currentDay.exercises.length - 1}
                            onClick={() => moveExercise(selectedDayIndex, exIdx, 1)}
                          >
                            <IoArrowDown />
                          </button>
                        </div>
                        <div className="wrb-ex-info">
                          <span className="wrb-ex-name">{ex.name}</span>
                          <span className="wrb-ex-muscle-tag">
                            {ex.muscle ? ex.muscle.toUpperCase() : 'COMPOUND'}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Sets, Reps/Time, Rest */}
                      <div className="wrb-ex-controls">
                        <div className="wrb-input-pill">
                          <span className="pill-label">Sets</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={ex.sets || 3}
                            onChange={(e) => updateExerciseParam(selectedDayIndex, exIdx, 'sets', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        {ex.duration ? (
                          <div className="wrb-input-pill">
                            <span className="pill-label">Sec</span>
                            <input
                              type="number"
                              min="5"
                              max="600"
                              value={ex.duration || 45}
                              onChange={(e) => updateExerciseParam(selectedDayIndex, exIdx, 'duration', parseInt(e.target.value) || 10)}
                            />
                          </div>
                        ) : (
                          <div className="wrb-input-pill">
                            <span className="pill-label">Reps</span>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={ex.reps || 12}
                              onChange={(e) => updateExerciseParam(selectedDayIndex, exIdx, 'reps', parseInt(e.target.value) || 1)}
                            />
                          </div>
                        )}

                        <div className="wrb-input-pill">
                          <span className="pill-label">Rest (s)</span>
                          <input
                            type="number"
                            min="0"
                            max="300"
                            value={ex.rest != null ? ex.rest : 60}
                            onChange={(e) => updateExerciseParam(selectedDayIndex, exIdx, 'rest', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <button
                          type="button"
                          className="wrb-ex-del-btn"
                          title="Remove Exercise"
                          onClick={() => removeExercise(selectedDayIndex, exIdx)}
                        >
                          <IoTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
