import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  IoPlay,
  IoPause,
  IoPlaySkipForward,
  IoCheckmarkCircle,
  IoClose,
  IoBarbell,
  IoInformationCircle
} from 'react-icons/io5';
import { formatDuration } from '../../data/workoutData';
import './WorkoutPlayerPage.css';

const STATES = { IDLE: 'idle', EXERCISE: 'exercise', REST: 'rest', COMPLETE: 'complete' };

export default function WorkoutPlayerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { planName, exercises } = location.state || {};
  const hasWorkout = Boolean(exercises?.length);

  const allSets = useMemo(() => {
    if (!exercises) return [];
    return exercises.flatMap((exercise, exerciseIndex) => (
      Array.from({ length: exercise.sets || 1 }, (_, setIndex) => ({
        ...exercise,
        exerciseIndex,
        setNumber: setIndex + 1,
      }))
    ));
  }, [exercises]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState(STATES.IDLE);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const currentSet = allSets[currentIndex] || null;
  const totalSets = allSets.length;

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalSets) {
      setPhase(STATES.COMPLETE);
      return;
    }

    const nextSet = allSets[nextIndex];
    setCurrentIndex(nextIndex);
    setPhase(STATES.EXERCISE);
    setTimer(nextSet.duration || 0);
    setIsPaused(false);
  }, [allSets, currentIndex, totalSets]);

  const completeSet = useCallback(() => {
    if (!currentSet) return;
    setCompletedSets(previous => previous + 1);

    if (currentIndex >= totalSets - 1) {
      setPhase(STATES.COMPLETE);
      return;
    }

    const restTime = currentSet.rest || 0;
    if (restTime > 0) {
      setPhase(STATES.REST);
      setTimer(restTime);
    } else {
      advanceToNext();
    }
  }, [advanceToNext, currentIndex, currentSet, totalSets]);

  useEffect(() => {
    if (phase !== STATES.EXERCISE && phase !== STATES.REST) return undefined;
    if (isPaused) return undefined;

    const interval = window.setInterval(() => {
      setTimer(previous => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPaused, phase]);

  useEffect(() => {
    if (timer !== 0 || isPaused) return;
    if (phase === STATES.EXERCISE && currentSet?.duration) completeSet();
    if (phase === STATES.REST) advanceToNext();
  }, [advanceToNext, completeSet, currentSet, isPaused, phase, timer]);

  useEffect(() => {
    if (phase === STATES.IDLE || phase === STATES.COMPLETE || isPaused) return undefined;
    const interval = window.setInterval(() => setElapsed(previous => previous + 1), 1000);
    return () => window.clearInterval(interval);
  }, [isPaused, phase]);

  function startWorkout() {
    setPhase(STATES.EXERCISE);
    setTimer(currentSet?.duration || 0);
  }

  function exitWorkout() {
    if (phase !== STATES.COMPLETE && completedSets > 0) {
      if (!window.confirm('End this workout? Progress will be lost.')) return;
    }
    navigate(-1);
  }

  if (!hasWorkout) {
    return (
      <div className="wp-page wp-idle">
        <div className="wp-idle-icon"><IoBarbell /></div>
        <h2 className="wp-idle-title">No Workout Selected</h2>
        <p className="wp-idle-info">Please select a workout program or custom plan to begin.</p>
        <Button variant="primary" icon={IoBarbell} onClick={() => navigate('/member/workouts')}>
          Browse Workouts
        </Button>
      </div>
    );
  }

  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const isRest = phase === STATES.REST;
  const isTimed = Boolean(currentSet?.duration);
  const timerMax = isRest ? (currentSet?.rest || 1) : (currentSet?.duration || 1);
  const timerProgress = isRest || isTimed ? ((timerMax - timer) / timerMax) : 0;
  const timerMinutes = Math.floor(timer / 60);
  const timerSeconds = timer % 60;
  const exerciseCount = new Set(allSets.map(set => set.exerciseIndex)).size;
  const uniqueExercisesDone = new Set(allSets.slice(0, currentIndex + (phase === STATES.COMPLETE ? 1 : 0)).map(set => set.exerciseIndex)).size;
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="wp-page">
      <div className="wp-topbar">
        <button className="wp-close" onClick={exitWorkout} aria-label="Close workout"><IoClose /></button>
        <span className="wp-plan-name">{planName || 'Workout'}</span>
        <span className="wp-set-count">{completedSets}/{totalSets}</span>
      </div>
      <div className="wp-progress-bar"><div className="wp-progress-fill" style={{ width: `${progressPct}%` }} /></div>

      {phase === STATES.IDLE && (
        <div className="wp-idle animate-fade-in-up">
          <div className="wp-idle-icon"><IoBarbell /></div>
          <p className="wp-kicker">READY WHEN YOU ARE</p>
          <h2 className="wp-idle-title">{planName || 'Workout'}</h2>
          <p className="wp-idle-info">{exercises.length} exercises · {totalSets} total sets</p>
          <div className="wp-start-guide"><IoInformationCircle /><span>Complete each set, then rest. Timed exercises finish automatically.</span></div>
          <Button variant="primary" size="lg" icon={IoPlay} onClick={startWorkout}>Start Workout</Button>
        </div>
      )}

      {(phase === STATES.EXERCISE || phase === STATES.REST) && currentSet && (
        <div className="wp-active animate-fade-in">
          <div className={`wp-phase-banner ${isRest ? 'wp-phase-rest' : ''}`}>
            <span>{isRest ? 'REST & RECOVER' : `EXERCISE ${currentSet.exerciseIndex + 1} OF ${exerciseCount}`}</span>
            <strong>{isRest ? 'Next set coming up' : `Set ${currentSet.setNumber} of ${currentSet.sets}`}</strong>
          </div>

          <div className="wp-timer-container">
            {(isRest || isTimed) && (
              <svg className="wp-timer-svg" viewBox="0 0 260 260" aria-hidden="true">
                <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="130" cy="130" r="110" fill="none" stroke={isRest ? 'var(--accent-secondary)' : 'var(--accent-primary)'} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - timerProgress)} transform="rotate(-90 130 130)" className="wp-timer-ring" />
              </svg>
            )}
            <div className={`wp-timer-inner ${!isRest && !isTimed ? 'wp-rep-inner' : ''}`}>
              <span className="wp-timer-phase">{isRest ? 'REST' : isTimed ? 'TIMED SET' : 'TARGET REPS'}</span>
              {isRest || isTimed ? (
                <span className="wp-timer-digits">{String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}</span>
              ) : (
                <span className="wp-timer-digits wp-timer-reps">{currentSet.reps || '—'}</span>
              )}
              <span className="wp-timer-label">{isRest ? 'seconds left' : isTimed ? 'automatic countdown' : 'reps to complete'}</span>
            </div>
          </div>

          <div className="wp-exercise-info">
            <h2 className="wp-exercise-name">{isRest ? 'Rest Period' : currentSet.name}</h2>
            {isRest ? <p className="wp-exercise-next">Next: {allSets[currentIndex + 1]?.name || 'Workout complete'}</p> : <p className="wp-exercise-set">{isTimed ? `${currentSet.duration}s effort` : `${currentSet.reps || 'Complete'} reps`} · Rest {currentSet.rest || 0}s</p>}
          </div>

          <div className="wp-controls">
            {!isRest && isTimed && <button className="wp-ctrl-btn wp-ctrl-pause" onClick={() => setIsPaused(previous => !previous)} aria-label={isPaused ? 'Resume timer' : 'Pause timer'}>{isPaused ? <IoPlay /> : <IoPause />}</button>}
            {!isRest && !isTimed && <button className="wp-ctrl-btn wp-ctrl-done" onClick={completeSet}><IoCheckmarkCircle /><span>Set Complete</span></button>}
            {isRest && <button className="wp-ctrl-btn wp-ctrl-skip" onClick={advanceToNext}><IoPlaySkipForward /><span>Skip Rest</span></button>}
          </div>
        </div>
      )}

      {phase === STATES.COMPLETE && (
        <div className="wp-complete animate-fade-in-up">
          <div className="wp-complete-icon">🎉</div>
          <h2 className="wp-complete-title">Workout Complete!</h2>
          <div className="wp-complete-stats">
            <Card className="wp-stat-card" padding="md"><span className="wp-stat-value">{uniqueExercisesDone}</span><span className="wp-stat-label">Exercises</span></Card>
            <Card className="wp-stat-card" padding="md"><span className="wp-stat-value">{completedSets}</span><span className="wp-stat-label">Sets Done</span></Card>
            <Card className="wp-stat-card" padding="md"><span className="wp-stat-value">{formatDuration(elapsed)}</span><span className="wp-stat-label">Duration</span></Card>
          </div>
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/member/workouts')}>Back to Workouts</Button>
        </div>
      )}
    </div>
  );
}
