import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import TabBar from '../../components/ui/TabBar';
import BodyAnatomyMap from '../../components/anatomy/BodyAnatomyMap';
import CreateExerciseModal from '../../components/anatomy/CreateExerciseModal';
import WeeklyRoutineBuilder from '../../components/anatomy/WeeklyRoutineBuilder';
import {
  MUSCLE_GROUPS,
  getAllExercises,
  getActiveWeeklySchedule,
  setActiveWeeklySchedule,
  saveWeeklyRoutine,
  getWeeklyRoutines,
  STARTER_WEEKLY_ROUTINE,
  DEFAULT_WEEK_DAYS
} from '../../data/exercisesData';
import {
  IoArrowBack,
  IoAdd,
  IoSearch,
  IoFilter,
  IoBarbell,
  IoTime,
  IoRepeat,
  IoCheckmarkCircle,
  IoSparkles,
  IoCalendar,
  IoTrash,
  IoChevronDown,
  IoChevronUp
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import './AnatomyPlannerPage.css';

const TABS = [
  { id: 'anatomy', key: 'anatomy', label: 'Body Anatomy & Exercises' },
  { id: 'routine', key: 'routine', label: '7-Day Weekly Routine' },
  { id: 'saved', key: 'saved', label: 'Saved Routines' },
];

export default function AnatomyPlannerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('anatomy');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showCreateExModal, setShowCreateExModal] = useState(false);

  // Weekly routine state
  const [routine, setRoutine] = useState(() => getActiveWeeklySchedule());
  const [savedRoutines, setSavedRoutines] = useState(() => getWeeklyRoutines());
  const [expandedIds, setExpandedIds] = useState(new Set());

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Add Exercise to Day modal state
  const [exerciseToAdd, setExerciseToAdd] = useState(null);
  const [targetDay, setTargetDay] = useState('Monday');
  const [addSets, setAddSets] = useState('3');
  const [addReps, setAddReps] = useState('12');
  const [addDuration, setAddDuration] = useState('45');
  const [addRest, setAddRest] = useState('60');

  // Load all exercises (builtin + locally saved custom)
  const [exercisesList, setExercisesList] = useState(() => getAllExercises());

  function refreshExercises() {
    setExercisesList(getAllExercises());
  }

  // Count exercises per muscle
  const exerciseCounts = useMemo(() => {
    const counts = {};
    Object.keys(MUSCLE_GROUPS).forEach(mId => {
      counts[mId] = exercisesList.filter(
        e => e.muscle === mId || e.secondaryMuscles?.includes(mId)
      ).length;
    });
    return counts;
  }, [exercisesList]);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercisesList.filter(ex => {
      // Muscle filter
      if (selectedMuscle && ex.muscle !== selectedMuscle && !ex.secondaryMuscles?.includes(selectedMuscle)) {
        return false;
      }
      // Equipment filter
      if (equipmentFilter !== 'all' && ex.equipment?.toLowerCase() !== equipmentFilter.toLowerCase()) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== 'all' && ex.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.muscle.toLowerCase().includes(q);
        const matchesEq = ex.equipment?.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscle && !matchesEq) return false;
      }
      return true;
    });
  }, [exercisesList, selectedMuscle, equipmentFilter, difficultyFilter, searchQuery]);

  // Open "Add to Day" modal
  function openAddModal(ex, preferredDay = null) {
    setExerciseToAdd(ex);
    setTargetDay(preferredDay || 'Monday');
    setAddSets(String(ex.defaultSets || 3));
    setAddReps(String(ex.defaultReps || 12));
    setAddDuration(String(ex.defaultDuration || 45));
    setAddRest(String(ex.defaultRest != null ? ex.defaultRest : 60));
  }

  // Confirm adding exercise to day
  function handleConfirmAddToDay() {
    if (!exerciseToAdd) return;

    const days = [...routine.days];
    const dayIdx = days.findIndex(d => d.day === targetDay);
    if (dayIdx === -1) return;

    const targetDayObj = days[dayIdx];
    const newExEntry = {
      id: exerciseToAdd.id,
      name: exerciseToAdd.name,
      muscle: exerciseToAdd.muscle,
      sets: parseInt(addSets, 10) || 3,
      reps: exerciseToAdd.type === 'reps' ? (parseInt(addReps, 10) || 12) : null,
      duration: exerciseToAdd.type === 'timed' ? (parseInt(addDuration, 10) || 45) : null,
      rest: parseInt(addRest, 10) || 60,
    };

    days[dayIdx] = {
      ...targetDayObj,
      isRest: false, // unmark rest if adding exercise
      exercises: [...(targetDayObj.exercises || []), newExEntry],
    };

    const updatedRoutine = { ...routine, days };
    setRoutine(updatedRoutine);
    saveWeeklyRoutine(updatedRoutine);
    setActiveWeeklySchedule(updatedRoutine);

    toast.success(`Added ${exerciseToAdd.name} to ${targetDay}!`);
    setExerciseToAdd(null);
  }

  // Save routine handler
  function handleSaveRoutine(updatedRoutine) {
    const saved = saveWeeklyRoutine(updatedRoutine);
    setActiveWeeklySchedule(saved);
    setRoutine(saved);
    setSavedRoutines(getWeeklyRoutines());
    toast.success(`"${saved.name}" saved and set as your active weekly schedule!`);
  }

  // Switch active routine from saved list
  function handleSelectSavedRoutine(r) {
    setRoutine(r);
    setActiveWeeklySchedule(r);
    toast.success(`Switched active schedule to "${r.name}"!`);
    setActiveTab('routine');
  }

  // Create new blank routine
  function handleCreateNewRoutine() {
    const blank = {
      id: `routine-custom-${Date.now()}`,
      name: 'My New 7-Day Plan',
      description: 'Custom weekly routine created with body anatomy.',
      days: DEFAULT_WEEK_DAYS.map(d => ({ ...d, exercises: [] })),
      createdAt: new Date().toISOString(),
    };
    setRoutine(blank);
    saveWeeklyRoutine(blank);
    setActiveWeeklySchedule(blank);
    setSavedRoutines(getWeeklyRoutines());
    toast.success('New blank routine created! Add exercises from the Anatomy map.');
    setActiveTab('routine');
  }

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="ap-top-nav">
        <Button variant="ghost" icon={IoArrowBack} onClick={() => navigate(-1)} className="back-btn">
          Back
        </Button>
      </div>

      <div className="page-header">
        <div className="ap-header-row">
          <div>
            <h1 className="page-title">Body Anatomy & Weekly Planner</h1>
            <p className="page-subtitle">
              Click muscles to research workouts, invent custom exercises, and build your 7-day routine.
            </p>
          </div>
          <Button
            variant="primary"
            icon={IoAdd}
            size="sm"
            onClick={() => setShowCreateExModal(true)}
          >
            Create Exercise
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB 1: ANATOMY & EXERCISES */}
      {activeTab === 'anatomy' && (
        <div className="ap-tab-content animate-fade-in">
          {/* Visual Interactive Human Body Diagram */}
          <BodyAnatomyMap
            selectedMuscle={selectedMuscle}
            onSelectMuscle={setSelectedMuscle}
            exerciseCounts={exerciseCounts}
          />

          {/* Search & Filter Bar */}
          <div className="ap-filter-bar">
            <div className="ap-search-input">
              <IoSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search exercises, techniques, equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="ap-select-filters">
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className="ap-filter-select"
              >
                <option value="all">All Equipment</option>
                <option value="Barbell">Barbell</option>
                <option value="Dumbbells">Dumbbells</option>
                <option value="Cable">Cable</option>
                <option value="Machine">Machine</option>
                <option value="Bodyweight">Bodyweight</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="ap-filter-select"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Results Summary Header */}
          <div className="ap-results-header">
            <h4>
              {selectedMuscle
                ? `${MUSCLE_GROUPS[selectedMuscle]?.name || selectedMuscle} Exercises`
                : 'All Exercises'}{' '}
              <span className="results-count">({filteredExercises.length})</span>
            </h4>
            <div className="ap-quick-add-tip">
              <span>💡 Click "+ Add to Week" to schedule into your 7-day routine</span>
            </div>
          </div>

          {/* Exercises Cards Grid */}
          <div className="ap-exercises-grid stagger-children">
            {filteredExercises.map((ex) => {
              const isExpanded = expandedIds.has(ex.id);
              return (
                <Card key={ex.id} className="ap-exercise-card" padding="md">
                  <div className="ap-card-top">
                    <div className="ap-card-tags">
                      <span className="muscle-badge" style={{ background: MUSCLE_GROUPS[ex.muscle]?.color || 'var(--accent-primary)' }}>
                        {MUSCLE_GROUPS[ex.muscle]?.name.split(' ')[0] || ex.muscle}
                      </span>
                      <Badge variant="default" size="sm">{ex.equipment}</Badge>
                      {ex.isCustom && (
                        <Badge variant="primary" size="sm">Custom</Badge>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={IoAdd}
                      onClick={() => openAddModal(ex)}
                    >
                      + Add
                    </Button>
                  </div>

                  <h4 className="ap-card-name">{ex.name}</h4>

                  <div className="ap-card-footer">
                    <span className="ap-default-spec">
                      {ex.defaultSets} sets × {ex.type === 'reps' ? `${ex.defaultReps} reps` : `${ex.defaultDuration}s`} · {ex.defaultRest}s
                    </span>

                    <button
                      type="button"
                      className="ap-toggle-details-btn"
                      onClick={() => toggleExpand(ex.id)}
                    >
                      <span>{isExpanded ? 'Hide' : 'Technique'}</span>
                      {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="ap-expanded-content animate-fade-in">
                      <p className="ap-card-instructions">{ex.instructions}</p>
                      {ex.tips && (
                        <div className="ap-card-tip">
                          <IoSparkles className="tip-sparkle" />
                          <span>{ex.tips}</span>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 7-DAY WEEKLY ROUTINE */}
      {activeTab === 'routine' && (
        <div className="ap-tab-content animate-fade-in">
          <WeeklyRoutineBuilder
            routine={routine}
            onUpdateRoutine={setRoutine}
            onSaveRoutine={handleSaveRoutine}
            onOpenAnatomyToBrowse={(dayName) => {
              setTargetDay(dayName);
              setActiveTab('anatomy');
              toast(`Browsing exercises for ${dayName}. Click "+ Add to Week" on any exercise.`, { icon: '🎯' });
            }}
          />
        </div>
      )}

      {/* TAB 3: SAVED ROUTINES */}
      {activeTab === 'saved' && (
        <div className="ap-tab-content animate-fade-in">
          <div className="ap-saved-header">
            <div>
              <h3>My Weekly Routine Templates</h3>
              <p>Switch your active training schedule or create a fresh 7-day program.</p>
            </div>
            <Button
              variant="primary"
              icon={IoAdd}
              size="sm"
              onClick={handleCreateNewRoutine}
            >
              + Create New Routine
            </Button>
          </div>

          <div className="ap-saved-grid">
            {savedRoutines.map((r) => {
              const isActive = r.id === routine?.id;
              const trainingDaysCount = r.days?.filter(d => !d.isRest && d.exercises?.length > 0).length || 0;
              const totalSets = r.days?.reduce((acc, d) => acc + (d.exercises?.reduce((sum, e) => sum + (e.sets || 3), 0) || 0), 0) || 0;

              return (
                <Card key={r.id} className={`ap-saved-card ${isActive ? 'is-active-routine' : ''}`} padding="md">
                  <div className="saved-card-header">
                    <h4>{r.name}</h4>
                    {isActive && <Badge variant="primary" dot>Active Schedule</Badge>}
                  </div>

                  <p className="saved-card-desc">{r.description || '7-Day weekly workout split'}</p>

                  <div className="saved-card-meta">
                    <Badge variant="default" size="sm">{trainingDaysCount} Training Days</Badge>
                    <Badge variant="default" size="sm">{totalSets} Total Weekly Sets</Badge>
                  </div>

                  <div className="saved-card-actions">
                    {isActive ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveTab('routine')}
                      >
                        Edit Active Routine
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={IoCheckmarkCircle}
                        onClick={() => handleSelectSavedRoutine(r)}
                      >
                        Set as Active
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Custom Exercise Modal */}
      <CreateExerciseModal
        isOpen={showCreateExModal}
        onClose={() => setShowCreateExModal(false)}
        initialMuscle={selectedMuscle}
        onCreated={() => {
          refreshExercises();
        }}
      />

      {/* Add Exercise to Day Modal */}
      {exerciseToAdd && (
        <Modal
          isOpen={Boolean(exerciseToAdd)}
          onClose={() => setExerciseToAdd(null)}
          title={`Add to Weekly Routine: ${exerciseToAdd.name}`}
          size="md"
        >
          <div className="ap-add-modal-content">
            <p className="ap-add-sub">
              Target Muscle: <strong>{MUSCLE_GROUPS[exerciseToAdd.muscle]?.name || exerciseToAdd.muscle}</strong> ({exerciseToAdd.equipment})
            </p>

            <div className="ap-modal-field">
              <label className="ap-modal-label">Assign to Day of the Week</label>
              <select
                value={targetDay}
                onChange={(e) => setTargetDay(e.target.value)}
                className="ap-modal-select"
              >
                {routine.days.map((d) => (
                  <option key={d.day} value={d.day}>
                    {d.day} {d.label ? `— (${d.label})` : ''} {d.isRest ? '[Rest Day]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="ap-modal-grid-3">
              <Input
                id="add-sets"
                label="Sets"
                type="number"
                min="1"
                max="10"
                value={addSets}
                onChange={(e) => setAddSets(e.target.value)}
              />

              {exerciseToAdd.type === 'reps' ? (
                <Input
                  id="add-reps"
                  label="Target Reps"
                  type="number"
                  min="1"
                  max="100"
                  value={addReps}
                  onChange={(e) => setAddReps(e.target.value)}
                />
              ) : (
                <Input
                  id="add-sec"
                  label="Duration (sec)"
                  type="number"
                  min="5"
                  max="600"
                  value={addDuration}
                  onChange={(e) => setAddDuration(e.target.value)}
                />
              )}

              <Input
                id="add-rest"
                label="Rest (sec)"
                type="number"
                min="0"
                max="300"
                value={addRest}
                onChange={(e) => setAddRest(e.target.value)}
              />
            </div>

            <div className="ap-modal-actions">
              <Button variant="ghost" onClick={() => setExerciseToAdd(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={IoAdd} onClick={handleConfirmAddToDay}>
                Add to {targetDay}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
