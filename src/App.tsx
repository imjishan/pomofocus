import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, Session, Preset, Tab } from './types';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FocusTab from './components/FocusTab';
import SessionsTab from './components/SessionsTab';
import SleepTab from './components/SleepTab';
import StatsTab from './components/StatsTab';
import Auth from './components/Auth';
import SettingsModal from './components/SettingsModal';
import MoreMenu from './components/MoreMenu';
import DynamicIsland from './components/DynamicIsland';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Timer State (Lifted from FocusTab)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setPresets([]);
      setSessions([]);
      return;
    }

    // Listen to user profile
    const userRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        setUserProfile(data);
        if (data.settings?.theme) {
          setTheme(data.settings.theme);
        }
      }
    });

    // Listen to presets
    const presetsRef = collection(db, 'presets');
    const qPresets = query(presetsRef, where('uid', '==', user.uid));
    const unsubPresets = onSnapshot(qPresets, (snapshot) => {
      const presetsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Preset));
      if (presetsData.length === 0) {
        // Create default presets if none exist
        const defaultPresets: Preset[] = [
          { uid: user.uid, title: 'Study', type: 'BALANCED LEARNING', duration: 45, autoStart: true, vibration: false, icon: 'GraduationCap' },
          { uid: user.uid, title: 'Deep Work', type: 'FOCUS INTENSITY', duration: 90, autoStart: false, vibration: true, icon: 'Cpu' },
          { uid: user.uid, title: 'Creative', type: 'OPEN EXPLORATION', duration: 60, autoStart: false, vibration: false, icon: 'PenTool' },
        ];
        defaultPresets.forEach(p => addDoc(presetsRef, p));
      } else {
        setPresets(presetsData);
      }
    });

    // Listen to sessions
    const sessionsRef = collection(db, 'sessions');
    const qSessions = query(sessionsRef, where('uid', '==', user.uid));
    const unsubSessions = onSnapshot(qSessions, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session)));
    });

    return () => {
      unsubProfile();
      unsubPresets();
      unsubSessions();
    };
  }, [user]);

  // Timer Logic (Lifted from FocusTab)
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            handleSessionComplete(Math.floor(totalTime / 60));
            return totalTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, totalTime]);

  // Handle theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const handleSessionComplete = async (duration: number) => {
    if (!user) return;
    
    // Save session
    const sessionsRef = collection(db, 'sessions');
    await addDoc(sessionsRef, {
      uid: user.uid,
      type: 'focus',
      duration,
      timestamp: new Date().toISOString(),
      productivityLevel: 'PRODUCTIVE',
      title: 'Focus Session',
    });

    // Update user stats
    if (userProfile) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        totalFocusTime: (userProfile.totalFocusTime || 0) + duration,
      });
    }
  };

  const handlePresetUpdate = async (preset: Preset) => {
    if (!preset.id) return;
    const presetRef = doc(db, 'presets', preset.id);
    const { id, ...data } = preset;
    await updateDoc(presetRef, data);
  };

  const handleUpdateSettings = async (settings: Partial<UserProfile['settings']>) => {
    if (!user || !userProfile) return;
    const userRef = doc(db, 'users', user.uid);
    const updatedSettings = { ...userProfile.settings, ...settings };
    if (settings.theme) {
      setTheme(settings.theme);
    }
    await updateDoc(userRef, { settings: updatedSettings });
  };

  const handleUpdateProfile = async (profile: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, profile);
  };

  const handleResetStats = async () => {
    if (!user || !userProfile) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      totalFocusTime: 0,
      streak: 0,
    });
  };

  const toggleTheme = async () => {
    if (!user || !userProfile) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      'settings.theme': userProfile.settings.theme === 'light' ? 'dark' : 'light',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-600/20">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-12 h-12">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </motion.div>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">Focus</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-12 max-w-xs">
          Your minimalist companion for productivity and deep work.
        </p>
        <Auth />
      </div>
    );
  }

  const handlePresetSelect = (preset: Preset) => {
    setIsActive(false);
    setTimeLeft(preset.duration * 60);
    setTotalTime(preset.duration * 60);
    setActiveTab('focus');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'focus':
        return (
          <FocusTab 
            userProfile={userProfile} 
            timeLeft={timeLeft}
            isActive={isActive}
            totalTime={totalTime}
            setTimeLeft={setTimeLeft}
            setIsActive={setIsActive}
            setTotalTime={setTotalTime}
            onSessionComplete={handleSessionComplete} 
          />
        );
      case 'sessions':
        return (
          <SessionsTab 
            presets={presets} 
            onPresetSelect={handlePresetSelect} 
            onPresetUpdate={handlePresetUpdate}
            onAddPreset={() => console.log('Add preset')}
          />
        );
      case 'sleep':
        return <SleepTab />;
      case 'stats':
        return <StatsTab userProfile={userProfile} sessions={sessions} />;
      default:
        return (
          <FocusTab 
            userProfile={userProfile} 
            timeLeft={timeLeft}
            isActive={isActive}
            totalTime={totalTime}
            setTimeLeft={setTimeLeft}
            setIsActive={setIsActive}
            setTotalTime={setTotalTime}
            onSessionComplete={handleSessionComplete} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 relative overflow-hidden">
      {/* Global Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      <DynamicIsland 
        isActive={isActive} 
        timeLeft={timeLeft} 
        totalTime={totalTime} 
        onToggle={() => setIsActive(!isActive)} 
      />
      
      <Header 
        title={activeTab} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onMoreClick={() => setIsMoreOpen(true)}
      />
      
      <main className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onUpdateSettings={handleUpdateSettings}
        onUpdateProfile={handleUpdateProfile}
      />

      <MoreMenu
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        onResetStats={handleResetStats}
      />
    </div>
  );
}

