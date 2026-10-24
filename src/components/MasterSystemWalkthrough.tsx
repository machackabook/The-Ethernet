import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, Shield, Terminal, Sparkles, Box } from 'lucide-react';
import { aiService } from '../services/aiService';

interface WalkthroughStep {
  id: number;
  title: string;
  description: string;
  target: string;
  vocalNarration: string;
}

const STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: 'NEURAL_OS_BOOT',
    description: 'Initializing Sovereign Singularity Protocol. You are now the Architect of this Nexus.',
    target: 'header',
    vocalNarration: 'System online. Architect Azazel identified. Neural link established at 98 percent stability.'
  },
  {
    id: 2,
    title: 'CATALYST_POINT',
    description: 'All intelligence flows through the Nexus Point LLM (Gemini 1.5 Flash). Glic integration confirmed.',
    target: 'browser',
    vocalNarration: 'The neXus point is active. Integrating Gemini Embeddings 001 for vector memory.'
  },
  {
    id: 3,
    title: 'ORCHESTRATOR_GRID',
    description: 'Use the Command Center to bridge between Metaverse reality and Ethereal data layers.',
    target: 'command-center',
    vocalNarration: 'Planetary ethernet v53.4 is ready for deployment across all sectors.'
  }
];

export function MasterSystemWalkthrough({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(() => !localStorage.getItem('walkthrough_complete'));
  const [currentStep, setCurrentStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Trigger vocal narration for the first step
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('nexus-vocal-narrative', { 
          detail: { text: STEPS[0].vocalNarration, voice: 'Cortana' } 
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      window.dispatchEvent(new CustomEvent('nexus-vocal-narrative', { 
        detail: { text: STEPS[nextStep].vocalNarration, voice: 'Cortana' } 
      }));
    } else {
      setIsActive(false);
      localStorage.setItem('walkthrough_complete', 'true');
      window.dispatchEvent(new CustomEvent('nexus-vocal-narrative', { 
        detail: { text: 'Walkthrough complete. The Animus Void is yours, Architect.', voice: 'Cortana' } 
      }));
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Wrapper logic: Everything inside is the App */}
      {children}

      {/* Master Walkthrough Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] animate-pulse" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-xl w-full glass-card bg-black border border-cyan-500/30 rounded-3xl p-10 overflow-hidden relative shadow-[0_0_100px_rgba(6,182,212,0.2)]"
            >
              {/* Catalyst Background Pattern */}
              <div className="absolute -top-24 -right-24 opacity-5 pointer-events-none">
                <Box className="w-96 h-96 text-cyan-500 rotate-12" />
              </div>

              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black font-display text-white italic tracking-widest uppercase leading-none">Walkthrough_Mode</span>
                      <span className="text-[8px] font-mono text-cyan-400 opacity-50 uppercase mt-1">Catalyst_Wrapper_v1.0</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {STEPS.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-cyan-400' : 'w-2 bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">
                    {STEPS[currentStep].title}
                  </h2>
                  <p className="text-xl text-white/60 leading-relaxed font-light">
                    {STEPS[currentStep].description}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <button 
                    onClick={handleNext}
                    className="flex-1 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02]"
                  >
                    {currentStep === STEPS.length - 1 ? 'Enter_The_Void' : 'Next_Phase'}
                  </button>
                  <button 
                    onClick={() => {
                        setIsActive(false);
                        localStorage.setItem('walkthrough_complete', 'true');
                    }}
                    className="px-6 py-4 border border-white/10 text-white/40 hover:text-white rounded-2xl text-[10px] uppercase font-mono transition-all"
                  >
                    Skip
                  </button>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-tighter">GEMINI_1.5_PRO_ORCHESTRATOR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-500/40" />
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter italic">monitoring resonance levels...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
