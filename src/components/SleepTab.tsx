import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { CloudRain, Trees, Wind, Moon, Sun, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function SleepTab() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSound, setSelectedSound] = useState<'rain' | 'forest' | 'noise' | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSound && isSleeping) {
      const soundUrls = {
        rain: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
        forest: 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg',
        noise: 'https://actions.google.com/sounds/v1/ambiences/white_noise.ogg',
      };

      if (!audioRef.current) {
        audioRef.current = new Audio(soundUrls[selectedSound]);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = soundUrls[selectedSound];
      }
      
      audioRef.current.volume = volume;
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedSound, isSleeping]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const sounds = [
    { id: 'rain' as const, label: 'Rain', icon: CloudRain },
    { id: 'forest' as const, label: 'Forest', icon: Trees },
    { id: 'noise' as const, label: 'Noise', icon: Wind },
  ];

  return (
    <div className="flex flex-col pt-24 pb-32 px-6 min-h-screen relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center mb-12 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 dark:text-zinc-400 uppercase block mb-4">
            Current Time
          </span>
          <h2 className="text-8xl font-black text-zinc-900 dark:text-white tracking-tighter drop-shadow-2xl">
            {formatTime(currentTime)}
          </h2>
        </div>
      </div>

      <div className="mb-12 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 dark:text-zinc-400 uppercase block">
            Ambient Sound
          </span>
          {selectedSound && isSleeping && (
            <div className="flex items-center gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {volume === 0 ? <VolumeX size={14} className="text-zinc-400" /> : <Volume2 size={14} className="text-blue-500" />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {sounds.map((sound) => {
            const Icon = sound.icon;
            const isSelected = selectedSound === sound.id;

            return (
              <button
                key={sound.id}
                onClick={() => setSelectedSound(isSelected ? null : sound.id)}
                className={`flex flex-col items-center gap-4 p-6 rounded-[32px] backdrop-blur-xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-600 dark:text-blue-400' 
                    : 'bg-white/10 dark:bg-black/20 text-zinc-500 dark:text-zinc-400 border-white/20 dark:border-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-white/10 dark:bg-white/5 text-blue-600 dark:text-blue-400'
                }`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">{sound.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 dark:border-white/10 mb-12 flex items-center justify-between relative z-10 shadow-xl">
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Wake up</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Gentle rise alarm at sunrise</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">07:00</div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">Tomorrow</span>
        </div>
      </div>

      <button
        onClick={() => setIsSleeping(!isSleeping)}
        className="w-full h-20 rounded-[40px] bg-blue-600/90 backdrop-blur-md border border-white/20 text-white font-bold flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 transition-all active:scale-95 relative z-10"
      >
        {isSleeping ? <Pause size={24} /> : <Moon size={24} />}
        <span className="tracking-widest uppercase text-lg">
          {isSleeping ? 'End Session' : 'Start Session'}
        </span>
      </button>
    </div>
  );
}
