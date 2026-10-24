import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Zap, Hexagon, Sparkles, BrainCircuit, CheckCircle } from 'lucide-react';
import { profileService, UserProfile } from '../services/profileService';
import { auth } from '../lib/firebase';

export function AvatarCustomizer() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appearance, setAppearance] = useState('Nebula_Form');
  const [attire, setAttire] = useState('Cyber_Suit');
  const [learningRate, setLearningRate] = useState(0.85);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const getAuthenticatedUser = () => {
      if (auth?.currentUser) return auth.currentUser;
      const mockStr = localStorage.getItem('auth_user');
      return mockStr ? JSON.parse(mockStr) : null;
    };

    const user = getAuthenticatedUser();
    if (user) {
      profileService.getProfile(user.uid).then(p => {
        if (p) {
          setProfile(p);
          if (p.avatarAppearance) setAppearance(p.avatarAppearance);
          if (p.avatarAttire) setAttire(p.avatarAttire);
          if (p.avatarLearningRate) setLearningRate(p.avatarLearningRate);
        }
      });
    }
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        avatarAppearance: appearance,
        avatarAttire: attire,
        avatarLearningRate: learningRate,
      };
      await profileService.updateProfile(profile.userId, updatedProfile);
      setProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save avatar', err);
    } finally {
      setIsSaving(false);
    }
  };

  const appearances = ['Nebula_Form', 'Cyber_Construct', 'Hologram_Projection', 'Void_Walker'];
  const attires = ['Cyber_Suit', 'Nomad_Cloak', 'Tactical_Armor', 'Ethereal_Robes'];

  return (
    <div className="w-full h-full bg-white/[0.02] border border-neural-border rounded-[40px] p-12 overflow-hidden flex flex-col md:flex-row gap-12 pointer-events-auto shadow-2xl backdrop-blur-md">
      {/* 3D Visualization Placeholder */}
      <div className="flex-1 relative rounded-[30px] border border-white/10 overflow-hidden bg-black/40 group flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-neural-bg to-transparent opacity-60 z-10" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="relative w-64 h-64"
          >
            {/* Visual representation based on selections */}
            <div className="absolute inset-0 rounded-full border border-rose-500/30 blur-sm" />
            <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
            <User className="w-full h-full text-white/10" />
            
            {/* Core learning indicator */}
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
               transition={{ duration: 2 / learningRate, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-500 blur-xl"
            />
          </motion.div>
        </div>
        
        <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-center glass-card p-4 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active_Persona</span>
            <span className="text-sm font-black text-rose-500 uppercase tracking-widest">{appearance} // {attire}</span>
          </div>
          <Sparkles className="w-5 h-5 text-rose-500" />
        </div>
      </div>

      {/* Controls */}
      <div className="w-96 flex flex-col gap-8 shrink-0">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Hexagon className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Avatar_Matrix</h2>
           </div>
           <p className="text-[10px] font-mono text-white/30 uppercase leading-relaxed italic">
             Customize your 3D presence in the collective. The neural core adapts its interaction patterns based on the specified learning rate.
           </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Selection */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-white/50 tracking-widest">Core_Appearance</h3>
            <div className="grid grid-cols-2 gap-3">
              {appearances.map(app => (
                <button
                  key={app}
                  onClick={() => setAppearance(app)}
                  className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${appearance === app ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
                >
                  {app.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Attire Selection */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-white/50 tracking-widest">Attire_Configuration</h3>
            <div className="grid grid-cols-2 gap-3">
              {attires.map(att => (
                <button
                  key={att}
                  onClick={() => setAttire(att)}
                  className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${attire === att ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'}`}
                >
                  {att.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Rate Slider */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <BrainCircuit className="w-4 h-4 text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Adaptive_Learning</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">{Math.round(learningRate * 100)}%</span>
            </div>
            <input 
              type="range" min="0.1" max="1" step="0.05" 
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
            />
            <p className="text-[8px] font-mono text-white/20 mt-4 leading-relaxed uppercase italic">
              Higher rates increase avatar responsiveness and personality shift velocity based on daily interaction volume.
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving || !profile}
          className={`mt-auto w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 ${saveSuccess ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:bg-rose-500 hover:text-white'} disabled:opacity-50`}
        >
           {isSaving ? (
             <span className="animate-pulse">Synchronizing_Vault...</span>
           ) : saveSuccess ? (
             <>
               <CheckCircle className="w-4 h-4" /> Avatar_State_Synchronized
             </>
           ) : (
             <>
               <Zap className="w-4 h-4" /> Save_Avatar_State
             </>
           )}
        </button>
      </div>
    </div>
  );
}
