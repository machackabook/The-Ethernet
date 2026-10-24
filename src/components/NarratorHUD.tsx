import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, SkipForward, Info, Sparkles, MessageSquare, Bot } from 'lucide-react';
import { useSpeech } from '../services/speechService';

interface NarratorHUDProps {
  lastUpdateText?: string;
  autoAnnounce?: boolean;
}

export function NarratorHUD({ lastUpdateText, autoAnnounce = false }: NarratorHUDProps) {
  const { speak, stop, isSpeaking } = useSpeech();
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoAnnounce && lastUpdateText && !hasAnnounced) {
      // Small delay to ensure voices are loaded and UI is ready
      const timer = setTimeout(() => {
        speak(lastUpdateText);
        setHasAnnounced(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastUpdateText, autoAnnounce, hasAnnounced, speak]);

  if (!lastUpdateText) return null;

  return (
    <div className="fixed bottom-12 left-12 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[30px] p-6 shadow-2xl max-w-sm"
          >
            <div className="flex items-center gap-3 mb-3">
               <div className={`p-2 rounded-xl ${isSpeaking ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-white/5 text-white/40'}`}>
                  <Bot className="w-4 h-4" />
               </div>
               <div className="flex-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Atlas_Narrator_v1.0</div>
                  <div className="text-[9px] font-mono uppercase text-rose-400 italic">Synthetic Voice Synthesis</div>
               </div>
               <button 
                onClick={() => setIsVisible(false)}
                className="text-white/20 hover:text-white transition-colors"
               >
                 <VolumeX className="w-3 h-3" />
               </button>
            </div>

            <p className="text-[10px] text-white/70 leading-relaxed font-medium mb-4 line-clamp-3 italic">
              "{lastUpdateText}"
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => speak(lastUpdateText)}
                disabled={isSpeaking}
                className={`flex-1 py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isSpeaking ? 'bg-rose-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isSpeaking ? (
                  <>
                    <Sparkles className="w-3 h-3 animate-spin" /> Speaking...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" /> Reread_Update
                  </>
                )}
              </button>
              <button 
                onClick={() => stop()}
                className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <VolumeX className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsVisible(true)}
          className="w-12 h-12 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 transition-all shadow-xl"
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
