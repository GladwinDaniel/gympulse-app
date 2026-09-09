// Predefined workout programs for each category
// Each category has a 7-day (Mon-Sun) program with exercises per day

export const WORKOUT_CATEGORIES = {
  'fat-loss': {
    id: 'fat-loss',
    name: 'Fat Loss',
    description: 'High-intensity cardio & circuit training to maximize fat burn',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    duration: '45 min',
    weekPlan: [
      {
        day: 'Monday', label: 'HIIT Cardio + Core',
        exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: null, duration: 45, rest: 15 },
          { name: 'Burpees', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Mountain Climbers', sets: 3, reps: null, duration: 40, rest: 20 },
          { name: 'Bicycle Crunches', sets: 3, reps: 20, duration: null, rest: 20 },
          { name: 'Plank Hold', sets: 3, reps: null, duration: 45, rest: 15 },
          { name: 'High Knees', sets: 3, reps: null, duration: 30, rest: 15 },
        ]
      },
      {
        day: 'Tuesday', label: 'Upper Body Circuit',
        exercises: [
          { name: 'Push-Ups', sets: 3, reps: 15, duration: null, rest: 30 },
          { name: 'Dumbbell Rows', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Shoulder Taps', sets: 3, reps: null, duration: 30, rest: 20 },
          { name: 'Tricep Dips', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Shadow Boxing', sets: 3, reps: null, duration: 45, rest: 15 },
        ]
      },
      {
        day: 'Wednesday', label: 'Active Recovery',
        exercises: [
          { name: 'Brisk Walking', sets: 1, reps: null, duration: 600, rest: 0 },
          { name: 'Stretching Routine', sets: 1, reps: null, duration: 600, rest: 0 },
          { name: 'Foam Rolling', sets: 1, reps: null, duration: 300, rest: 0 },
        ]
      },
      {
        day: 'Thursday', label: 'Lower Body Blast',
        exercises: [
          { name: 'Jump Squats', sets: 4, reps: 15, duration: null, rest: 30 },
          { name: 'Lunges', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Box Jumps', sets: 3, reps: 10, duration: null, rest: 30 },
          { name: 'Glute Bridges', sets: 3, reps: 15, duration: null, rest: 20 },
          { name: 'Calf Raises', sets: 3, reps: 20, duration: null, rest: 15 },
          { name: 'Wall Sit', sets: 3, reps: null, duration: 45, rest: 20 },
        ]
      },
      {
        day: 'Friday', label: 'Full Body Tabata',
        exercises: [
          { name: 'Burpees', sets: 4, reps: null, duration: 20, rest: 10 },
          { name: 'Squat Jumps', sets: 4, reps: null, duration: 20, rest: 10 },
          { name: 'Push-Up to Plank', sets: 4, reps: null, duration: 20, rest: 10 },
          { name: 'Jumping Lunges', sets: 4, reps: null, duration: 20, rest: 10 },
          { name: 'Plank Jacks', sets: 4, reps: null, duration: 20, rest: 10 },
        ]
      },
      {
        day: 'Saturday', label: 'Cardio Endurance',
        exercises: [
          { name: 'Running / Treadmill', sets: 1, reps: null, duration: 1200, rest: 0 },
          { name: 'Rope Skipping', sets: 3, reps: null, duration: 120, rest: 30 },
          { name: 'Rowing Machine', sets: 1, reps: null, duration: 600, rest: 0 },
        ]
      },
      {
        day: 'Sunday', label: 'Rest Day',
        exercises: []
      },
    ]
  },
  'lean-bulking': {
    id: 'lean-bulking',
    name: 'Lean Bulking',
    description: 'Progressive overload with controlled volume for lean gains',
    color: '#6c5ce7',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    duration: '60 min',
    weekPlan: [
      {
        day: 'Monday', label: 'Chest & Triceps',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: 8, duration: null, rest: 90 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Cable Crossover', sets: 3, reps: 12, duration: null, rest: 60 },
          { name: 'Tricep Pushdown', sets: 3, reps: 12, duration: null, rest: 60 },
          { name: 'Overhead Tricep Extension', sets: 3, reps: 10, duration: null, rest: 60 },
        ]
      },
      {
        day: 'Tuesday', label: 'Back & Biceps',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: 6, duration: null, rest: 120 },
          { name: 'Lat Pulldown', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Seated Cable Row', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Barbell Curl', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Hammer Curls', sets: 3, reps: 12, duration: null, rest: 45 },
        ]
      },
      {
        day: 'Wednesday', label: 'Rest / Light Cardio',
        exercises: [
          { name: 'Light Walking', sets: 1, reps: null, duration: 1200, rest: 0 },
          { name: 'Ab Crunches', sets: 3, reps: 20, duration: null, rest: 30 },
          { name: 'Plank', sets: 3, reps: null, duration: 60, rest: 30 },
        ]
      },
      {
        day: 'Thursday', label: 'Shoulders & Traps',
        exercises: [
          { name: 'Overhead Press', sets: 4, reps: 8, duration: null, rest: 90 },
          { name: 'Lateral Raises', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Front Raises', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Face Pulls', sets: 3, reps: 15, duration: null, rest: 45 },
          { name: 'Barbell Shrugs', sets: 3, reps: 12, duration: null, rest: 60 },
        ]
      },
      {
        day: 'Friday', label: 'Legs',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: 8, duration: null, rest: 120 },
          { name: 'Leg Press', sets: 3, reps: 10, duration: null, rest: 90 },
          { name: 'Romanian Deadlift', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Leg Curl', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Calf Raises', sets: 4, reps: 15, duration: null, rest: 30 },
        ]
      },
      {
        day: 'Saturday', label: 'Arms & Abs',
        exercises: [
          { name: 'EZ Bar Curl', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Skull Crushers', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Concentration Curls', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Hanging Leg Raises', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Cable Crunches', sets: 3, reps: 15, duration: null, rest: 30 },
        ]
      },
      {
        day: 'Sunday', label: 'Rest Day',
        exercises: []
      },
    ]
  },
  'bulking': {
    id: 'bulking',
    name: 'Bulking',
    description: 'Heavy compound lifts focused on maximum muscle growth',
    color: '#00bcd4',
    gradient: 'linear-gradient(135deg, #00bcd4, #4fc3f7)',
    duration: '70 min',
    weekPlan: [
      {
        day: 'Monday', label: 'Heavy Chest',
        exercises: [
          { name: 'Flat Barbell Bench', sets: 5, reps: 5, duration: null, rest: 180 },
          { name: 'Incline Barbell Bench', sets: 4, reps: 6, duration: null, rest: 120 },
          { name: 'Dumbbell Flyes', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Weighted Dips', sets: 3, reps: 8, duration: null, rest: 90 },
          { name: 'Push-Ups (Burnout)', sets: 2, reps: 25, duration: null, rest: 45 },
        ]
      },
      {
        day: 'Tuesday', label: 'Heavy Back',
        exercises: [
          { name: 'Barbell Row', sets: 5, reps: 5, duration: null, rest: 120 },
          { name: 'Pull-Ups (Weighted)', sets: 4, reps: 6, duration: null, rest: 120 },
          { name: 'T-Bar Row', sets: 3, reps: 8, duration: null, rest: 90 },
          { name: 'Dumbbell Row', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Lat Pulldown', sets: 3, reps: 12, duration: null, rest: 60 },
        ]
      },
      {
        day: 'Wednesday', label: 'Shoulders & Arms',
        exercises: [
          { name: 'Military Press', sets: 4, reps: 6, duration: null, rest: 120 },
          { name: 'Arnold Press', sets: 3, reps: 10, duration: null, rest: 60 },
          { name: 'Lateral Raises (Heavy)', sets: 4, reps: 10, duration: null, rest: 45 },
          { name: 'Barbell Curl', sets: 4, reps: 8, duration: null, rest: 60 },
          { name: 'Close-Grip Bench', sets: 4, reps: 8, duration: null, rest: 60 },
        ]
      },
      {
        day: 'Thursday', label: 'Heavy Legs',
        exercises: [
          { name: 'Barbell Squat', sets: 5, reps: 5, duration: null, rest: 180 },
          { name: 'Front Squat', sets: 3, reps: 8, duration: null, rest: 120 },
          { name: 'Leg Press', sets: 4, reps: 10, duration: null, rest: 90 },
          { name: 'Walking Lunges', sets: 3, reps: 12, duration: null, rest: 60 },
          { name: 'Leg Extension', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Standing Calf Raises', sets: 5, reps: 12, duration: null, rest: 30 },
        ]
      },
      {
        day: 'Friday', label: 'Upper Power',
        exercises: [
          { name: 'Deadlift', sets: 5, reps: 3, duration: null, rest: 180 },
          { name: 'Overhead Press', sets: 4, reps: 6, duration: null, rest: 120 },
          { name: 'Pendlay Row', sets: 4, reps: 6, duration: null, rest: 90 },
          { name: 'Dumbbell Bench Press', sets: 3, reps: 10, duration: null, rest: 60 },
        ]
      },
      {
        day: 'Saturday', label: 'Accessory & Volume',
        exercises: [
          { name: 'Incline Dumbbell Curl', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Rope Pushdown', sets: 3, reps: 15, duration: null, rest: 45 },
          { name: 'Cable Crossover', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Rear Delt Fly', sets: 3, reps: 15, duration: null, rest: 30 },
          { name: 'Hanging Leg Raise', sets: 3, reps: 12, duration: null, rest: 30 },
        ]
      },
      {
        day: 'Sunday', label: 'Rest Day',
        exercises: []
      },
    ]
  },
  'weight-loss': {
    id: 'weight-loss',
    name: 'Weight Loss',
    description: 'Balanced cardio & resistance training for sustainable results',
    color: '#00e676',
    gradient: 'linear-gradient(135deg, #00e676, #00bcd4)',
    duration: '50 min',
    weekPlan: [
      {
        day: 'Monday', label: 'Full Body Strength',
        exercises: [
          { name: 'Goblet Squats', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Dumbbell Press', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Bent-Over Row', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Shoulder Press', sets: 3, reps: 10, duration: null, rest: 45 },
          { name: 'Plank', sets: 3, reps: null, duration: 45, rest: 15 },
          { name: 'Step-Ups', sets: 3, reps: 10, duration: null, rest: 30 },
        ]
      },
      {
        day: 'Tuesday', label: 'Cardio Mix',
        exercises: [
          { name: 'Treadmill Walk/Jog', sets: 1, reps: null, duration: 900, rest: 0 },
          { name: 'Cycling', sets: 1, reps: null, duration: 600, rest: 60 },
          { name: 'Elliptical', sets: 1, reps: null, duration: 600, rest: 0 },
        ]
      },
      {
        day: 'Wednesday', label: 'Upper Body + Core',
        exercises: [
          { name: 'Push-Ups', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Dumbbell Rows', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Lateral Raises', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Bicep Curls', sets: 3, reps: 12, duration: null, rest: 30 },
          { name: 'Russian Twists', sets: 3, reps: 20, duration: null, rest: 20 },
          { name: 'Dead Bug', sets: 3, reps: 12, duration: null, rest: 20 },
          { name: 'Bird Dog', sets: 3, reps: 10, duration: null, rest: 20 },
        ]
      },
      {
        day: 'Thursday', label: 'Low Impact Cardio',
        exercises: [
          { name: 'Swimming / Brisk Walk', sets: 1, reps: null, duration: 1800, rest: 0 },
          { name: 'Stretching', sets: 1, reps: null, duration: 600, rest: 0 },
        ]
      },
      {
        day: 'Friday', label: 'Lower Body Focus',
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 15, duration: null, rest: 30 },
          { name: 'Dumbbell Lunges', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Glute Bridges', sets: 3, reps: 15, duration: null, rest: 30 },
          { name: 'Sumo Squats', sets: 3, reps: 12, duration: null, rest: 45 },
          { name: 'Calf Raises', sets: 3, reps: 20, duration: null, rest: 15 },
        ]
      },
      {
        day: 'Saturday', label: 'Active Fun Day',
        exercises: [
          { name: 'Cycling / Hiking', sets: 1, reps: null, duration: 2400, rest: 0 },
          { name: 'Light Stretching', sets: 1, reps: null, duration: 600, rest: 0 },
        ]
      },
      {
        day: 'Sunday', label: 'Rest Day',
        exercises: []
      },
    ]
  }
};

// Helper: format seconds to readable time
export function formatDuration(seconds) {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
  }
  return `${seconds}s`;
}

// Demo saved plans for the member
export const DEMO_SAVED_PLANS = [
  {
    id: 'demo-plan-1',
    name: 'My Morning Routine',
    categoryId: null,
    type: 'custom',
    exercises: [
      { name: 'Push-Ups', sets: 3, reps: 15, duration: null, rest: 30 },
      { name: 'Sit-Ups', sets: 3, reps: 20, duration: null, rest: 20 },
      { name: 'Plank', sets: 3, reps: null, duration: 60, rest: 15 },
      { name: 'Jumping Jacks', sets: 3, reps: null, duration: 45, rest: 15 },
    ],
    timerMode: 'manual',
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: 'demo-plan-2',
    name: 'Quick Core Blast',
    categoryId: null,
    type: 'custom',
    exercises: [
      { name: 'Crunches', sets: 4, reps: 20, duration: null, rest: 15 },
      { name: 'Leg Raises', sets: 3, reps: 15, duration: null, rest: 20 },
      { name: 'Mountain Climbers', sets: 3, reps: null, duration: 30, rest: 15 },
      { name: 'Plank Hold', sets: 3, reps: null, duration: 45, rest: 15 },
    ],
    timerMode: 'auto',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
];

// Demo assigned weekly plan
export const DEMO_WEEKLY_ASSIGNMENT = {
  categoryId: 'fat-loss',
  categoryName: 'Fat Loss',
  assignedAt: new Date(Date.now() - 86400000 * 3),
  assignedBy: null, // self-assigned
};

// Demo PT-exclusive plan
export const DEMO_PT_PLANS = [
  {
    id: 'demo-pt-plan-1',
    name: 'Sarah\'s Custom Strength Program',
    trainerName: 'Sarah Connor',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, duration: null, rest: 120 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, duration: null, rest: 90 },
      { name: 'Incline Bench Press', sets: 4, reps: 8, duration: null, rest: 90 },
      { name: 'Pull-Ups', sets: 3, reps: 8, duration: null, rest: 60 },
      { name: 'Overhead Press', sets: 3, reps: 10, duration: null, rest: 60 },
    ],
    timerMode: 'manual',
    createdAt: new Date(Date.now() - 86400000 * 7),
    validFrom: new Date(Date.now() - 86400000 * 7),
    validTo: new Date(Date.now() + 86400000 * 21),
  }
];
