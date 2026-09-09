// Predefined diet plan templates

export const PREDEFINED_DIET_PLANS = [
  {
    id: 'diet-weight-loss',
    name: 'Clean Eating — Weight Loss',
    goal: 'Weight Loss',
    calories: '~1,600 kcal/day',
    color: '#00e676',
    gradient: 'linear-gradient(135deg, #00e676, #00bcd4)',
    meals: [
      { time: '7:00 AM', type: 'Breakfast', items: ['2 boiled eggs', 'Whole wheat toast', 'Green tea', 'Half avocado'] },
      { time: '10:00 AM', type: 'Mid-Morning Snack', items: ['Apple slices with almond butter', 'Mixed nuts (handful)'] },
      { time: '1:00 PM', type: 'Lunch', items: ['Grilled chicken breast (150g)', 'Brown rice (1 cup)', 'Steamed broccoli & carrots', 'Small green salad'] },
      { time: '4:00 PM', type: 'Afternoon Snack', items: ['Protein shake with water', 'Cucumber sticks'] },
      { time: '7:30 PM', type: 'Dinner', items: ['Baked fish (150g)', 'Quinoa (half cup)', 'Sautéed spinach', 'Lemon dressing'] },
    ]
  },
  {
    id: 'diet-lean-gain',
    name: 'Lean Muscle Gain',
    goal: 'Lean Bulking',
    calories: '~2,500 kcal/day',
    color: '#6c5ce7',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    meals: [
      { time: '7:00 AM', type: 'Breakfast', items: ['Oatmeal with banana & peanut butter', '3 egg whites + 1 whole egg scramble', 'Glass of milk'] },
      { time: '10:00 AM', type: 'Mid-Morning Snack', items: ['Greek yogurt (200g)', 'Granola & mixed berries', 'Honey drizzle'] },
      { time: '1:00 PM', type: 'Lunch', items: ['Grilled chicken thighs (200g)', 'Sweet potato (large)', 'Steamed vegetables', 'Olive oil dressing'] },
      { time: '4:00 PM', type: 'Post-Workout', items: ['Whey protein shake with banana', 'Rice cakes with almond butter'] },
      { time: '7:30 PM', type: 'Dinner', items: ['Salmon fillet (200g)', 'Pasta (1.5 cups)', 'Roasted asparagus', 'Garlic bread'] },
      { time: '9:30 PM', type: 'Before Bed', items: ['Cottage cheese (150g)', 'Handful of walnuts'] },
    ]
  },
  {
    id: 'diet-bulk',
    name: 'Mass Gainer',
    goal: 'Bulking',
    calories: '~3,200 kcal/day',
    color: '#00bcd4',
    gradient: 'linear-gradient(135deg, #00bcd4, #4fc3f7)',
    meals: [
      { time: '7:00 AM', type: 'Breakfast', items: ['4 whole eggs scrambled', 'Toast (2 slices) with butter', 'Large banana smoothie with oats & peanut butter'] },
      { time: '10:00 AM', type: 'Snack', items: ['Mass gainer shake', 'Peanut butter sandwich'] },
      { time: '1:00 PM', type: 'Lunch', items: ['Double chicken breast (300g)', 'White rice (2 cups)', 'Mixed vegetables', 'Gravy/sauce'] },
      { time: '4:00 PM', type: 'Post-Workout', items: ['Whey protein with milk & banana', 'Energy bar', 'Dried fruits'] },
      { time: '7:30 PM', type: 'Dinner', items: ['Steak (250g) or ground beef', 'Mashed potatoes', 'Corn on the cob', 'Dinner roll'] },
      { time: '10:00 PM', type: 'Night Snack', items: ['Casein protein shake', 'Full-fat yogurt', 'Almonds & dark chocolate'] },
    ]
  },
  {
    id: 'diet-maintenance',
    name: 'Balanced Maintenance',
    goal: 'Maintenance',
    calories: '~2,000 kcal/day',
    color: '#ffd93d',
    gradient: 'linear-gradient(135deg, #ffd93d, #ff6b6b)',
    meals: [
      { time: '7:30 AM', type: 'Breakfast', items: ['Greek yogurt parfait with granola', '1 boiled egg', 'Orange juice'] },
      { time: '10:30 AM', type: 'Snack', items: ['Trail mix (small handful)', 'Green tea'] },
      { time: '1:00 PM', type: 'Lunch', items: ['Turkey wrap with veggies', 'Side salad', 'Hummus'] },
      { time: '4:00 PM', type: 'Snack', items: ['Protein bar', 'Apple'] },
      { time: '7:30 PM', type: 'Dinner', items: ['Grilled chicken (150g)', 'Brown rice (1 cup)', 'Stir-fried vegetables', 'Soy sauce'] },
    ]
  }
];

// PT-Exclusive diet plans
export const DEMO_PT_DIET_PLANS = [
  {
    id: 'pt-diet-1',
    name: 'Sarah\'s Competition Prep Diet',
    trainerName: 'Sarah Connor',
    goal: 'Cutting',
    calories: '~1,800 kcal/day',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
    meals: [
      { time: '6:30 AM', type: 'Pre-Workout', items: ['Black coffee', 'Half banana'] },
      { time: '8:00 AM', type: 'Breakfast', items: ['6 egg whites omelette with spinach', 'Whole wheat toast (1 slice)', 'Grapefruit'] },
      { time: '11:00 AM', type: 'Snack', items: ['Protein shake (water-based)', 'Celery sticks'] },
      { time: '1:30 PM', type: 'Lunch', items: ['Tilapia (200g)', 'Brown rice (3/4 cup)', 'Steamed green beans', 'Lemon juice'] },
      { time: '4:00 PM', type: 'Snack', items: ['Greek yogurt (non-fat)', 'Cucumber slices'] },
      { time: '7:00 PM', type: 'Dinner', items: ['Grilled chicken breast (180g)', 'Sweet potato (medium)', 'Mixed greens salad', 'Apple cider vinegar dressing'] },
    ],
    validFrom: new Date(Date.now() - 86400000 * 14),
    validTo: new Date(Date.now() + 86400000 * 14),
  }
];

// Demo custom diet plans created by member
export const DEMO_CUSTOM_DIET_PLANS = [
  {
    id: 'custom-diet-1',
    name: 'My Veggie Day Plan',
    goal: 'Custom',
    calories: '~1,800 kcal',
    meals: [
      { time: '8:00 AM', type: 'Breakfast', items: ['Smoothie bowl with berries', 'Chia seeds', 'Granola'] },
      { time: '12:30 PM', type: 'Lunch', items: ['Paneer tikka', 'Roti (2)', 'Dal', 'Raita'] },
      { time: '4:00 PM', type: 'Snack', items: ['Roasted makhana', 'Green tea'] },
      { time: '8:00 PM', type: 'Dinner', items: ['Vegetable curry', 'Rice', 'Salad'] },
    ],
    createdAt: new Date(Date.now() - 86400000 * 4),
  }
];
