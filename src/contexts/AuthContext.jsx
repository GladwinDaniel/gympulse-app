import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { DEMO_ACCOUNTS } from '../data/demoData';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  // Check for saved demo session
  const [demoUser, setDemoUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gympulse_demo_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState(demoUser?.user || null);
  const [userProfile, setUserProfile] = useState(demoUser?.profile || null);
  const [loading, setLoading] = useState(!demoUser);

  // Listen to Firebase auth state changes (if not using demo account)
  useEffect(() => {
    if (demoUser) {
      setLoading(false);
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // Listen to user profile in Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubProfile = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const profile = { uid: user.uid, ...snap.data() };
            // Check if user is deactivated
            if (!profile.isActive) {
              signOut(auth);
              setUserProfile(null);
            } else {
              setUserProfile(profile);
            }
          }
          setLoading(false);
        }, (err) => {
          console.warn('Profile listener error:', err);
          setLoading(false);
        });

        return () => unsubProfile();
      } catch (err) {
        console.warn('Firestore init error:', err);
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, [demoUser]);

  // Sign up a new member
  async function signup(email, password, name, phone) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        phone: phone || '',
        role: 'member',
        membershipType: 'regular',
        assignedTrainer: null,
        isApproved: false,
        isActive: true,
        fcmToken: null,
        createdAt: serverTimestamp()
      });

      return cred.user;
    } catch (err) {
      // If Firebase fails due to placeholder config, create local demo member
      if (err.code?.includes('api-key') || err.message?.includes('API key')) {
        const mockMember = {
          user: { uid: 'demo-' + Date.now(), email, displayName: name },
          profile: {
            uid: 'demo-' + Date.now(),
            name,
            email,
            phone: phone || '',
            role: 'member',
            membershipType: 'regular',
            assignedTrainer: null,
            isApproved: false,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        };
        localStorage.setItem('gympulse_demo_auth', JSON.stringify(mockMember));
        setDemoUser(mockMember);
        setCurrentUser(mockMember.user);
        setUserProfile(mockMember.profile);
        return mockMember.user;
      }
      throw err;
    }
  }

  // Create a staff or trainer account (called by existing staff)
  async function createStaffAccount(email, password, name, role = 'staff') {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      phone: '',
      role, // 'staff' or 'trainer'
      membershipType: null,
      assignedTrainer: null,
      isActive: true,
      fcmToken: null,
      createdAt: serverTimestamp()
    });

    return cred.user;
  }

  // Direct login as demo
  function loginAsDemo(accountKey) {
    const account = DEMO_ACCOUNTS[accountKey.toLowerCase()];
    if (!account) return false;
    const session = { user: account.user, profile: account.profile };
    localStorage.setItem('gympulse_demo_auth', JSON.stringify(session));
    setDemoUser(session);
    setCurrentUser(account.user);
    setUserProfile(account.profile);
    return true;
  }

  // Login
  async function login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // Check if it's one of the demo accounts
    if (DEMO_ACCOUNTS[cleanEmail]) {
      const demoAcc = DEMO_ACCOUNTS[cleanEmail];
      const validPass = demoAcc.password === password || (demoAcc.aliases && demoAcc.aliases.includes(password)) || password === 'admin123' || password === 'member123' || password === 'trainer123' || password === 'admin';
      if (validPass) {
        loginAsDemo(cleanEmail);
        return demoAcc.user;
      } else {
        throw new Error('Invalid demo password. Try: admin123 or member123');
      }
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Check if user is active
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists() && !userDoc.data().isActive) {
        await signOut(auth);
        throw new Error('Your account has been deactivated. Please contact the gym staff.');
      }

      return cred.user;
    } catch (err) {
      if (err.code?.includes('api-key') || err.message?.includes('API key')) {
        throw new Error('Firebase is not yet configured. Use Demo Credentials to test: staff@gym.com (password: admin) or member@gym.com (password: member123)');
      }
      throw err;
    }
  }

  // Logout
  async function logout() {
    localStorage.removeItem('gympulse_demo_auth');
    setDemoUser(null);
    setCurrentUser(null);
    setUserProfile(null);
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }

  // Reset password
  async function resetPassword(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (DEMO_ACCOUNTS[cleanEmail]) {
      return; // Simulated success for demo
    }
    await sendPasswordResetEmail(auth, email);
  }

  // Check user role
  const isMember = userProfile?.role === 'member';
  const isStaff = userProfile?.role === 'staff';
  const isTrainer = userProfile?.role === 'trainer';
  const isPTMember = userProfile?.membershipType === 'pt';
  const isStaffOrTrainer = isStaff || isTrainer;

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    loginAsDemo,
    resetPassword,
    createStaffAccount,
    isMember,
    isStaff,
    isTrainer,
    isPTMember,
    isStaffOrTrainer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
