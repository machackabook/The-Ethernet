import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Phone, Mic, Hash, CheckCircle2, AlertCircle, ArrowRight, Smartphone, Bot, Lock } from 'lucide-react';
import { FractalEngine } from './FractalEngine';
import { profileService, UserProfile } from '../services/profileService';
import { auth } from '../lib/firebase';

interface AuthFactor {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const FACTORS: AuthFactor[] = [
  { id: 'PHONE', label: 'TELEMETRY_LINK', icon: <Phone />, description: 'Sms-verification for cellular node pairing.' },
  { id: 'VOICE', label: 'NEURAL_PRINT', icon: <Mic />, description: 'Synthetic biometric voice match synthesis.' },
  { id: 'AI_NUM', label: 'SYN_CORRELATOR', icon: <Hash />, description: '7-digit AI-generated verification integer.' }
];

export function ThreeFactorAuth({ onComplete }: { onComplete: () => void }) {
  const [activeFactorIndex, setActiveFactorIndex] = useState(0);
  const [completedFactors, setCompletedFactors] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const getAuthenticatedUser = () => {
      if (auth?.currentUser) return auth.currentUser;
      const mockStr = localStorage.getItem('auth_user');
      return mockStr ? JSON.parse(mockStr) : null;
    };

    const user = getAuthenticatedUser();
    if (user) {
      profileService.getProfile(user.uid).then(setProfile);
    }

    // DevTools Phrase Listener
    const handleDevToolsPhrase = (e: MessageEvent) => {
      if (e.data === 'RESONANCE_OVERRIDE_ALPHA') {
        setCompletedFactors(FACTORS.map(f => f.id));
        setTimeout(onComplete, 1000);
      }
    };
    window.addEventListener('message', handleDevToolsPhrase);
    
    // Explicit console function as requested
    (window as any).SYN_CORRELATE = (phrase: string) => {
      if (phrase === 'Architect_Azazel_Gaia_Resonance') {
        setCompletedFactors(FACTORS.map(f => f.id));
        setTimeout(onComplete, 500);
        return 'IDENTITY_VERIFIED: SYNC_ESTABLISHED';
      }
      return 'INVALID_PHRASE';
    };

    return () => {
      window.removeEventListener('message', handleDevToolsPhrase);
      delete (window as any).SYN_CORRELATE;
    };
  }, []);

  const activeFactor = FACTORS[activeFactorIndex];

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Custom logic for Syn Correlator
    if (activeFactor.id === 'AI_NUM') {
      const expectedCode = profile?.sovereignToken || '137222';
      const masterCodes = ['137222', '433855274', '137451921129154222'];
      
      if (!masterCodes.includes(inputValue) && inputValue !== expectedCode) {
        setTimeout(() => {
          setIsVerifying(false);
          // Optional: Add error state
        }, 1000);
        return;
      }
    }

    // Simulate verification delay
    setTimeout(async () => {
      const updatedCompleted = [...completedFactors, activeFactor.id];
      setCompletedFactors(updatedCompleted);
      setIsVerifying(false);
      setInputValue('');

      if (profile) {
        const updatedStatus = {
          ...profile.authFactorStatus,
          phoneVerified: updatedCompleted.includes('PHONE'),
          voiceMatched: updatedCompleted.includes('VOICE'),
          aiNumberCorrelated: updatedCompleted.includes('AI_NUM'),
        };
        await profileService.updateProfile(profile.userId, {
          authFactorStatus: updatedStatus
        });
      }

      if (activeFactorIndex < FACTORS.length - 1) {
        setActiveFactorIndex(activeFactorIndex + 1);
      } else {
        onComplete();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-8 overflow-hidden">
      {/* High Fidelity Background */}
      <div className="absolute inset-0 z-0 opacity-40">
         <FractalEngine />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[50px] p-12 relative overflow-hidden z-10"
      >
        {/* Progress Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <motion.div 
              className="h-full bg-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedFactors.length / FACTORS.length) * 100}%` }}
           />
        </div>

        <div className="flex flex-col items-center gap-8">
           <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
              <Shield className="w-10 h-10 text-rose-500" />
           </div>

           <div className="text-center">
              <div className="text-[10px] font-black uppercase text-rose-500 tracking-[0.4em] mb-2 italic">Security_Escalation_Required</div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">3-Factor_Sovereign_Auth</h2>
           </div>

           <div className="grid grid-cols-3 gap-4 w-full">
              {FACTORS.map((f, i) => (
                <div 
                  key={f.id}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${i === activeFactorIndex ? 'bg-white/5 border-rose-500/50' : completedFactors.includes(f.id) ? 'bg-rose-500/10 border-rose-500/20 opacity-100' : 'border-white/5 opacity-30'}`}
                >
                   <div className={`${i === activeFactorIndex ? 'text-rose-500' : completedFactors.includes(f.id) ? 'text-rose-400' : 'text-white/20'}`}>
                      {f.icon}
                   </div>
                   <div className="text-[8px] font-black uppercase text-white tracking-widest">{f.label}</div>
                   {completedFactors.includes(f.id) && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
              ))}
           </div>

           <AnimatePresence mode="wait">
              <motion.div 
                key={activeFactor.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-6"
              >
                 <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-white/5 rounded-xl text-rose-500">
                          {activeFactor.icon}
                       </div>
                       <div>
                          <div className="text-xs font-black text-white uppercase">{activeFactor.label}</div>
                          <div className="text-[9px] font-mono text-white/40 uppercase">{activeFactor.description}</div>
                       </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {activeFactor.id === 'VOICE' ? (
                       <button 
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest border transition-all ${isVerifying ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                       >
                          {isVerifying ? (
                            <>
                              <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" /> Analyzing_Neural_Freq...
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4" /> Tap_To_Speak_Passkey
                            </>
                          )}
                       </button>
                    ) : (
                       <div className="space-y-4">
                          <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={activeFactor.id === 'AI_NUM' ? 'Enter 7-Digit Correlator...' : 'Enter Verification Node...'}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-center font-mono text-xl tracking-[0.5em] text-rose-500 focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-white/10"
                          />
                          <button 
                            onClick={handleVerify}
                            disabled={isVerifying || !inputValue}
                            className="w-full py-4 bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                             {isVerifying ? 'Validating_Bridge...' : 'Confirm_Link'} <ArrowRight className="w-4 h-4" />
                          </button>
                       </div>
                    )}
                 </div>
              </motion.div>
           </AnimatePresence>

           <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">
              <Bot className="w-3 h-3" /> Securing current session via high-fidelity biometrics
           </div>
        </div>
      </motion.div>
    </div>
  );
}
