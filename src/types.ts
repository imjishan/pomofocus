export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  streak: number;
  totalFocusTime: number; // in minutes
  dailyGoal: number; // in hours
  nextBreak: string; // HH:mm
  settings: {
    theme: 'light' | 'dark';
    autoStart: boolean;
    vibration: boolean;
  };
}

export interface Session {
  id?: string;
  uid: string;
  type: 'focus' | 'sleep';
  duration: number; // in minutes
  timestamp: string; // ISO string
  productivityLevel?: 'PRODUCTIVE' | 'DEEP' | 'FOCUSED';
  title: string;
}

export interface Preset {
  id?: string;
  uid: string;
  title: string;
  type: string;
  duration: number; // in minutes
  autoStart: boolean;
  vibration: boolean;
  icon: string;
}

export type Tab = 'focus' | 'sessions' | 'sleep' | 'stats';
