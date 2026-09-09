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
  serverTimestamp,
  collection,
  getDocs,
  limit,
  query
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to load or cache local profile fallback
  function getCachedProfile(uid, fallbackRole = 'member', fallbackName = '', fallbackEmail = '') {
    try {
      const cached = localStorage.getItem(`gympulse_profile_${uid}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return {
      uid,
      name: fallbackName || 'Gym User',
      email: fallbackEmail || '',
      phone: '',
      role: fallbackRole,
      membershipType: fallbackRole === 'member' ? 'regular' : null,
      assignedTrainer: null,
      isApproved: true,
      isActive: true,
    };
  }

  function cacheProfile(uid, profile) {
    try {
      localStorage.setItem(`gympulse_profile_${uid}`, JSON.stringify(profile));
    } catch {}
  }

  // Listen to live Firebase Auth state changes
  useEffect(() => {
    let unsubProfile = null;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setUserProfile(null);
        if (unsubProfile) unsubProfile();
        setLoading(false);
        return;
      }

      // Check for cached profile first
      const defaultProfile = getCachedProfile(
        user.uid,
        user.email?.includes('staff') || user.email?.includes('admin') ? 'staff' : 'member',
        user.displayName,
        user.email
      );

      // Attempt to listen to Firestore user profile
      try {
        const userDocRef = doc(db, 'users', user.uid);
        unsubProfile = onSnapshot(userDocRef, async (snap) => {
          if (snap.exists()) {
            const profile = { uid: user.uid, ...snap.data() };
            if (profile.isActive === false) {
              await signOut(auth);
              setUserProfile(null);
            } else {
              setUserProfile(profile);
              cacheProfile(user.uid, profile);
            }
          } else {
            // Profile doesn't exist yet in Firestore
            setUserProfile(defaultProfile);
            // Attempt non-blocking write
            try {
              await setDoc(userDocRef, { ...defaultProfile, createdAt: serverTimestamp() });
            } catch (wErr) {
              console.warn('Firestore setDoc warning (database might need setup):', wErr);
            }
          }
          setLoading(false);
        }, (err) => {
          console.warn('Firestore user profile listener warning (using resilient local profile):', err);
          setUserProfile(defaultProfile);
          setLoading(false);
        });
      } catch (err) {
        console.warn('Firestore init warning:', err);
        setUserProfile(defaultProfile);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // Sign up a new user (Member or Staff)
  async function signup(email, password, name, phone = '', requestedRole = 'member') {
    const cleanEmail = email.trim().toLowerCase();
    
    // 1. Create user in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    
    if (name) {
      try {
        await updateProfile(cred.user, { displayName: name });
      } catch {}
    }

    // 2. Prepare profile
    let role = requestedRole;
    if (cleanEmail.includes('staff') || cleanEmail.includes('admin')) {
      role = 'staff';
    }

    const newProfile = {
      uid: cred.user.uid,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: phone || '',
      role: role,
      membershipType: role === 'member' ? 'regular' : null,
      assignedTrainer: null,
      isApproved: true,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    cacheProfile(cred.user.uid, newProfile);
    setUserProfile(newProfile);

    // 3. Attempt Firestore write (resilient so it never fails sign-up if Firestore is uninitialized)
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        ...newProfile,
        createdAt: serverTimestamp()
      });
    } catch (dbErr) {
      console.warn('Firestore setDoc notice (Cloud Firestore may not be initialized yet in console):', dbErr);
    }

    return cred.user;
  }

  // Create a staff or trainer account
  async function createStaffAccount(email, password, name, role = 'staff') {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (name) {
      try { await updateProfile(cred.user, { displayName: name }); } catch {}
    }

    const staffProfile = {
      uid: cred.user.uid,
      name,
      email: cleanEmail,
      phone: '',
      role,
      membershipType: null,
      assignedTrainer: null,
      isApproved: true,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    cacheProfile(cred.user.uid, staffProfile);

    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        ...staffProfile,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore createStaff warning:', err);
    }

    return cred.user;
  }

  // Real Firebase login
  async function login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);

    // Verify account is active if Firestore is reachable
    try {
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.isActive === false) {
          await signOut(auth);
          throw new Error('Your account has been deactivated. Please contact gym administration.');
        }
        cacheProfile(cred.user.uid, { uid: cred.user.uid, ...data });
      }
    } catch (err) {
      if (err.message?.includes('deactivated')) throw err;
    }

    return cred.user;
  }

  // Logout
  async function logout() {
    setCurrentUser(null);
    setUserProfile(null);
    await signOut(auth);
  }

  // Send password reset email
  async function resetPassword(email) {
    const cleanEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, cleanEmail);
  }

  // Role helpers
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
