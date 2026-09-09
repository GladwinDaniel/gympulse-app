import { useState, useMemo } from 'react';
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
  saveWeeklyRoutine,
  getWeeklyRoutines,
  STARTER_WEEKLY_ROUTINE,
  DEFAULT_WEEK_DAYS
} from '../../data/exercisesData';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  IoAdd,
  IoSearch,
  IoSend,
  IoBarbell,
  IoCheckmarkCircle,
  IoPerson,
  IoSparkles,
  IoChevronDown,
  IoChevronUp
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import './StaffAnatomyPlannerPage.css';

const TABS = [
  { id: 'anatomy', key: 'anatomy', label: 'Anatomy Explorer & Exercises' },
  { id: 'builder', key: 'builder', label: 'Build 7-Day Program' },
  { id: 'templates', key: 'templates', label: 'Saved Programs & Templates' },
];

export default function StaffAnatomyPlannerPage() {
  const [activeTab, setActiveTab] = useState('anatomy');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showCreateExModal, setShowCreateExModal] = useState(false);

  // Weekly routine being crafted by trainer
  const [routine, setRoutine] = useState(() => {
    return {
      id: `trainer-program-${Date.now()}`,
      name: 'Trainer Hypertrophy Protocol',
      description: 'Personalized 7-day routine tailored for progressive overload.',
      days: DEFAULT_WEEK_DAYS.map(d => ({ ...d, exercises: [] })),
      createdAt: new Date().toISOString(),
    };
  });

  const [savedTemplates, setSavedTemplates] = useState(() => getWeeklyRoutines());
  const [exercisesList, setExercisesList] = useState(() => getAllExercises());
  const [expandedIds, setExpandedIds] = useState(new Set());

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Assign to Member modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [assignDuration, setAssignDuration] = useState('4-weeks');

  // Add Exercise to Routine modal
  const [exerciseToAdd, setExerciseToAdd] = useState(null);
  const [targetDay, setTargetDay] = useState('Monday');
  const [addSets, setAddSets] = useState('3');
  const [addReps, setAddReps] = useState('12');
  const [addDuration, setAddDuration] = useState('45');
  const [addRest, setAddRest] = useState('60');

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
      if (selectedMuscle && ex.muscle !== selectedMuscle && !ex.secondaryMuscles?.includes(selectedMuscle)) {
        return false;
      }
      if (equipmentFilter !== 'all' && ex.equipment?.toLowerCase() !== equipmentFilter.toLowerCase()) {
        return false;
      }
      if (difficultyFilter !== 'all' && ex.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.muscle.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscle) return false;
      }
      return true;
    });
  }, [exercisesList, selectedMuscle, equipmentFilter, difficultyFilter, searchQuery]);

  const [members, setMembers] = useState([]);

  // Fetch real members from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'member'));
      const unsub = onSnapshot(q, (snap) => {
        setMembers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      }, (err) => {
        console.warn('Firestore members fetch error:', err);
      });
      return () => unsub();
    } catch {}
  }, []);

  // Filter active members for assignment
  const activeMembers = useMemo(() => {
    return members.filter(m => m.isActive !== false && (
      (m.name || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(memberSearch.toLowerCase())
    ));
  }, [members, memberSearch]);

  function openAddModal(ex) {
    setExerciseToAdd(ex);
    setAddSets(String(ex.defaultSets || 3));
    setAddReps(String(ex.defaultReps || 12));
    setAddDuration(String(ex.defaultDuration || 45));
    setAddRest(String(ex.defaultRest != null ? ex.defaultRest : 60));
  }

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
      isRest: false,
      exercises: [...(targetDayObj.exercises || []), newExEntry],
    };

    const updated = { ...routine, days };
    setRoutine(updated);
    saveWeeklyRoutine(updated);
    toast.success(`Added ${exerciseToAdd.name} to ${targetDay}!`);
    setExerciseToAdd(null);
  }

  function handleSaveTemplate(toSave) {
    const saved = saveWeeklyRoutine(toSave);
    setRoutine(saved);
    setSavedTemplates(getWeeklyRoutines());
    toast.success(`Template "${saved.name}" saved to gym database!`);
  }

  function handleConfirmAssignment() {
    if (!selectedMember) {
      toast.error('Please select a member to assign this routine to');
      return;
    }

    // Save routine to member's local slot
    const assignedPayload = {
      ...routine,
      assignedBy: 'Trainer Sarah Connor',
      assignedTo: selectedMember.name,
      assignedAt: new Date().toISOString(),
      duration: assignDuration,
    };

    // Save assignment record in localStorage
    const existing = JSON.parse(localStorage.getItem('gympulse_trainer_assignments') || '[]');
    localStorage.setItem('gympulse_trainer_assignments', JSON.stringify([assignedPayload, ...existing]));

    toast.success(`Successfully assigned "${routine.name}" to ${selectedMember.name}!`);
    setShowAssignModal(false);
    setSelectedMember(null);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="sap-header-row">
          <div>
            <h1 className="page-title">Trainer Anatomy & Program Builder</h1>
            <p className="page-subtitle">
              Interactive body anatomy research, custom exercise generator, and 7-day member routine assignment.
            </p>
          </div>

          <div className="sap-actions">
            <Button
              variant="secondary"
              icon={IoSend}
              size="sm"
              onClick={() => setShowAssignModal(true)}
            >
              Assign to Member
            </Button>
            <Button
              variant="primary"
              icon={IoAdd}
              size="sm"
              onClick={() => setShowCreateExModal(true)}
            >
              New Exercise
            </Button>
          </div>
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB 1: ANATOMY & EXERCISES */}
      {activeTab === 'anatomy' && (
        <div className="sap-tab-content animate-fade-in">
          <BodyAnatomyMap
            selectedMuscle={selectedMuscle}
            onSelectMuscle={setSelectedMuscle}
            exerciseCounts={exerciseCounts}
          />

          {/* Filter Bar */}
          <div className="sap-filter-bar">
            <div className="sap-search-input">
              <IoSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search exercises by name, equipment, muscle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            <div className="sap-select-filters">
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className="sap-filter-select"
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
                className="sap-filter-select"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Header count */}
          <div className="sap-results-header">
            <h4>
              {selectedMuscle
                ? `${MUSCLE_GROUPS[selectedMuscle]?.name || selectedMuscle} Exercises`
                : 'All Exercises Library'}{' '}
              <span className="results-count">({filteredExercises.length})</span>
            </h4>
          </div>

          {/* Exercise Grid */}
          <div className="sap-exercises-grid stagger-children">
            {filteredExercises.map((ex) => {
              const isExpanded = expandedIds.has(ex.id);
              return (
                <Card key={ex.id} className="sap-exercise-card" padding="md">
                  <div className="sap-card-top">
                    <div className="sap-card-tags">
                      <span className="muscle-badge" style={{ background: MUSCLE_GROUPS[ex.muscle]?.color || 'var(--accent-primary)' }}>
                        {MUSCLE_GROUPS[ex.muscle]?.name.split(' ')[0] || ex.muscle}
                      </span>
                      <Badge variant="default" size="sm">{ex.equipment}</Badge>
                      {ex.isCustom && <Badge variant="primary" size="sm">Custom</Badge>}
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

                  <h4 className="sap-card-name">{ex.name}</h4>

                  <div className="sap-card-footer">
                    <span className="sap-default-spec">
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
                      <p className="sap-card-instructions">{ex.instructions}</p>
                      {ex.tips && (
                        <div className="sap-card-tip">
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

      {/* TAB 2: 7-DAY PROGRAM BUILDER */}
      {activeTab === 'builder' && (
        <div className="sap-tab-content animate-fade-in">
          <WeeklyRoutineBuilder
            routine={routine}
            onUpdateRoutine={setRoutine}
            onSaveRoutine={handleSaveTemplate}
            isTrainer={true}
            onAssignToMember={() => setShowAssignModal(true)}
            onOpenAnatomyToBrowse={(dayName) => {
              setTargetDay(dayName);
              setActiveTab('anatomy');
              toast(`Browsing exercises for ${dayName}. Click "+ Add to Program" on any exercise.`, { icon: '🎯' });
            }}
          />
        </div>
      )}

      {/* TAB 3: SAVED TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="sap-tab-content animate-fade-in">
          <div className="sap-templates-grid">
            {savedTemplates.map((tpl) => {
              const trainingDays = tpl.days?.filter(d => !d.isRest && d.exercises?.length > 0).length || 0;
              const totalSets = tpl.days?.reduce((acc, d) => acc + (d.exercises?.reduce((sum, e) => sum + (e.sets || 3), 0) || 0), 0) || 0;

              return (
                <Card key={tpl.id} className="sap-template-card" padding="md">
                  <div className="template-header">
                    <h4>{tpl.name}</h4>
                  </div>
                  <p className="template-desc">{tpl.description || 'Pre-designed 7-day program template'}</p>
                  <div className="template-meta">
                    <Badge variant="default" size="sm">{trainingDays} Training Days</Badge>
                    <Badge variant="default" size="sm">{totalSets} Weekly Sets</Badge>
                  </div>
                  <div className="template-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRoutine(tpl);
                        setActiveTab('builder');
                        toast.success(`Loaded "${tpl.name}" into Program Builder!`);
                      }}
                    >
                      Load into Builder
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={IoSend}
                      onClick={() => {
                        setRoutine(tpl);
                        setShowAssignModal(true);
                      }}
                    >
                      Assign to Member
                    </Button>
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
        onCreated={refreshExercises}
      />

      {/* Add Exercise to Day Modal */}
      {exerciseToAdd && (
        <Modal
          isOpen={Boolean(exerciseToAdd)}
          onClose={() => setExerciseToAdd(null)}
          title={`Add to Program: ${exerciseToAdd.name}`}
          size="md"
        >
          <div className="sap-modal-form">
            <p className="sap-modal-sub">
              Target: <strong>{MUSCLE_GROUPS[exerciseToAdd.muscle]?.name}</strong> ({exerciseToAdd.equipment})
            </p>

            <div>
              <label className="sap-modal-label">Assign to Day</label>
              <select
                value={targetDay}
                onChange={(e) => setTargetDay(e.target.value)}
                className="sap-modal-select"
              >
                {routine.days.map((d) => (
                  <option key={d.day} value={d.day}>
                    {d.day} {d.label ? `— ${d.label}` : ''} {d.isRest ? '[Rest Day]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="sap-modal-grid-3">
              <Input
                id="staff-add-sets"
                label="Sets"
                type="number"
                min="1"
                max="10"
                value={addSets}
                onChange={(e) => setAddSets(e.target.value)}
              />

              {exerciseToAdd.type === 'reps' ? (
                <Input
                  id="staff-add-reps"
                  label="Target Reps"
                  type="number"
                  min="1"
                  max="100"
                  value={addReps}
                  onChange={(e) => setAddReps(e.target.value)}
                />
              ) : (
                <Input
                  id="staff-add-sec"
                  label="Duration (s)"
                  type="number"
                  min="5"
                  max="600"
                  value={addDuration}
                  onChange={(e) => setAddDuration(e.target.value)}
                />
              )}

              <Input
                id="staff-add-rest"
                label="Rest (sec)"
                type="number"
                min="0"
                max="300"
                value={addRest}
                onChange={(e) => setAddRest(e.target.value)}
              />
            </div>

            <div className="sap-modal-actions">
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

      {/* Assign Routine to Member Modal */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title={`Assign Routine: "${routine.name}"`}
          size="lg"
        >
          <div className="sap-assign-modal-content">
            <div className="sap-search-input" style={{ marginBottom: 'var(--space-3)' }}>
              <IoSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>

            <div className="sap-member-select-list">
              {activeMembers.map((m) => {
                const isChosen = selectedMember?.uid === m.uid;
                return (
                  <div
                    key={m.uid}
                    className={`sap-member-row ${isChosen ? 'chosen' : ''}`}
                    onClick={() => setSelectedMember(m)}
                  >
                    <div className="sap-member-info">
                      <IoPerson className="member-avatar-icon" />
                      <div>
                        <strong>{m.name}</strong>
                        <span>{m.email}</span>
                      </div>
                    </div>
                    <div className="sap-member-badges">
                      {m.membershipType === 'pt' && <Badge variant="primary">PT Member</Badge>}
                      {isChosen && <IoCheckmarkCircle className="check-icon" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 'var(--space-3)' }}>
              <label className="sap-modal-label">Assignment Duration</label>
              <select
                value={assignDuration}
                onChange={(e) => setAssignDuration(e.target.value)}
                className="sap-modal-select"
              >
                <option value="1-week">1 Week (Sprint Trial)</option>
                <option value="2-weeks">2 Weeks</option>
                <option value="4-weeks">4 Weeks (Standard Mesocycle)</option>
                <option value="8-weeks">8 Weeks (Full Hypertrophy Cycle)</option>
              </select>
            </div>

            <div className="sap-modal-actions" style={{ marginTop: 'var(--space-4)' }}>
              <Button variant="ghost" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={IoSend}
                disabled={!selectedMember}
                onClick={handleConfirmAssignment}
              >
                Assign to {selectedMember ? selectedMember.name : 'Selected Member'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
