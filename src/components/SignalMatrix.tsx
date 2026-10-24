import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Zap, Activity, Shield, BoxSelect } from 'lucide-react';

interface SignalMatrixProps {
  isListening: boolean;
  transcript: string;
}

export function SignalMatrix({ isListening, transcript }: SignalMatrixProps) {
  const [resonance, setResonance] = useState(0);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setResonance(Math.random());
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-12 pointer-events-none"
        >
          {/* Scanning Matrix Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)]" />
            <div className="grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] w-full h-full">
              {Array.from({ length: 1600 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/5" />
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-12 max-w-2xl text-center">
            <div className="relative">
               <motion.div 
                 animate={{ 
                   scale: [1, 1.2, 1],
                   opacity: [0.3, 0.6, 0.3]
                 }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-cyan-500 rounded-full blur-[60px]"
               />
               <div className="w-48 h-48 rounded-full border-2 border-cyan-500/30 flex items-center justify-center relative">
                  <div className="absolute inset-2 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-4 border border-cyan-500/10 rounded-full animate-[spin_15s_linear_reverse_infinite]" />
                  <Mic className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
               </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">ALL_KNOWN_UNKNOWN_INPUT</h2>
              <div className="flex items-center justify-center gap-6">
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Signal_Resonance: {Math.round(resonance * 100)}%
                 </div>
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    <Activity className="w-3 h-3" /> Bio_Link: ACTIVE
                 </div>
              </div>
            </div>

            <motion.div 
              key={transcript}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="min-h-[120px] p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl w-full"
            >
               <p className="text-xl font-mono text-white/80 leading-relaxed uppercase italic">
                 {transcript || "Awaiting neural oscillation..."}
                 <span className="inline-block w-2 h-6 bg-cyan-500 ml-2 animate-pulse" />
               </p>
            </motion.div>

            <div className="flex gap-4">
               <div className="flex flex-col items-center gap-1">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">GHOST_SHIELD</span>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex flex-col items-center gap-1">
                  <BoxSelect className="w-4 h-4 text-cyan-500" />
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">MATRIX_CAPTURE</span>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
