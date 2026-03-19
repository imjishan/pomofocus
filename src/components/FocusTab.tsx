import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Coffee, Pause, Play, RotateCcw, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface FocusTabProps {
  userProfile: UserProfile | null;
  timeLeft: number;
  isActive: boolean;
  totalTime: number;
  setTimeLeft: (time: number) => void;
  setIsActive: (active: boolean) => void;
  setTotalTime: (time: number) => void;
  onSessionComplete: (duration: number) => void;
}

export default function FocusTab({ 
  userProfile, 
  timeLeft, 
  isActive, 
  totalTime, 
  setTimeLeft, 
  setIsActive, 
  setTotalTime, 
  onSessionComplete 
}: FocusTabProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setTotalTime(25 * 60);
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex flex-col items-center pt-24 pb-32 px-6 min-h-screen relative overflow-hidden">
      {/* Background Orbs for Glass Effect */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 dark:text-zinc-400 uppercase">
          Deep Work Session
        </span>
        <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight">
          Concentrate
        </h2>
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-16 z-10">
        {/* Glass Background Circle */}
        <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl" />
        
        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            cx="144"
            cy="144"
            r="138"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="867"
            initial={{ strokeDashoffset: 867 }}
            animate={{ strokeDashoffset: 867 - (867 * progress) / 100 }}
            transition={{ duration: 0.5, ease: "linear" }}
            className="text-blue-600 dark:text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
            strokeLinecap="round"
          />
        </svg>

        <div className="text-center z-10">
          <motion.div 
            key={timeLeft}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-zinc-500 dark:text-zinc-400">
            <Zap size={14} className="fill-blue-500 text-blue-500" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Active</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12 z-10">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 rounded-[32px] border border-white/20 dark:border-white/10 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Flame size={20} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1">
            Daily Goal
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {userProfile?.totalFocusTime ? Math.floor(userProfile.totalFocusTime / 60) : 0}/
              {userProfile?.dailyGoal || 6}
            </span>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">hrs</span>
          </div>
        </div>

        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 rounded-[32px] border border-white/20 dark:border-white/10 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
            <Coffee size={20} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-1">
            Next Break
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {userProfile?.nextBreak || '05:00'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 w-full max-w-sm z-10">
        <button
          onClick={toggleTimer}
          className="flex-1 h-16 rounded-[32px] bg-blue-600/90 hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 backdrop-blur-md border border-white/20 transition-all active:scale-95"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span className="tracking-widest uppercase text-sm">
            {isActive ? 'Pause' : 'Start'}
          </span>
        </button>
        
        <button
          onClick={resetTimer}
          className="w-16 h-16 rounded-[32px] bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center transition-all active:scale-95"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
