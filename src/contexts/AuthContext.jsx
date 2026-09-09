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

      // Listen to user profile in Firestore
      try {
        const userDocRef = doc(db, 'users', user.uid);
        unsubProfile = onSnapshot(userDocRef, async (snap) => {
          if (snap.exists()) {
            const profile = { uid: user.uid, ...snap.data() };
            // Check if user is deactivated
            if (profile.isActive === false) {
              await signOut(auth);
              setUserProfile(null);
            } else {
              setUserProfile(profile);
            }
          } else {
            // Profile doesn't exist yet in Firestore — auto-bootstrap profile
            const newProfile = {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Member',
              email: user.email?.toLowerCase() || '',
              phone: '',
              role: 'member',
              membershipType: 'regular',
              assignedTrainer: null,
              isApproved: true,
              isActive: true,
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
          setLoading(false);
        }, (err) => {
          console.warn('Firestore user profile listener error:', err);
          setLoading(false);
        });
      } catch (err) {
        console.warn('Firestore init error:', err);
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
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }

    // Determine role: if first user or requested as staff, set role accordingly
    let role = requestedRole;
    try {
      const existingUsersSnap = await getDocs(query(collection(db, 'users'), limit(2)));
      if (existingUsersSnap.empty) {
        // First account ever created gets Staff / Admin role automatically!
        role = 'staff';
      }
    } catch {
      // ignore
    }

    const newProfile = {
      uid: cred.user.uid,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: phone || '',
      role: role, // 'member' or 'staff'
      membershipType: role === 'member' ? 'regular' : null,
      assignedTrainer: null,
      isApproved: true,
      isActive: true,
      fcmToken: null,
      createdAt: serverTimestamp()
    };

    // Store user profile in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setUserProfile(newProfile);

    return cred.user;
  }

  // Create a staff or trainer account (called by an authenticated staff member)
  async function createStaffAccount(email, password, name, role = 'staff') {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    await updateProfile(cred.user, { displayName: name });

    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      name,
      email: cleanEmail,
      phone: '',
      role, // 'staff' or 'trainer'
      membershipType: null,
      assignedTrainer: null,
      isApproved: true,
      isActive: true,
      fcmToken: null,
      createdAt: serverTimestamp()
    });

    return cred.user;
  }

  // Real Firebase login
  async function login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);

    // Verify account is active
    try {
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (userDoc.exists() && userDoc.data().isActive === false) {
        await signOut(auth);
        throw new Error('Your account has been deactivated. Please contact gym administration.');
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
