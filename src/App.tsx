import React, { useState, useEffect } from 'react';
import { UserProfile, Session, Preset, Tab } from './types';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FocusTab from './components/FocusTab';
import SessionsTab from './components/SessionsTab';
import SleepTab from './components/SleepTab';
import StatsTab from './components/StatsTab';
import SettingsModal from './components/SettingsModal';
import MoreMenu from './components/MoreMenu';
import DynamicIsland from './components/DynamicIsland';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest',
  email: 'guest@example.com',
  displayName: 'Guest User',
  photoURL: 'https://picsum.photos/seed/guest/200',
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

const DEFAULT_PRESETS: Preset[] = [
  { id: 'study', uid: 'guest', title: 'Study', type: 'BALANCED LEARNING', duration: 45, autoStart: true, vibration: false, icon: 'GraduationCap' },
  { id: 'deep-work', uid: 'guest', title: 'Deep Work', type: 'FOCUS INTENSITY', duration: 90, autoStart: false, vibration: true, icon: 'Cpu' },
  { id: 'creative', uid: 'guest', title: 'Creative', type: 'OPEN EXPLORATION', duration: 60, autoStart: false, vibration: false, icon: 'PenTool' },
];

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('presets');
    return saved ? JSON.parse(saved) : DEFAULT_PRESETS;
  });
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Timer State (Lifted from FocusTab)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    if (userProfile.settings?.theme) {
      setTheme(userProfile.settings.theme);
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('presets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

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

  const handleSessionComplete = (duration: number) => {
    // Save session
    const newSession: Session = {
      id: Date.now().toString(),
      uid: 'guest',
      type: 'focus',
      duration,
      timestamp: new Date().toISOString(),
      productivityLevel: 'PRODUCTIVE',
      title: 'Focus Session',
    };
    setSessions(prev => [newSession, ...prev]);

    // Update user stats
    setUserProfile(prev => ({
      ...prev,
      totalFocusTime: (prev.totalFocusTime || 0) + duration,
    }));
  };

  const handlePresetUpdate = (preset: Preset) => {
    setPresets(prev => prev.map(p => p.title === preset.title ? preset : p));
  };

  const handleUpdateSettings = (settings: Partial<UserProfile['settings']>) => {
    const updatedSettings = { ...userProfile.settings, ...settings };
    if (settings.theme) {
      setTheme(settings.theme);
    }
    setUserProfile(prev => ({ ...prev, settings: updatedSettings }));
  };

  const handleUpdateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const handleResetStats = () => {
    setUserProfile(prev => ({
      ...prev,
      totalFocusTime: 0,
      streak: 0,
    }));
    setSessions([]);
  };

  const toggleTheme = () => {
    const newTheme = userProfile.settings.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setUserProfile(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: newTheme }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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

