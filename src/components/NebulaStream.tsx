import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Activity } from 'lucide-react';

export function NebulaStream() {
  const [currentBuffer, setCurrentBuffer] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    const handleBuffer = (e: any) => {
      setCurrentBuffer(e.detail.buffer);
      setIsActive(true);
      setFrameCount(prev => prev + 1);
    };

    window.addEventListener('nexus-nebula-buffer', handleBuffer);
    return () => window.removeEventListener('nexus-nebula-buffer', handleBuffer);
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div 
          key={frameCount}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-full flex items-center justify-center p-12"
        >
          {/* Main Graphical Frame from Spine WebSocket */}
          <div className="relative w-full h-full max-w-4xl max-h-[70vh] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-black/40">
             <img 
               src={`data:image/png;base64,${currentBuffer}`} 
               alt="Nebula Data Stream" 
               className="w-full h-full object-contain mix-blend-screen"
               referrerPolicy="no-referrer"
             />
             
             {/* HUD Overlays for the Stream */}
             <div className="absolute top-4 left-4 flex flex-col gap-1">
               <div className="flex items-center gap-2">
                 <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                 <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live_Spine_Render</span>
               </div>
               <span className="text-[8px] font-mono text-white/40 uppercase">Frame: {frameCount.toLocaleString()}</span>
             </div>

             <div className="absolute bottom-4 right-4 text-right">
               <span className="text-[8px] font-mono text-cyan-400/60 uppercase italic tracking-tighter">AE-M4_Synapse_Sync</span>
             </div>
             
             {/* Scanning line effect */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
               <motion.div 
                 animate={{ y: ['-100%', '100%'] }} 
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_10px_white]"
               />
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-3">
         <Layers className="w-4 h-4 text-purple-400" />
         <span className="text-[10px] font-mono text-purple-400/80 uppercase tracking-[0.5em] italic animate-pulse">Nebula Graphic Layer Active</span>
      </div>
    </div>
  );
}
