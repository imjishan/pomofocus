import React from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { LogIn, LogOut } from 'lucide-react';

export default function Auth() {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create default user profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          streak: 0,
          totalFocusTime: 0,
          dailyGoal: 6,
          nextBreak: '05:00',
          settings: {
            theme: 'light',
            autoStart: true,
            vibration: false,
          },
        };
        await setDoc(userRef, newProfile);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = () => signOut(auth);

  if (auth.currentUser) {
    return (
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
    >
      <LogIn size={20} />
      <span className="font-medium">Sign in with Google</span>
    </button>
  );
}
