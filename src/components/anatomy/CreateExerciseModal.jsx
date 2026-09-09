import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MUSCLE_GROUPS, saveCustomExercise } from '../../data/exercisesData';
import { IoAdd, IoBarbell } from 'react-icons/io5';
import toast from 'react-hot-toast';

const EQUIPMENT_OPTIONS = [
  'Barbell',
  'Dumbbells',
  'Cable',
  'Machine',
  'Bodyweight',
  'Kettlebell',
  'Resistance Band',
  'Smith Machine',
];

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateExerciseModal({ isOpen, onClose, onCreated, initialMuscle = null }) {
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState(initialMuscle || 'chest');
  const [equipment, setEquipment] = useState('Dumbbells');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [type, setType] = useState('reps'); // reps | timed
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('12');
  const [duration, setDuration] = useState('45');
  const [rest, setRest] = useState('60');
  const [instructions, setInstructions] = useState('');
  const [tips, setTips] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Exercise name is required');
      return;
    }

    const newExercise = {
      name: name.trim(),
      muscle,
      secondaryMuscles: [],
      equipment,
      difficulty,
      type,
      defaultSets: parseInt(sets, 10) || 3,
      defaultReps: type === 'reps' ? (parseInt(reps, 10) || 12) : null,
      defaultDuration: type === 'timed' ? (parseInt(duration, 10) || 45) : null,
      defaultRest: parseInt(rest, 10) || 60,
      instructions: instructions.trim() || 'Perform smoothly with controlled eccentric phase and full mind-muscle connection.',
      tips: tips.trim() || 'Breathe out on exertion and maintain solid posture throughout the set.',
    };

    const created = saveCustomExercise(newExercise);
    toast.success(`"${created.name}" created and added to your exercise library!`);
    onCreated?.(created);
    onClose();

    // Reset fields
    setName('');
    setInstructions('');
    setTips('');
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Exercise"
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          id="custom-ex-name"
          label="Exercise Name"
          placeholder="e.g. Incline Cable Hex Press"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Muscle Group Selector */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
            Primary Target Muscle
          </label>
          <select
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)'
            }}
          >
            {Object.values(MUSCLE_GROUPS).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment & Difficulty Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
              Equipment
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}
            >
              {EQUIPMENT_OPTIONS.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}
            >
              {DIFFICULTY_OPTIONS.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Type selector (Reps vs Timed) */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
            Exercise Metric
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => setType('reps')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: type === 'reps' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: type === 'reps' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
              }}
            >
              Reps (Weight Lifting)
            </button>
            <button
              type="button"
              onClick={() => setType('timed')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: type === 'timed' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: type === 'timed' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
              }}
            >
              Timed (Plank, Cardio, Isometrics)
            </button>
          </div>
        </div>

        {/* Sets, Reps/Duration, Rest */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          <Input
            id="ex-sets"
            label="Sets"
            type="number"
            min="1"
            max="10"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          {type === 'reps' ? (
            <Input
              id="ex-reps"
              label="Reps"
              type="number"
              min="1"
              max="100"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          ) : (
            <Input
              id="ex-duration"
              label="Seconds"
              type="number"
              min="5"
              max="600"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          )}
          <Input
            id="ex-rest"
            label="Rest (sec)"
            type="number"
            min="0"
            max="300"
            value={rest}
            onChange={(e) => setRest(e.target.value)}
          />
        </div>

        {/* Instructions & Coaching Cues */}
        <Input
          id="custom-instructions"
          label="Execution Instructions"
          as="textarea"
          rows={2}
          placeholder="Step-by-step technique cues..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <Input
          id="custom-tips"
          label="Pro Coaching Tips"
          placeholder="e.g. Keep chest high, pause at top..."
          value={tips}
          onChange={(e) => setTips(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" icon={IoAdd} type="submit">
            Save Exercise
          </Button>
        </div>
      </form>
    </Modal>
  );
}
