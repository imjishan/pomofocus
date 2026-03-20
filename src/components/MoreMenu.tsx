import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, RefreshCw, HelpCircle } from 'lucide-react';

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onResetStats: () => void;
}

export default function MoreMenu({ isOpen, onClose, onResetStats }: MoreMenuProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Focus App',
          text: 'Check out this minimalist Pomodoro app!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-20 right-6 w-64 bg-white/70 dark:bg-black/40 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/20 dark:border-white/10 p-2 z-[70] overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/20 dark:hover:bg-white/5 transition-all active:scale-[0.98] text-zinc-900 dark:text-zinc-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Share2 size={18} />
                </div>
                <span className="font-bold text-sm">Share Session</span>
              </button>

              <button
                onClick={() => { onResetStats(); onClose(); }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/20 dark:hover:bg-white/5 transition-all active:scale-[0.98] text-zinc-900 dark:text-zinc-100"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <RefreshCw size={18} />
                </div>
                <span className="font-bold text-sm">Reset Daily Stats</span>
              </button>

              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/20 dark:hover:bg-white/5 transition-all active:scale-[0.98] text-zinc-900 dark:text-zinc-100"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <HelpCircle size={18} />
                </div>
                <span className="font-bold text-sm">Help & Support</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
