import React from 'react';
import { Timer, History, Moon, BarChart3 } from 'lucide-react';
import { Tab } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = [
    { id: 'focus' as Tab, label: 'FOCUS', icon: Timer },
    { id: 'sessions' as Tab, label: 'SESSIONS', icon: History },
    { id: 'sleep' as Tab, label: 'SLEEP', icon: Moon },
    { id: 'stats' as Tab, label: 'STATS', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-[32px] p-2 flex justify-between items-center shadow-2xl shadow-black/5 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-6 py-3 rounded-[24px] transition-all duration-300",
              isActive 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-widest">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
