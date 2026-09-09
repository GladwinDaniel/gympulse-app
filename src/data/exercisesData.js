// Comprehensive Exercise & Anatomy Database

export const MUSCLE_GROUPS = {
  // Front View
  chest: {
    id: 'chest',
    name: 'Chest (Pectorals)',
    view: 'front',
    description: 'Pectoralis major and minor muscles responsible for pushing movements and arm adduction.',
    color: '#ff4757',
  },
  shoulders: {
    id: 'shoulders',
    name: 'Shoulders (Deltoids)',
    view: 'both',
    description: 'Anterior, lateral, and posterior deltoid heads for arm elevation and rotation.',
    color: '#ff6b81',
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps Brachii',
    view: 'front',
    description: 'Two-headed front upper arm muscle responsible for elbow flexion and forearm supination.',
    color: '#ffa502',
  },
  forearms: {
    id: 'forearms',
    name: 'Forearms & Grip',
    view: 'both',
    description: 'Brachioradialis, flexors, and extensors crucial for grip strength and wrist stability.',
    color: '#eccc68',
  },
  'abs-core': {
    id: 'abs-core',
    name: 'Abs & Core',
    view: 'front',
    description: 'Rectus abdominis, obliques, and transverse abdominis for core stability and trunk flexion.',
    color: '#2ed573',
  },
  quads: {
    id: 'quads',
    name: 'Quadriceps',
    view: 'front',
    description: 'Four large muscles on the front of the thigh essential for knee extension and squatting power.',
    color: '#1e90ff',
  },
  calves: {
    id: 'calves',
    name: 'Calves (Gastrocnemius & Soleus)',
    view: 'both',
    description: 'Lower leg muscles for ankle plantar flexion and jumping propulsion.',
    color: '#70a1ff',
  },

  // Back View
  'upper-back': {
    id: 'upper-back',
    name: 'Upper Back & Traps',
    view: 'back',
    description: 'Trapezius, rhomboids, and rear delts responsible for scapular retraction and posture.',
    color: '#9b59b6',
  },
  lats: {
    id: 'lats',
    name: 'Lats (Latissimus Dorsi)',
    view: 'back',
    description: 'Broadest muscle of the back giving the V-taper physique, responsible for pulling motions.',
    color: '#8e44ad',
  },
  'lower-back': {
    id: 'lower-back',
    name: 'Lower Back (Erector Spinae)',
    view: 'back',
    description: 'Spinal erectors that stabilize the spine during deadlifts, squats, and daily movements.',
    color: '#5352ed',
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps Brachii',
    view: 'back',
    description: 'Three-headed muscle on the back of the upper arm responsible for elbow extension.',
    color: '#ff7f50',
  },
  glutes: {
    id: 'glutes',
    name: 'Glutes (Gluteus Maximus & Medius)',
    view: 'back',
    description: 'The largest muscle in the human body, providing hip extension, power, and pelvic alignment.',
    color: '#3742fa',
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Hamstrings',
    view: 'back',
    description: 'Posterior thigh muscles for knee flexion, hip extension, and sprinting mechanics.',
    color: '#2f3542',
  },
};

export const BUILTIN_EXERCISES = [
  // CHEST
  {
    id: 'ex-chest-1',
    name: 'Barbell Flat Bench Press',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 90,
    instructions: 'Lie flat on the bench, grip the barbell slightly wider than shoulder width. Lower bar smoothly to mid-chest with elbows at roughly 45°, then press explosively upward.',
    tips: 'Plant feet flat into the ground, retract scapulae, and maintain a slight natural arch in the lower spine.',
  },
  {
    id: 'ex-chest-2',
    name: 'Incline Dumbbell Press',
    muscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Set bench to a 30-45 degree incline. Press dumbbells upward together while keeping wrists stacked over elbows.',
    tips: 'Target the clavicular upper pectoral fibers. Avoid setting incline too steep (>45°) which shifts load to front deltoids.',
  },
  {
    id: 'ex-chest-3',
    name: 'Cable Chest Flyes',
    muscle: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    instructions: 'Set pulleys at chest height. Stand in a staggered stance, bring hands together in a hugging motion with a slight elbow bend.',
    tips: 'Squeeze pecs for 1 second at full peak contraction, resist the negative stretch on the way back.',
  },
  {
    id: 'ex-chest-4',
    name: 'Chest Dips',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 75,
    instructions: 'On parallel dip bars, lean torso forward ~30° with elbows flared slightly outward. Lower until shoulders are below elbows, then press back up.',
    tips: 'Forward torso lean emphasizes the lower pecs rather than strictly isolating the triceps.',
  },
  {
    id: 'ex-chest-5',
    name: 'Standard Push-Ups',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'abs-core', 'shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Place hands shoulder-width apart, keep body in a rigid straight line from head to heels. Lower chest to floor and press up.',
    tips: 'Squeeze glutes and core to eliminate hip sagging.',
  },

  // SHOULDERS
  {
    id: 'ex-sh-1',
    name: 'Standing Overhead Barbell Press (OHP)',
    muscle: 'shoulders',
    secondaryMuscles: ['triceps', 'upper-back', 'abs-core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 6,
    defaultRest: 90,
    instructions: 'Rest bar on front deltoids, brace core and glutes. Press bar vertically overhead, moving head forward slightly once bar clears brow.',
    tips: 'Do not excessively lean back; maintain full core tension throughout the lift.',
  },
  {
    id: 'ex-sh-2',
    name: 'Dumbbell Lateral Raise',
    muscle: 'shoulders',
    secondaryMuscles: ['upper-back'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Stand tall with dumbbells at sides. Raise arms out laterally with slight elbow bend until parallel with shoulders.',
    tips: 'Lead with elbows and avoid swinging the torso for momentum.',
  },
  {
    id: 'ex-sh-3',
    name: 'Face Pulls with Rope',
    muscle: 'shoulders',
    secondaryMuscles: ['upper-back'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Set cable at eye level with rope. Pull thumbs back past ears while externally rotating shoulders, squeezing rear delts.',
    tips: 'Crucial exercise for shoulder longevity, rotator cuff health, and upright posture.',
  },
  {
    id: 'ex-sh-4',
    name: 'Arnold Press',
    muscle: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Start seated with dumbbells at chest level, palms facing you. As you press overhead, rotate palms outward so they face forward at the top.',
    tips: 'Provides continuous rotational tension across all three deltoid heads.',
  },

  // BICEPS
  {
    id: 'ex-bic-1',
    name: 'Standing Barbell Curl',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Hold bar with underhand grip shoulder-width apart. Keeping elbows pinned to ribcage, curl bar upward toward shoulders.',
    tips: 'Avoid rocking backwards. Control the eccentric lowering phase for 2 seconds.',
  },
  {
    id: 'ex-bic-2',
    name: 'Incline Dumbbell Curl',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    instructions: 'Lie back on a 45-degree incline bench with arms hanging fully extended. Curl dumbbells up with full supination at the peak.',
    tips: 'Maximizes the stretch on the long head of the biceps for peak hypertrophy.',
  },
  {
    id: 'ex-bic-3',
    name: 'Hammer Curls',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    instructions: 'Hold dumbbells with neutral grip (palms facing each other). Curl upward without rotating wrists.',
    tips: 'Targets the brachialis and brachioradialis to build arm thickness.',
  },

  // TRICEPS
  {
    id: 'ex-tri-1',
    name: 'Cable Tricep Rope Pushdown',
    muscle: 'triceps',
    secondaryMuscles: ['forearms'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 12,
    defaultRest: 45,
    instructions: 'Hold rope attachment with neutral grip. Keeping upper arms stationary at sides, push down and flare rope ends apart at bottom.',
    tips: 'Full lockout at bottom produces maximum lateral tricep head activation.',
  },
  {
    id: 'ex-tri-2',
    name: 'Skull Crushers (Lying Tricep Extension)',
    muscle: 'triceps',
    secondaryMuscles: ['chest'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Lie on flat bench with EZ-bar above chest. Keeping upper arms angled slightly back, bend elbows to lower bar towards crown of head.',
    tips: 'Angling upper arms back 10-15° keeps constant tension on the long head at the top.',
  },
  {
    id: 'ex-tri-3',
    name: 'Overhead Dumbbell Tricep Extension',
    muscle: 'triceps',
    secondaryMuscles: ['shoulders'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    instructions: 'Cup top plate of a dumbbell with both hands overhead. Lower weight behind head by bending elbows, then press back up.',
    tips: 'Keep elbows pointing forward as much as possible rather than excessively flaring out.',
  },

  // LATS & UPPER BACK
  {
    id: 'ex-lat-1',
    name: 'Wide-Grip Pull-Ups',
    muscle: 'lats',
    secondaryMuscles: ['biceps', 'upper-back', 'forearms'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 90,
    instructions: 'Grip pull-up bar wider than shoulder width. Drive elbows down and back to pull chest up toward bar, clearing chin over bar.',
    tips: 'Initiate the movement by depressing scapulae rather than leading with arms.',
  },
  {
    id: 'ex-lat-2',
    name: 'Lat Pulldown',
    muscle: 'lats',
    secondaryMuscles: ['biceps', 'upper-back'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Sit securely under thigh pads. Pull bar down to upper clavicle while slightly puffing chest out to meet the bar.',
    tips: 'Avoid excessive backward swinging of torso; stay upright with a minor 10° lean.',
  },
  {
    id: 'ex-lat-3',
    name: 'Bent-Over Barbell Row',
    muscle: 'lats',
    secondaryMuscles: ['upper-back', 'biceps', 'lower-back'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 75,
    instructions: 'Hinge forward at hips with back flat at ~45°. Pull bar upward toward belly button, driving elbows back and squeezing shoulder blades.',
    tips: 'Keep core tight and maintain neutral spine throughout the set.',
  },
  {
    id: 'ex-ub-1',
    name: 'Seated Cable Row',
    muscle: 'upper-back',
    secondaryMuscles: ['lats', 'biceps'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    instructions: 'Sit with feet on footplates, knees slightly bent. Pull handle toward midriff while retracting scapulae and keeping chest tall.',
    tips: 'Stretch forward slightly at bottom for a lat stretch, then pull shoulders back firmly.',
  },
  {
    id: 'ex-ub-2',
    name: 'Barbell Shrugs',
    muscle: 'upper-back',
    secondaryMuscles: ['forearms'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 15,
    defaultRest: 60,
    instructions: 'Hold barbell at thigh level with overhand grip. Elevate shoulders straight up toward ears, hold contraction for 1 second, then lower.',
    tips: 'Do not roll shoulders in circles; vertical elevation protects the shoulder capsule.',
  },

  // LOWER BACK
  {
    id: 'ex-lb-1',
    name: 'Conventional Barbell Deadlift',
    muscle: 'lower-back',
    secondaryMuscles: ['glutes', 'hamstrings', 'lats', 'upper-back', 'forearms'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 5,
    defaultRest: 120,
    instructions: 'Stand with bar over mid-foot. Hinge hips back, take overhand grip, brace abdominal wall, and pull bar off floor by extending hips and knees together.',
    tips: 'Keep barbell in contact with shins and thighs throughout entire path.',
  },
  {
    id: 'ex-lb-2',
    name: 'Hyperextensions (Back Extension)',
    muscle: 'lower-back',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Position hips on pad just below fold. Lower torso forward, then raise torso up until in line with legs.',
    tips: 'Avoid hyperextending beyond neutral spine alignment at the top.',
  },

  // ABS & CORE
  {
    id: 'ex-core-1',
    name: 'Hanging Leg Raises',
    muscle: 'abs-core',
    secondaryMuscles: ['forearms'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 45,
    instructions: 'Hang from pull-up bar with arms straight. Curl pelvis upward while raising straight legs until parallel to floor or higher.',
    tips: 'Tilt pelvis posteriorly to actively contract rectus abdominis, not just hip flexors.',
  },
  {
    id: 'ex-core-2',
    name: 'Plank Hold',
    muscle: 'abs-core',
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'timed',
    defaultSets: 3,
    defaultDuration: 60,
    defaultRest: 30,
    instructions: 'Rest on forearms and toes with body in a straight rigid plank. Contract abs as if preparing for a punch, squeezing glutes.',
    tips: 'Keep hips level — do not let hips pike upward or sag down.',
  },
  {
    id: 'ex-core-3',
    name: 'Cable Woodchoppers',
    muscle: 'abs-core',
    secondaryMuscles: ['shoulders'],
    equipment: 'Cable',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Set cable high. Stand sideways and rotate torso diagonally downward across body toward opposite hip.',
    tips: 'Rotate through thoracic spine while hips remain relatively stable for maximum oblique recruitment.',
  },
  {
    id: 'ex-core-4',
    name: 'Ab Wheel Rollout',
    muscle: 'abs-core',
    secondaryMuscles: ['lats', 'shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Kneel on floor with wheel in hands. Roll wheel straight forward extending hips and torso until nose is close to ground, then pull back.',
    tips: 'Keep glutes locked and tuck pelvis under to protect the lumbar spine.',
  },

  // QUADS
  {
    id: 'ex-quad-1',
    name: 'Barbell Back Squat',
    muscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'lower-back', 'abs-core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 120,
    instructions: 'Rest bar across upper traps. Unrack, descend by pushing hips back and knees out until thighs are parallel to ground, then stand explosively.',
    tips: 'Keep chest upright, knees tracking in line with toes, and heels glued to the floor.',
  },
  {
    id: 'ex-quad-2',
    name: 'Leg Press',
    muscle: 'quads',
    secondaryMuscles: ['glutes'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 75,
    instructions: 'Sit in sled with feet shoulder-width on footplate. Release safety levers and lower sled until knees reach 90 degrees, then press back up.',
    tips: 'Never lock out knees aggressively at the top of the stroke.',
  },
  {
    id: 'ex-quad-3',
    name: 'Bulgarian Split Squat',
    muscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    instructions: 'Stand 2 feet in front of a bench, place top of back foot on bench. Lower rear knee toward floor while front thigh reaches parallel.',
    tips: 'Unilateral gold standard for resolving muscular imbalances and quad hypertrophy.',
  },
  {
    id: 'ex-quad-4',
    name: 'Leg Extension',
    muscle: 'quads',
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Align knee joint with machine pivot axis. Extend legs upward to straight horizontal position, hold peak for 1 second, then lower slowly.',
    tips: 'Isolates the rectus femoris and vastus medialis without loading spine.',
  },

  // HAMSTRINGS
  {
    id: 'ex-ham-1',
    name: 'Romanian Deadlift (RDL)',
    muscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower-back', 'forearms'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 10,
    defaultRest: 90,
    instructions: 'Stand with soft bend in knees. Hinge hips backwards while sliding bar down thighs until deep stretch is felt in hamstrings, then squeeze glutes to stand.',
    tips: 'Movement comes from hip hinge, not spinal flexion. Do not allow lower back to round.',
  },
  {
    id: 'ex-ham-2',
    name: 'Lying Leg Curl',
    muscle: 'hamstrings',
    secondaryMuscles: ['calves'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    instructions: 'Lie prone on machine with pad against lower calf. Curl heels toward glutes, squeeze at top, and lower with control.',
    tips: 'Keep hips pressed firmly into pad to prevent cheating with lumbar extension.',
  },

  // GLUTES
  {
    id: 'ex-glut-1',
    name: 'Barbell Hip Thrust',
    muscle: 'glutes',
    secondaryMuscles: ['hamstrings', 'quads'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 10,
    defaultRest: 90,
    instructions: 'Upper back against bench with barbell padded across hips. Drive through heels to lift hips until thighs and torso form a straight bridge.',
    tips: 'Tuck chin slightly forward and squeeze glutes hard for 2 seconds at the peak.',
  },
  {
    id: 'ex-glut-2',
    name: 'Cable Glute Kickbacks',
    muscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Attach ankle cuff to low pulley. Kick leg directly backwards and slightly upward while contracting gluteus maximus.',
    tips: 'Avoid arching lower back; motion should originate solely from the hip.',
  },

  // CALVES & FOREARMS
  {
    id: 'ex-calf-1',
    name: 'Standing Calf Raise',
    muscle: 'calves',
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    type: 'reps',
    defaultSets: 4,
    defaultReps: 15,
    defaultRest: 45,
    instructions: 'Balls of feet on block with heels dropped into deep stretch. Push through big toes to elevate heels as high as possible, pausing for 1s.',
    tips: 'Perform full range of motion: 2 seconds deep stretch at bottom, 1 second pause at top.',
  },
  {
    id: 'ex-fore-1',
    name: 'Farmer’s Walk',
    muscle: 'forearms',
    secondaryMuscles: ['upper-back', 'abs-core', 'calves'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    type: 'timed',
    defaultSets: 3,
    defaultDuration: 45,
    defaultRest: 60,
    instructions: 'Pick up two heavy dumbbells or kettlebells. Walk with upright posture, braced core, and tight grip for the prescribed time.',
    tips: 'Massive builder for grip strength, traps, and full-body stabilization.',
  },
];

// Local Storage Keys
const STORAGE_CUSTOM_EXERCISES = 'gympulse_custom_exercises';
const STORAGE_WEEKLY_ROUTINES = 'gympulse_weekly_routines';
const STORAGE_ACTIVE_WEEKLY_SCHEDULE = 'gympulse_active_weekly_schedule';

// Helper: Get custom exercises created by user/trainer
export function getCustomExercises() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_EXERCISES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper: Save new custom exercise
export function saveCustomExercise(newEx) {
  try {
    const existing = getCustomExercises();
    const exWithMeta = {
      ...newEx,
      id: newEx.id || `custom-ex-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [exWithMeta, ...existing];
    localStorage.setItem(STORAGE_CUSTOM_EXERCISES, JSON.stringify(updated));
    return exWithMeta;
  } catch (err) {
    console.error('Failed to save custom exercise:', err);
    return newEx;
  }
}

// Helper: Delete custom exercise
export function deleteCustomExercise(exId) {
  try {
    const existing = getCustomExercises();
    const filtered = existing.filter(e => e.id !== exId);
    localStorage.setItem(STORAGE_CUSTOM_EXERCISES, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

// Helper: Get combined builtin and custom exercises
export function getAllExercises() {
  const custom = getCustomExercises();
  return [...custom, ...BUILTIN_EXERCISES];
}

// Helper: Get exercises by target muscle group ID
export function getExercisesByMuscle(muscleId) {
  const all = getAllExercises();
  if (!muscleId || muscleId === 'all') return all;
  return all.filter(e => e.muscle === muscleId || e.secondaryMuscles?.includes(muscleId));
}

// Helper: 7-Day Default Template structure
export const DEFAULT_WEEK_DAYS = [
  { day: 'Monday', label: 'Chest & Triceps Focus', isRest: false, exercises: [] },
  { day: 'Tuesday', label: 'Back & Biceps Pull Day', isRest: false, exercises: [] },
  { day: 'Wednesday', label: 'Active Rest / Mobility', isRest: true, exercises: [] },
  { day: 'Thursday', label: 'Legs & Calves Blast', isRest: false, exercises: [] },
  { day: 'Friday', label: 'Shoulders & Core Sculpt', isRest: false, exercises: [] },
  { day: 'Saturday', label: 'Full Body & Conditioning', isRest: false, exercises: [] },
  { day: 'Sunday', label: 'Complete Rest & Recovery', isRest: true, exercises: [] },
];

// Pre-seeded starter routine
export const STARTER_WEEKLY_ROUTINE = {
  id: 'routine-starter-1',
  name: 'Hypertrophy 4-Day Push/Pull/Legs Split',
  description: 'Balanced muscle building split with targeted rest days.',
  days: [
    {
      day: 'Monday',
      label: 'Push (Chest, Delts & Triceps)',
      isRest: false,
      exercises: [
        { id: 'ex-chest-1', name: 'Barbell Flat Bench Press', muscle: 'chest', sets: 4, reps: 8, rest: 90 },
        { id: 'ex-chest-2', name: 'Incline Dumbbell Press', muscle: 'chest', sets: 3, reps: 10, rest: 60 },
        { id: 'ex-sh-2', name: 'Dumbbell Lateral Raise', muscle: 'shoulders', sets: 4, reps: 15, rest: 45 },
        { id: 'ex-tri-1', name: 'Cable Tricep Rope Pushdown', muscle: 'triceps', sets: 3, reps: 12, rest: 45 },
      ]
    },
    {
      day: 'Tuesday',
      label: 'Pull (Back, Rear Delts & Biceps)',
      isRest: false,
      exercises: [
        { id: 'ex-lat-1', name: 'Wide-Grip Pull-Ups', muscle: 'lats', sets: 4, reps: 8, rest: 90 },
        { id: 'ex-lat-3', name: 'Bent-Over Barbell Row', muscle: 'lats', sets: 3, reps: 10, rest: 75 },
        { id: 'ex-sh-3', name: 'Face Pulls with Rope', muscle: 'shoulders', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-bic-1', name: 'Standing Barbell Curl', muscle: 'biceps', sets: 3, reps: 10, rest: 60 },
      ]
    },
    {
      day: 'Wednesday',
      label: 'Active Recovery',
      isRest: true,
      exercises: []
    },
    {
      day: 'Thursday',
      label: 'Legs & Core',
      isRest: false,
      exercises: [
        { id: 'ex-quad-1', name: 'Barbell Back Squat', muscle: 'quads', sets: 4, reps: 8, rest: 120 },
        { id: 'ex-ham-1', name: 'Romanian Deadlift (RDL)', muscle: 'hamstrings', sets: 3, reps: 10, rest: 90 },
        { id: 'ex-calf-1', name: 'Standing Calf Raise', muscle: 'calves', sets: 4, reps: 15, rest: 45 },
        { id: 'ex-core-1', name: 'Hanging Leg Raises', muscle: 'abs-core', sets: 3, reps: 12, rest: 45 },
      ]
    },
    {
      day: 'Friday',
      label: 'Upper Body Pump & Core',
      isRest: false,
      exercises: [
        { id: 'ex-sh-1', name: 'Standing Overhead Barbell Press (OHP)', muscle: 'shoulders', sets: 3, reps: 8, rest: 90 },
        { id: 'ex-chest-3', name: 'Cable Chest Flyes', muscle: 'chest', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-bic-3', name: 'Hammer Curls', muscle: 'biceps', sets: 3, reps: 12, rest: 45 },
        { id: 'ex-core-2', name: 'Plank Hold', muscle: 'abs-core', sets: 3, duration: 60, rest: 30 },
      ]
    },
    {
      day: 'Saturday',
      label: 'Rest / Light Cardio',
      isRest: true,
      exercises: []
    },
    {
      day: 'Sunday',
      label: 'Rest & Meal Prep',
      isRest: true,
      exercises: []
    },
  ],
  createdAt: new Date().toISOString(),
};

// Helper: Get user's saved weekly routines
export function getWeeklyRoutines() {
  try {
    const raw = localStorage.getItem(STORAGE_WEEKLY_ROUTINES);
    return raw ? JSON.parse(raw) : [STARTER_WEEKLY_ROUTINE];
  } catch {
    return [STARTER_WEEKLY_ROUTINE];
  }
}

// Helper: Save a full weekly routine
export function saveWeeklyRoutine(routine) {
  try {
    const routines = getWeeklyRoutines();
    const rWithId = {
      ...routine,
      id: routine.id || `routine-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const index = routines.findIndex(r => r.id === rWithId.id);
    let updated;
    if (index >= 0) {
      updated = [...routines];
      updated[index] = rWithId;
    } else {
      updated = [rWithId, ...routines];
    }
    localStorage.setItem(STORAGE_WEEKLY_ROUTINES, JSON.stringify(updated));
    return rWithId;
  } catch (err) {
    console.error('Failed to save weekly routine:', err);
    return routine;
  }
}

// Helper: Get or initialize the currently active weekly routine
export function getActiveWeeklySchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_WEEKLY_SCHEDULE);
    if (raw) return JSON.parse(raw);
    return STARTER_WEEKLY_ROUTINE;
  } catch {
    return STARTER_WEEKLY_ROUTINE;
  }
}

// Helper: Set the active weekly routine
export function setActiveWeeklySchedule(routine) {
  try {
    localStorage.setItem(STORAGE_ACTIVE_WEEKLY_SCHEDULE, JSON.stringify(routine));
    return true;
  } catch {
    return false;
  }
}
