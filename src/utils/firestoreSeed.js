import { collection, getDocs, addDoc, serverTimestamp, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Bootstrap default notices and gym resources if Firestore is empty.
 */
export async function seedInitialFirestoreData() {
  try {
    const noticesRef = collection(db, 'notices');
    const existingSnap = await getDocs(query(noticesRef, limit(1)));

    if (existingSnap.empty) {
      // Seed starter notice
      await addDoc(noticesRef, {
        title: 'Welcome to GymPulse Live! 🏋️‍♂️',
        content: 'Welcome to the official GymPulse app! Track your daily workout routines, explore the 3D body anatomy planner, follow tailored diet plans, and check in at the front desk with your unique QR code.',
        authorName: 'Gym Management',
        isFeatured: true,
        createdAt: serverTimestamp()
      });

      await addDoc(noticesRef, {
        title: 'Peak Hours & Hydration Reminder 💧',
        content: 'Peak gym hours are 6:00 AM - 9:00 AM and 5:00 PM - 8:30 PM. Please remember to wipe down equipment after use and stay hydrated throughout your sessions!',
        authorName: 'Head Coach Marcus',
        isFeatured: false,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('Firestore seed warning (normal if rules or connection pending):', err);
  }
}
