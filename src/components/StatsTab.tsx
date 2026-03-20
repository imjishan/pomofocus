import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Clock, Zap, Star, Monitor, BookOpen, PenTool } from 'lucide-react';
import { UserProfile, Session } from '../types';

interface StatsTabProps {
  userProfile: UserProfile | null;
  sessions: Session[];
}

const data = [
  { name: 'MON', value: 40 },
  { name: 'TUE', value: 65 },
  { name: 'WED', value: 90 },
  { name: 'THU', value: 30 },
  { name: 'FRI', value: 55 },
  { name: 'SAT', value: 20 },
  { name: 'SUN', value: 15 },
];

export default function StatsTab({ userProfile, sessions }: StatsTabProps) {
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="flex flex-col pt-24 pb-32 px-6 min-h-screen relative overflow-hidden">
      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[40px] shadow-xl border border-white/20 dark:border-white/10 mb-6 relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-2">
              Current Streak
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                {userProfile?.streak || 0}
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Days</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-3xl bg-orange-500/10 backdrop-blur-md flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Flame size={32} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
          <Star size={16} className="fill-blue-600 dark:fill-blue-400" />
          <span>Keep it up!</span>
        </div>
      </motion.div>

      {/* Total Focus Time Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[40px] shadow-xl border border-white/20 dark:border-white/10 mb-12 relative z-10"
      >
        <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase block mb-2">
          Total Focus Time
        </span>
        <div className="text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-6">
          {hours}h {minutes}m
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center text-white">
            <Zap size={18} className="fill-white" />
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-600/90 backdrop-blur-md flex items-center justify-center text-white">
            <Star size={18} className="fill-white" />
          </div>
        </div>
      </motion.div>

      {/* Weekly Activity */}
      <div className="mb-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Weekly Activity
          </h3>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Activity Overview</span>
        </div>
        
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[40px] shadow-xl border border-white/20 dark:border-white/10 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#71717A' }}
                dy={10}
              />
              <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'WED' ? '#2563EB' : 'rgba(113, 113, 122, 0.2)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="mb-12 relative z-10">
        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-8">
          Recent Sessions
        </h3>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-[32px] border border-dashed border-white/10">
              <p className="text-zinc-500 font-medium">No sessions yet. Start focusing!</p>
            </div>
          ) : (
            sessions.slice(0, 5).map((session, i) => {
              const Icon = Monitor;
              return (
                <motion.div
                  key={session.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 rounded-[32px] shadow-xl border border-white/20 dark:border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{session.title}</h4>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-zinc-900 dark:text-zinc-100">{session.duration}m</div>
                    <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                      {session.productivityLevel}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
