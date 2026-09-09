import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_MEMBERS } from '../../data/demoData';
import { WORKOUT_CATEGORIES } from '../../data/workoutData';
import { PREDEFINED_DIET_PLANS } from '../../data/dietData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TabBar from '../../components/ui/TabBar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import {
  IoBarbell,
  IoNutrition,
  IoAdd,
  IoPerson,
  IoSend,
  IoCheckmarkCircle,
  IoSearch,
  IoCreateOutline,
  IoSave,
  IoArrowForward
} from 'react-icons/io5';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import './PlansPage.css';

const tabs = [
  { key: 'workout', label: 'Workout Plans' },
  { key: 'diet', label: 'Diet Plans' },
  { key: 'assign', label: 'Assign to Member' },
];

export default function StaffPlansPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workout');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assignType, setAssignType] = useState('workout'); // workout | diet
  const [assignDuration, setAssignDuration] = useState('week'); // day | week | month
  const [memberSearch, setMemberSearch] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [workoutList, setWorkoutList] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('gympulse_staff_workout_plans') || '{}');
    return Object.values(WORKOUT_CATEGORIES).map(plan => saved[plan.id] || plan);
  });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editingDayIndex, setEditingDayIndex] = useState(0);
  const [editWorkoutName, setEditWorkoutName] = useState('');
  const [editWorkoutDescription, setEditWorkoutDescription] = useState('');
  const [editDayLabel, setEditDayLabel] = useState('');
  const [editExercises, setEditExercises] = useState([]);

  const activeMembers = DEMO_MEMBERS.filter(m => m.isActive);
  const filteredMembers = activeMembers.filter(m =>
    m.name?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  function openWorkoutEditor(plan) {
    setEditingWorkout(plan);
    setEditWorkoutName(plan.name);
    setEditWorkoutDescription(plan.description);
    setEditingDayIndex(0);
    setEditDayLabel(plan.weekPlan[0]?.label || '');
    setEditExercises(plan.weekPlan[0]?.exercises || []);
  }

  function selectEditDay(index) {
    const day = editingWorkout.weekPlan[index];
    setEditingDayIndex(index);
    setEditDayLabel(day.label || '');
    setEditExercises(day.exercises || []);
  }

  function updateEditExercise(index, field, value) {
    setEditExercises(previous => previous.map((exercise, exerciseIndex) => (
      exerciseIndex === index ? { ...exercise, [field]: value } : exercise
    )));
  }

  function saveWorkoutEdits() {
    if (!editWorkoutName.trim()) {
      toast.error('Workout plan name is required');
      return;
    }

    const updatedPlan = {
      ...editingWorkout,
      name: editWorkoutName.trim(),
      description: editWorkoutDescription.trim(),
      source: 'staff',
      weekPlan: editingWorkout.weekPlan.map((day, index) => index === editingDayIndex ? {
        ...day,
        label: editDayLabel.trim() || day.label,
        exercises: editExercises.map(exercise => ({
          ...exercise,
          sets: Number(exercise.sets) || 1,
          reps: exercise.reps === null ? null : Number(exercise.reps) || 1,
          duration: exercise.duration === null ? null : Number(exercise.duration) || 1,
          rest: Number(exercise.rest) || 0,
        })),
      } : day),
    };

    const saved = JSON.parse(localStorage.getItem('gympulse_staff_workout_plans') || '{}');
    saved[updatedPlan.id] = updatedPlan;
    localStorage.setItem('gympulse_staff_workout_plans', JSON.stringify(saved));
    setWorkoutList(previous => previous.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
    setSelectedPlan(updatedPlan);
    setEditingWorkout(null);
    toast.success(`"${updatedPlan.name}" updated and ready to assign`);
  }

  function handleAssign() {
    if (!selectedMember || !selectedPlan) {
      toast.error('Select both a member and a plan');
      return;
    }
    const assignment = {
      id: 'assign-' + Date.now(),
      memberId: selectedMember.uid,
      memberName: selectedMember.name,
      planName: selectedPlan.name || selectedPlan.id,
      plan: selectedPlan,
      type: assignType,
      duration: assignDuration,
      assignedAt: new Date().toISOString(),
    };
    setAssignments(prev => [assignment, ...prev]);
    toast.success(`${assignType === 'workout' ? 'Workout' : 'Diet'} plan assigned to ${selectedMember.name}!`);
    setShowAssignModal(false);
    setSelectedMember(null);
    setSelectedPlan(null);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout & Diet Plans</h1>
          <p className="page-subtitle">Edit plans, build with anatomy, and assign to members</p>
        </div>
        <Button variant="secondary" icon={IoArrowForward} onClick={() => navigate('/staff/anatomy-planner')}>
          Build with Anatomy
        </Button>
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Workout Plans Tab */}
      {activeTab === 'workout' && (
        <div className="sp-tab-content animate-fade-in">
          <p className="sp-tab-desc">Predefined workout programs available to all members:</p>
          <div className="sp-plans-grid stagger-children">
            {workoutList.map(cat => (
              <Card key={cat.id} className="sp-plan-card" padding="md">
                <div className="sp-plan-color" style={{ background: cat.gradient }} />
                <div className="sp-plan-info">
                  <h4>{cat.name}</h4>
                  <p className="sp-plan-desc">{cat.description}</p>
                  <div className="sp-plan-meta">
                    <Badge variant="default" size="sm">{cat.duration}</Badge>
                    <Badge variant="default" size="sm">{cat.weekPlan.filter(d => d.exercises.length > 0).length} training days</Badge>
                  </div>
                </div>
                <Button size="sm" variant="ghost" icon={IoCreateOutline} onClick={() => openWorkoutEditor(cat)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline" icon={IoSend} onClick={() => {
                  setAssignType('workout');
                  setSelectedPlan(cat);
                  setShowAssignModal(true);
                }}>
                  Assign
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Diet Plans Tab */}
      {activeTab === 'diet' && (
        <div className="sp-tab-content animate-fade-in">
          <p className="sp-tab-desc">Predefined diet plans available to members:</p>
          <div className="sp-plans-grid stagger-children">
            {PREDEFINED_DIET_PLANS.map(plan => (
              <Card key={plan.id} className="sp-plan-card" padding="md">
                <div className="sp-plan-color" style={{ background: plan.gradient }} />
                <div className="sp-plan-info">
                  <h4>{plan.name}</h4>
                  <p className="sp-plan-desc">{plan.goal} · {plan.calories}</p>
                  <Badge variant="default" size="sm">{plan.meals.length} meals/day</Badge>
                </div>
                <Button size="sm" variant="outline" icon={IoSend} onClick={() => {
                  setAssignType('diet');
                  setSelectedPlan(plan);
                  setShowAssignModal(true);
                }}>
                  Assign
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Assign Tab */}
      {activeTab === 'assign' && (
        <div className="sp-tab-content animate-fade-in">
          <Button variant="primary" icon={IoAdd} onClick={() => setShowAssignModal(true)} className="sp-assign-btn">
            New Assignment
          </Button>

          {assignments.length === 0 ? (
            <EmptyState
              icon={IoCheckmarkCircle}
              title="No assignments yet"
              description="Assign workout or diet plans to members from the tabs above, or click 'New Assignment'"
            />
          ) : (
            <div className="sp-assignments stagger-children">
              {assignments.map(a => (
                <Card key={a.id} className="sp-assign-card" padding="md">
                  <div className="sp-assign-info">
                    <Badge variant={a.type === 'workout' ? 'primary' : 'success'} size="sm">
                      {a.type === 'workout' ? 'Workout' : 'Diet'}
                    </Badge>
                    <h4>{a.planName}</h4>
                    <p className="sp-assign-meta">
                      <IoPerson /> {a.memberName} · {a.duration} · {formatDate(a.assignedAt, 'MMM d')}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Plan to Member"
        size="lg"
      >
        <div className="sp-assign-form">
          {/* Member Selection */}
          <div className="sp-form-section">
            <label className="sp-form-label">Select Member</label>
            <Input
              id="assign-search"
              icon={IoSearch}
              placeholder="Search members..."
              value={memberSearch}
              onChange={e => setMemberSearch(e.target.value)}
            />
            <div className="sp-member-list">
              {filteredMembers.map(m => (
                <button
                  key={m.uid}
                  className={`sp-member-item ${selectedMember?.uid === m.uid ? 'sp-member-active' : ''}`}
                  onClick={() => setSelectedMember(m)}
                >
                  <span className="sp-member-name">{m.name}</span>
                  {m.membershipType === 'pt' && <Badge variant="primary" size="sm">PT</Badge>}
                  {selectedMember?.uid === m.uid && <IoCheckmarkCircle style={{ color: 'var(--accent-secondary)' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Type */}
          <div className="sp-form-section">
            <label className="sp-form-label">Plan Type</label>
            <div className="sp-type-row">
              <button
                className={`sp-type-btn ${assignType === 'workout' ? 'sp-type-active' : ''}`}
                onClick={() => { setAssignType('workout'); setSelectedPlan(null); }}
              >
                <IoBarbell /> Workout
              </button>
              <button
                className={`sp-type-btn ${assignType === 'diet' ? 'sp-type-active' : ''}`}
                onClick={() => { setAssignType('diet'); setSelectedPlan(null); }}
              >
                <IoNutrition /> Diet
              </button>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="sp-form-section">
            <label className="sp-form-label">Select Plan</label>
            <div className="sp-plan-options">
              {(assignType === 'workout' ? workoutList : PREDEFINED_DIET_PLANS).map(p => (
                <button
                  key={p.id}
                  className={`sp-plan-option ${selectedPlan?.id === p.id ? 'sp-plan-option-active' : ''}`}
                  onClick={() => setSelectedPlan(p)}
                >
                  <span>{p.name}</span>
                  {selectedPlan?.id === p.id && <IoCheckmarkCircle style={{ color: 'var(--accent-secondary)' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="sp-form-section">
            <label className="sp-form-label">Duration</label>
            <div className="sp-duration-row">
              {[
                { key: 'day', label: '1 Day' },
                { key: 'week', label: '1 Week' },
                { key: 'month', label: '1 Month' },
                { key: 'ongoing', label: 'Ongoing' },
              ].map(d => (
                <button
                  key={d.key}
                  className={`sp-duration-btn ${assignDuration === d.key ? 'sp-duration-active' : ''}`}
                  onClick={() => setAssignDuration(d.key)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" fullWidth icon={IoCheckmarkCircle} onClick={handleAssign}>
            Assign Plan
          </Button>
        </div>
      </Modal>

      {/* Staff editor for a predefined workout */}
      <Modal
        isOpen={Boolean(editingWorkout)}
        onClose={() => setEditingWorkout(null)}
        title={`Edit Workout: ${editingWorkout?.name || ''}`}
        size="lg"
      >
        {editingWorkout && (
          <div className="sp-workout-editor">
            <Input
              id="staff-workout-name"
              label="Plan Name"
              value={editWorkoutName}
              onChange={e => setEditWorkoutName(e.target.value)}
            />
            <Input
              id="staff-workout-description"
              label="Description"
              value={editWorkoutDescription}
              onChange={e => setEditWorkoutDescription(e.target.value)}
            />

            <div className="sp-editor-days" role="tablist" aria-label="Workout days">
              {editingWorkout.weekPlan.map((day, index) => (
                <button
                  key={day.day}
                  type="button"
                  className={`sp-editor-day ${editingDayIndex === index ? 'sp-editor-day-active' : ''}`}
                  onClick={() => selectEditDay(index)}
                >
                  <strong>{day.day.slice(0, 3)}</strong>
                  <small>{day.exercises.length ? `${day.exercises.length} exercises` : 'Rest'}</small>
                </button>
              ))}
            </div>

            <Input
              id="staff-day-label"
              label={`${editingWorkout.weekPlan[editingDayIndex].day} Focus`}
              value={editDayLabel}
              onChange={e => setEditDayLabel(e.target.value)}
            />

            <div className="sp-editor-exercises">
              {editExercises.length === 0 ? (
                <p className="sp-editor-empty">This is a rest day. Choose another day to edit exercises.</p>
              ) : editExercises.map((exercise, index) => (
                <Card key={`${exercise.name}-${index}`} className="sp-editor-exercise" padding="sm">
                  <strong>{exercise.name}</strong>
                  <div className="sp-editor-fields">
                    <Input id={`staff-sets-${index}`} label="Sets" type="number" value={exercise.sets ?? ''} onChange={e => updateEditExercise(index, 'sets', e.target.value)} />
                    {exercise.duration === null ? (
                      <Input id={`staff-reps-${index}`} label="Reps" type="number" value={exercise.reps ?? ''} onChange={e => updateEditExercise(index, 'reps', e.target.value)} />
                    ) : (
                      <Input id={`staff-duration-${index}`} label="Seconds" type="number" value={exercise.duration ?? ''} onChange={e => updateEditExercise(index, 'duration', e.target.value)} />
                    )}
                    <Input id={`staff-rest-${index}`} label="Rest (s)" type="number" value={exercise.rest ?? ''} onChange={e => updateEditExercise(index, 'rest', e.target.value)} />
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="primary" fullWidth icon={IoSave} onClick={saveWorkoutEdits}>
              Save Workout Changes
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
