import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Lock, Shield, Cpu, Terminal, Zap } from 'lucide-react';

export function Portal({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('');
  const [hintActive, setHintActive] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === '137222') {
      onUnlock();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput('');
    }
  };

  return (
    <div className="h-full w-full bg-[#020202] flex items-center justify-center relative overflow-hidden">
      {/* Background Nebula Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Easter Egg: Hidden corner buttons */}
      <div 
        className="absolute top-4 left-4 w-12 h-12 cursor-default group"
        onClick={() => console.log("HIDDEN_ID: 137451921129154222")}
      >
        <div className="w-1 h-1 bg-white/5 group-hover:bg-cyan-500 transition-colors" />
      </div>

      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="relative z-10 flex flex-col items-center gap-12"
      >
        <div className="relative">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity }
            }}
            className="w-48 h-48 rounded-full border-2 border-white/5 flex items-center justify-center"
          >
            <div className="w-40 h-48 rounded-full border-2 border-dashed border-cyan-500/20" />
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)] border border-white/20">
                <Box className="w-12 h-12 text-white -rotate-45" />
             </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-[0.3em]">Magic Box OS</h1>
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">System Boot: Awaiting Signature</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT_SEQUENCE"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-mono text-white text-center tracking-[0.5em] focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 rounded-xl transition-all uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Initialize_Core
            </button>
          </form>

          <button 
            onClick={() => setHintActive(!hintActive)}
            className="text-[8px] font-mono text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
          >
            {hintActive ? "0137222_RESONANCE_DETECTED" : "Get_Hint.sys"}
          </button>
        </div>
      </motion.div>

      {/* Decorative Accents */}
      <div className="absolute bottom-12 left-12 flex gap-4 text-white/10">
         <Cpu className="w-8 h-8" />
         <Terminal className="w-8 h-8" />
         <Zap className="w-8 h-8" />
      </div>
      
      <div className="absolute top-12 right-12 text-[10px] font-mono text-white/5 uppercase flex flex-col items-end">
         <span>Build_ID: NEXUS_FINANIMUS</span>
         <span>Kernel: SOVEREIGN_V1.0</span>
      </div>
    </div>
  );
}
