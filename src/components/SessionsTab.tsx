import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Cpu, PenTool, Plus, Check, Settings2, Bell, BellOff, PlayCircle } from 'lucide-react';
import { Preset } from '../types';

interface SessionsTabProps {
  presets: Preset[];
  onPresetSelect: (preset: Preset) => void;
  onPresetUpdate: (preset: Preset) => void;
  onAddPreset: () => void;
}

export default function SessionsTab({ presets, onPresetSelect, onPresetUpdate, onAddPreset }: SessionsTabProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(presets[0]?.id);

  const handleSelect = (preset: Preset) => {
    setSelectedId(preset.id);
    onPresetSelect(preset);
  };

  return (
    <div className="flex flex-col pt-24 pb-32 px-6 min-h-screen relative overflow-hidden">
      <div className="mb-10 relative z-10">
        <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
          Study Sessions
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
          Customize your flow. Your library of work blocks designed for maximum productivity.
        </p>
      </div>

      <div className="space-y-6 relative z-10">
        {presets.map((preset) => {
          const isSelected = selectedId === preset.id;
          const Icon = preset.icon === 'GraduationCap' ? GraduationCap : preset.icon === 'Cpu' ? Cpu : PenTool;

          return (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/10 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[40px] shadow-xl border transition-all duration-300 ${
                isSelected ? 'border-blue-500/50 ring-4 ring-blue-500/10' : 'border-white/20 dark:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-white/10 dark:bg-white/5 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{preset.title}</h3>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                      {preset.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSelect(preset)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-white/10 dark:bg-white/5 text-zinc-400'
                  }`}
                >
                  {isSelected && <Check size={16} strokeWidth={3} />}
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                      Duration
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{preset.duration}</span>
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">min</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={preset.duration}
                    onChange={(e) => onPresetUpdate({ ...preset, duration: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onPresetUpdate({ ...preset, autoStart: !preset.autoStart })}
                    className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md transition-all ${
                      preset.autoStart ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' : 'bg-white/5 dark:bg-black/10 border-white/10 dark:border-white/5 text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">Auto-start</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${preset.autoStart ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${preset.autoStart ? 'left-6' : 'left-1'}`} />
                    </div>
                  </button>

                  <button
                    onClick={() => onPresetUpdate({ ...preset, vibration: !preset.vibration })}
                    className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md transition-all ${
                      preset.vibration ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' : 'bg-white/5 dark:bg-black/10 border-white/10 dark:border-white/5 text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase">Vibration</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${preset.vibration ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${preset.vibration ? 'left-6' : 'left-1'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onAddPreset}
        className="fixed bottom-32 right-8 w-16 h-16 rounded-full bg-blue-600/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
