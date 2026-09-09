// Predefined Demo Accounts and Mock Data for Testing

export const DEMO_ACCOUNTS = {
  'staff@gym.com': {
    password: 'admin',
    aliases: ['admin123', 'admin', '123456'],
    user: { uid: 'demo-staff-1', email: 'staff@gym.com', displayName: 'Coach Marcus' },
    profile: {
      uid: 'demo-staff-1',
      name: 'Coach Marcus',
      email: 'staff@gym.com',
      phone: '+1 555-0199',
      role: 'staff',
      membershipType: null,
      isApproved: true,
      isActive: true,
      createdAt: '2026-01-15T08:00:00.000Z'
    }
  },
  'trainer@gym.com': {
    password: 'trainer123',
    aliases: ['trainer', 'admin123'],
    user: { uid: 'demo-trainer-1', email: 'trainer@gym.com', displayName: 'Sarah Connor' },
    profile: {
      uid: 'demo-trainer-1',
      name: 'Sarah Connor',
      email: 'trainer@gym.com',
      phone: '+1 555-0188',
      role: 'trainer',
      membershipType: null,
      isApproved: true,
      isActive: true,
      createdAt: '2026-02-01T09:00:00.000Z'
    }
  },
  'pt@gym.com': {
    password: 'member123',
    aliases: ['pt', 'password'],
    user: { uid: 'demo-pt-1', email: 'pt@gym.com', displayName: 'Alex Rivera' },
    profile: {
      uid: 'demo-pt-1',
      name: 'Alex Rivera',
      email: 'pt@gym.com',
      phone: '+1 555-0144',
      role: 'member',
      membershipType: 'pt',
      isApproved: true,
      assignedTrainer: 'Sarah Connor',
      isActive: true,
      createdAt: '2026-03-01T10:30:00.000Z'
    }
  },
  'member@gym.com': {
    password: 'member123',
    aliases: ['member', 'password'],
    user: { uid: 'demo-member-1', email: 'member@gym.com', displayName: 'Jordan Lee' },
    profile: {
      uid: 'demo-member-1',
      name: 'Jordan Lee',
      email: 'member@gym.com',
      phone: '+1 555-0122',
      role: 'member',
      membershipType: 'regular',
      isApproved: true,
      assignedTrainer: null,
      isActive: true,
      createdAt: '2026-03-10T11:00:00.000Z'
    }
  }
};

export const DEMO_NOTICES = [
  {
    id: 'demo-notice-1',
    title: '🔥 New Squat Racks & Dumbbell Sets Installed!',
    content: 'We have upgraded Zone B with 2 brand new Olympic squat racks and rubber hex dumbbells ranging from 2.5kg to 50kg. Come try them out today!',
    postedByName: 'Coach Marcus',
    isPinned: true,
    createdAt: new Date(Date.now() - 3600000 * 4) // 4 hours ago
  },
  {
    id: 'demo-notice-2',
    title: '⚡ Weekend Extended Opening Hours',
    content: 'Starting this Saturday, the gym will remain open until 11:00 PM on both Saturdays and Sundays for evening lifters.',
    postedByName: 'Sarah Connor',
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 28) // 1 day ago
  },
  {
    id: 'demo-notice-3',
    title: '🥤 Complimentary Protein Shake with PT Sessions',
    content: 'All members with active Personal Training slots receive a complimentary whey isolate recovery shake at the nutrition bar.',
    postedByName: 'Coach Marcus',
    isPinned: false,
    createdAt: new Date(Date.now() - 3600000 * 72) // 3 days ago
  }
];

export const DEMO_MEMBERS = [
  {
    uid: 'demo-member-1',
    name: 'Jordan Lee',
    email: 'member@gym.com',
    phone: '+1 555-0122',
    role: 'member',
    membershipType: 'regular',
    isApproved: true,
    assignedTrainer: null,
    isActive: true,
    createdAt: '2026-03-10T11:00:00.000Z'
  },
  {
    uid: 'demo-pt-1',
    name: 'Alex Rivera',
    email: 'pt@gym.com',
    phone: '+1 555-0144',
    role: 'member',
    membershipType: 'pt',
    isApproved: true,
    assignedTrainer: 'Sarah Connor',
    isActive: true,
    createdAt: '2026-03-01T10:30:00.000Z'
  },
  {
    uid: 'demo-member-3',
    name: 'David Chen',
    email: 'david.chen@gmail.com',
    phone: '+1 555-0167',
    role: 'member',
    membershipType: 'regular',
    isApproved: true,
    assignedTrainer: null,
    isActive: true,
    createdAt: '2026-02-18T14:20:00.000Z'
  },
  {
    uid: 'demo-member-4',
    name: 'Elena Rostova',
    email: 'elena.r@outlook.com',
    phone: '+1 555-0192',
    role: 'member',
    membershipType: 'pt',
    isApproved: true,
    assignedTrainer: 'Sarah Connor',
    isActive: true,
    createdAt: '2026-01-20T09:15:00.000Z'
  },
  {
    uid: 'demo-member-5',
    name: 'Michael Scott',
    email: 'mscott@dunder.com',
    phone: '+1 555-0105',
    role: 'member',
    membershipType: 'regular',
    isApproved: true,
    assignedTrainer: null,
    isActive: false, // Inactive member for testing filters!
    createdAt: '2025-11-12T16:00:00.000Z'
  }
];
