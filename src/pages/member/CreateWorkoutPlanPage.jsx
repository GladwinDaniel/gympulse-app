import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import {
  IoArrowBack,
  IoAdd,
  IoTrash,
  IoSave,
  IoBarbell,
  IoTime,
  IoRepeat
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import './CreateWorkoutPlanPage.css';

export default function CreateWorkoutPlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const editPlan = location.state?.editPlan;
  const [planName, setPlanName] = useState(editPlan?.name || '');
  const [timerMode, setTimerMode] = useState(editPlan?.timerMode || 'manual'); // manual | auto
  const [globalRest, setGlobalRest] = useState(30);
  const [exercises, setExercises] = useState(editPlan?.exercises || []);
  const [showAdd, setShowAdd] = useState(false);

  // New exercise form
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('12');
  const [exDuration, setExDuration] = useState('');
  const [exRest, setExRest] = useState('30');
  const [exType, setExType] = useState('reps'); // reps | timed

  function addExercise() {
    if (!exName.trim()) {
      toast.error('Exercise name is required');
      return;
    }
    const exercise = {
      id: Date.now(),
      name: exName.trim(),
      sets: parseInt(exSets) || 3,
      reps: exType === 'reps' ? (parseInt(exReps) || 12) : null,
      duration: exType === 'timed' ? (parseInt(exDuration) || 30) : null,
      rest: parseInt(exRest) || globalRest,
    };
    setExercises(prev => [...prev, exercise]);
    setExName('');
    setExReps('12');
    setExDuration('');
    setExRest('30');
    setShowAdd(false);
    toast.success('Exercise added');
  }

  function removeExercise(id) {
    setExercises(prev => prev.filter(e => e.id !== id));
  }

  function savePlan() {
    if (!planName.trim()) {
      toast.error('Give your plan a name');
      return;
    }
    if (exercises.length === 0) {
      toast.error('Add at least one exercise');
      return;
    }
    // Save to localStorage for demo
    const plan = {
      id: editPlan?.id || 'custom-' + Date.now(),
      name: planName.trim(),
      type: 'custom',
      source: 'member',
      timerMode,
      exercises,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('gympulse_custom_plans') || '[]');
    const nextPlans = editPlan
      ? (existing.length
        ? existing.map(item => item.id === editPlan.id ? plan : item)
        : [plan])
      : [plan, ...existing];
    localStorage.setItem('gympulse_custom_plans', JSON.stringify(nextPlans));
    toast.success(editPlan ? 'Plan updated!' : 'Plan saved!');
    navigate('/member/workouts/plans');
  }

  return (
    <div className="page-container">
      <Button variant="ghost" icon={IoArrowBack} onClick={() => navigate(-1)} className="back-btn">
        Back
      </Button>

      <div className="page-header">
        <h1 className="page-title">{editPlan ? 'Edit Workout Plan' : 'Create Workout Plan'}</h1>
        <p className="page-subtitle">{editPlan ? 'Update your member-owned routine' : 'Build a custom workout for your routine'}</p>
      </div>

      {/* Plan Name */}
      <div className="cwp-section">
        <Input
          id="plan-name"
          label="Plan Name"
          placeholder="e.g., Morning Power Routine"
          value={planName}
          onChange={e => setPlanName(e.target.value)}
        />
      </div>

      {/* Timer Mode */}
      <div className="cwp-section">
        <label className="cwp-label">Timer Mode</label>
        <div className="cwp-mode-row">
          <button
            className={`cwp-mode-btn ${timerMode === 'manual' ? 'cwp-mode-active' : ''}`}
            onClick={() => setTimerMode('manual')}
          >
            <IoBarbell />
            <span>Manual</span>
            <small>Tap to complete each set</small>
          </button>
          <button
            className={`cwp-mode-btn ${timerMode === 'auto' ? 'cwp-mode-active' : ''}`}
            onClick={() => setTimerMode('auto')}
          >
            <IoTime />
            <span>Auto Timer</span>
            <small>Timer counts down automatically</small>
          </button>
        </div>
      </div>

      {/* Global Rest */}
      <div className="cwp-section">
        <label className="cwp-label">Default Rest Between Sets</label>
        <div className="cwp-rest-row">
          {[15, 30, 45, 60, 90, 120].map(sec => (
            <button
              key={sec}
              className={`cwp-rest-btn ${globalRest === sec ? 'cwp-rest-active' : ''}`}
              onClick={() => setGlobalRest(sec)}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Exercises List */}
      <div className="cwp-section">
        <div className="cwp-section-header">
          <label className="cwp-label">Exercises ({exercises.length})</label>
          <Button variant="primary" size="sm" icon={IoAdd} onClick={() => setShowAdd(true)}>
            Add
          </Button>
        </div>

        {exercises.length === 0 ? (
          <Card className="cwp-empty" padding="lg">
            <IoBarbell style={{ fontSize: 32, opacity: 0.3 }} />
            <p>No exercises added yet. Tap "Add" to begin.</p>
          </Card>
        ) : (
          <div className="cwp-exercises stagger-children">
            {exercises.map((ex, idx) => (
              <Card key={ex.id} className="cwp-exercise-card" padding="sm">
                <div className="cwp-ex-num">{idx + 1}</div>
                <div className="cwp-ex-info">
                  <span className="cwp-ex-name">{ex.name}</span>
                  <div className="cwp-ex-meta">
                    <Badge variant="default" size="sm">{ex.sets} sets</Badge>
                    <Badge variant="default" size="sm">
                      {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                    </Badge>
                    <Badge variant="default" size="sm">Rest {ex.rest}s</Badge>
                  </div>
                </div>
                <button className="cwp-ex-delete" onClick={() => removeExercise(ex.id)}>
                  <IoTrash />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Exercise Form (Inline) */}
      {showAdd && (
        <Card className="cwp-add-form animate-fade-in-up" padding="md">
          <h4 className="cwp-add-title">Add Exercise</h4>
          <Input
            id="ex-name"
            label="Exercise Name"
            placeholder="e.g., Push-Ups"
            value={exName}
            onChange={e => setExName(e.target.value)}
          />
          <div className="cwp-add-row">
            <Input
              id="ex-sets"
              label="Sets"
              type="number"
              value={exSets}
              onChange={e => setExSets(e.target.value)}
            />
            <div className="cwp-type-toggle">
              <label className="cwp-label">Type</label>
              <div className="cwp-type-btns">
                <button
                  className={`cwp-type-btn ${exType === 'reps' ? 'cwp-type-active' : ''}`}
                  onClick={() => setExType('reps')}
                >
                  Reps
                </button>
                <button
                  className={`cwp-type-btn ${exType === 'timed' ? 'cwp-type-active' : ''}`}
                  onClick={() => setExType('timed')}
                >
                  Timed
                </button>
              </div>
            </div>
          </div>
          <div className="cwp-add-row">
            {exType === 'reps' ? (
              <Input
                id="ex-reps"
                label="Reps per set"
                type="number"
                value={exReps}
                onChange={e => setExReps(e.target.value)}
              />
            ) : (
              <Input
                id="ex-duration"
                label="Duration (seconds)"
                type="number"
                value={exDuration}
                onChange={e => setExDuration(e.target.value)}
              />
            )}
            <Input
              id="ex-rest"
              label="Rest (seconds)"
              type="number"
              value={exRest}
              onChange={e => setExRest(e.target.value)}
            />
          </div>
          <div className="cwp-add-actions">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" icon={IoAdd} onClick={addExercise}>Add Exercise</Button>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="cwp-save">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon={IoSave}
          onClick={savePlan}
          disabled={exercises.length === 0 || !planName.trim()}
        >
          {editPlan ? 'Update Plan' : 'Save Plan'}
        </Button>
      </div>
    </div>
  );
}
