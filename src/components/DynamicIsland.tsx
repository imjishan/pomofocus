import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Timer, Pause, Play, Zap } from 'lucide-react';

interface DynamicIslandProps {
  isActive: boolean;
  timeLeft: number;
  totalTime: number;
  onToggle: () => void;
}

export default function DynamicIsland({ isActive, timeLeft, totalTime, onToggle }: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Auto-collapse after 4 seconds
  useEffect(() => {
    if (isExpanded) {
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 4000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    // If swiped up (negative y offset)
    if (info.offset.y < -20 || info.velocity.y < -100) {
      setIsExpanded(false);
    }
  };

  if (!isActive && !isExpanded) return null;

  return (
    <div className="fixed top-[22px] left-0 right-0 flex justify-center z-[100] pointer-events-none">
      <motion.div
        layout
        drag={isExpanded ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          width: isExpanded ? '320px' : '160px',
          height: isExpanded ? '80px' : '36px',
          borderRadius: isExpanded ? '32px' : '18px',
        }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        onClick={() => !isExpanded && handleExpand()}
        className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl pointer-events-auto cursor-pointer overflow-hidden flex items-center justify-between px-4 group relative"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
                <span className="text-[11px] font-black text-zinc-800 dark:text-white tracking-[0.1em] uppercase">Focus</span>
              </div>
              <span className="text-xs font-black text-zinc-800 dark:text-white tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 flex items-center justify-center text-blue-500 relative">
                  <Timer size={24} />
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="22"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="138"
                      strokeDashoffset={138 - (138 * progress) / 100}
                      className="text-blue-500 opacity-30"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Focus Session</div>
                  <div className="text-xl font-black text-zinc-800 dark:text-white tabular-nums leading-none mt-1">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                    // Reset auto-collapse timer on interaction
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = setTimeout(() => setIsExpanded(false), 4000);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-zinc-800/10 dark:bg-white/10 hover:bg-zinc-800/20 dark:hover:bg-white/20 text-zinc-800 dark:text-white flex items-center justify-center transition-colors"
                >
                  {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
              </div>

              {/* Swipe handle indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-zinc-800/10 dark:bg-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
