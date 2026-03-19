import React from 'react';
import { Drawer } from 'vaul';
import { X, Moon, Sun, Bell, Volume2, Smartphone, Target, Clock } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onUpdateSettings: (settings: Partial<UserProfile['settings']>) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export default function SettingsModal({ isOpen, onClose, userProfile, onUpdateSettings, onUpdateProfile }: SettingsModalProps) {
  if (!userProfile) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-md z-[60]" />
        <Drawer.Content className="bg-white/70 dark:bg-black/40 backdrop-blur-3xl flex flex-col rounded-t-[40px] h-[90vh] fixed bottom-0 left-0 right-0 max-w-xl mx-auto z-[70] outline-none border-t border-white/20 dark:border-white/10 shadow-2xl">
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-400/30 dark:bg-zinc-600/30 mb-8" />
            
            <div className="max-w-md mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <Drawer.Title className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Settings
                </Drawer.Title>
                <Drawer.Close asChild>
                  <button className="p-2 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-zinc-500 dark:text-zinc-400 shadow-sm transition-all active:scale-90">
                    <X size={20} />
                  </button>
                </Drawer.Close>
              </div>

              <div className="space-y-8 pb-12">
                {/* Appearance */}
                <section>
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-4 px-1">Appearance</h3>
                  <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-1.5 rounded-[24px] border border-white/20 dark:border-white/10 flex gap-1 shadow-sm">
                    <button
                      onClick={() => onUpdateSettings({ theme: 'light' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] transition-all ${
                        userProfile.settings.theme === 'light' 
                          ? 'bg-white dark:bg-white/20 shadow-sm text-blue-600 dark:text-blue-400' 
                          : 'text-zinc-500 hover:bg-white/10'
                      }`}
                    >
                      <Sun size={18} />
                      <span className="font-bold text-sm">Light</span>
                    </button>
                    <button
                      onClick={() => onUpdateSettings({ theme: 'dark' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] transition-all ${
                        userProfile.settings.theme === 'dark' 
                          ? 'bg-white dark:bg-white/20 shadow-sm text-blue-600 dark:text-blue-400' 
                          : 'text-zinc-500 hover:bg-white/10'
                      }`}
                    >
                      <Moon size={18} />
                      <span className="font-bold text-sm">Dark</span>
                    </button>
                  </div>
                </section>

                {/* Daily Goal */}
                <section>
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-4 px-1">Daily Goal</h3>
                  <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 rounded-[32px] border border-white/20 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Target size={20} />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-zinc-900 dark:text-zinc-100">Focus Hours</span>
                          <span className="block text-[10px] text-zinc-500 dark:text-zinc-400">Daily target</span>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{userProfile.dailyGoal}h</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={userProfile.dailyGoal}
                        onChange={(e) => onUpdateProfile({ dailyGoal: parseInt(e.target.value) })}
                        className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </section>

                {/* Preferences */}
                <section>
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-4 px-1">Preferences</h3>
                  <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-[32px] border border-white/20 dark:border-white/10 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                          <Clock size={20} />
                        </div>
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Auto-start Breaks</span>
                      </div>
                      <button
                        onClick={() => onUpdateSettings({ autoStart: !userProfile.settings.autoStart })}
                        className={`w-12 h-7 rounded-full relative transition-all duration-300 ${userProfile.settings.autoStart ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${userProfile.settings.autoStart ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="h-px bg-white/10 dark:bg-white/5 mx-5" />

                    <div className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Smartphone size={20} />
                        </div>
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Vibration Feedback</span>
                      </div>
                      <button
                        onClick={() => onUpdateSettings({ vibration: !userProfile.settings.vibration })}
                        className={`w-12 h-7 rounded-full relative transition-all duration-300 ${userProfile.settings.vibration ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md ${userProfile.settings.vibration ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Account */}
                <section className="pb-8">
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-4 px-1">Account</h3>
                  <div className="flex items-center gap-4 p-5 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-[32px] border border-white/20 dark:border-white/10 shadow-sm">
                    <div className="relative">
                      <img src={userProfile.photoURL} alt="" className="w-14 h-14 rounded-full border-2 border-white/20 dark:border-white/10 shadow-md object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-sm" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{userProfile.displayName}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{userProfile.email}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
