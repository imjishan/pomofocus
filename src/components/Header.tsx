import React from 'react';
import { Settings, MoreHorizontal } from 'lucide-react';
import { Tab } from '../types';

interface HeaderProps {
  title: string;
  onSettingsClick?: () => void;
  onMoreClick?: () => void;
}

export default function Header({ title, onSettingsClick, onMoreClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-40 pointer-events-none">
      <button 
        onClick={onSettingsClick}
        className="p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transition-all active:scale-90 pointer-events-auto text-zinc-800 dark:text-zinc-200"
      >
        <Settings size={22} />
      </button>
      
      <div className="flex-1" />
      
      <button 
        onClick={onMoreClick}
        className="p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transition-all active:scale-90 pointer-events-auto text-zinc-800 dark:text-zinc-200"
      >
        <MoreHorizontal size={22} />
      </button>
    </header>
  );
}
