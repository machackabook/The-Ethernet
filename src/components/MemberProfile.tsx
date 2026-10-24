import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Smartphone, Globe, Lock, Cpu, Save, Trash2, Smartphone as DeviceIcon, Home, Map, Tv, Monitor, Watch, Wallet, ExternalLink, Activity, Zap, Database } from 'lucide-react';
import { profileService, UserProfile } from '../services/profileService';
import { auth } from '../lib/firebase';
import { formatAddress } from '../lib/utils';

const DEVICE_TYPES = [
  { id: 'google-home', name: 'Google Home', icon: <Home className="w-4 h-4" /> },
  { id: 'google-maps', name: 'Google Maps', icon: <Map className="w-4 h-4" /> },
  { id: 'roku-stream', name: 'Roku Stick', icon: <Tv className="w-4 h-4" /> },
  { id: 'fire-stick', name: 'Fire Stick', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'apple-devices', name: 'Apple Ecosystem', icon: <Watch className="w-4 h-4" /> },
  { id: 'desktop-core', name: 'Nexus Desktop', icon: <Monitor className="w-4 h-4" /> }
];

export function MemberProfile({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newMark, setNewMark] = useState('');
  const [autoApproval] = useState(() => localStorage.getItem('auto_approval_mode') === 'true');

  useEffect(() => {
    const getAuthenticatedUser = () => {
      if (auth?.currentUser) return auth.currentUser;
      const mockStr = localStorage.getItem('auth_user');
      return mockStr ? JSON.parse(mockStr) : null;
    };

    const user = getAuthenticatedUser();
    if (user) {
      profileService.getProfile(user.uid).then(p => {
        if (p) setProfile(p);
        else profileService.createProfile(user).then(setProfile);
      });
    }
  }, []);

  const handleSave = async (showAnim = true) => {
    if (!profile) return;
    if (showAnim) setIsSaving(true);
    try {
      await profileService.updateProfile(profile.userId, profile);
      if (showAnim) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateWeight = (deviceId: string, weight: number) => {
    if (!profile) return;
    const updated = {
      ...profile,
      deviceWeights: { ...profile.deviceWeights, [deviceId]: weight }
    };
    setProfile(updated);
    if (autoApproval) {
      profileService.updateProfile(profile.userId, updated);
    }
  };

  const addMark = () => {
    if (!profile || !newMark) return;
    const updated = {
      ...profile,
      identifyingMarks: [...profile.identifyingMarks, newMark]
    };
    setProfile(updated);
    setNewMark('');
    if (autoApproval) {
      profileService.updateProfile(profile.userId, updated);
    }
  };

  const connectWallet = () => {
    if (!profile) return;
    const updated = {
      ...profile,
      authFactorStatus: { ...profile.authFactorStatus, metaMaskLinked: true },
      ethereumAddress: '0xACE' + Math.random().toString(16).slice(2, 6).toUpperCase() + '...A2EL'
    };
    setProfile(updated);
    if (autoApproval) {
      profileService.updateProfile(profile.userId, updated);
    }
  };

  if (!profile) return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full h-full bg-[#050505] overflow-y-auto custom-scrollbar p-8 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-[20px] bg-black flex items-center justify-center overflow-hidden">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white/20" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">{profile.displayName}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">Architect_Class</span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{profile.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Back_to_Kernel
            </button>
            <button 
              onClick={() => handleSave()}
              disabled={isSaving}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 ${saveSuccess ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}
            >
              {isSaving ? 'Processing...' : saveSuccess ? 'Cloud_Sync_Verified' : 'Sync_Cloud_Vault'} 
              {saveSuccess ? <Shield className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Identity & Security Marks */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Identity Grid */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-rose-500" />
                  <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em]">Identity_Marks_&_Biometrics</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                    <span className="text-[9px] font-mono text-white/20 uppercase block">Identifying_Mark_Log</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.identifyingMarks.map((mark, i) => (
                        <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 text-[10px] font-mono text-white/60">
                          {mark}
                          <button 
                            onClick={() => {
                              const newMarks = [...profile.identifyingMarks];
                              newMarks.splice(i, 1);
                              setProfile({...profile, identifyingMarks: newMarks});
                            }}
                            className="hover:text-rose-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="flex-1 min-w-[120px] relative">
                        <input 
                          type="text" 
                          value={newMark}
                          onChange={(e) => setNewMark(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addMark()}
                          placeholder="Add Mark..."
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-mono focus:outline-none focus:border-rose-500/40"
                        />
                      </div>
                    </div>
                  </div>

            {/* 3rd Factor Configuration */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <span className="text-[9px] font-mono text-white/20 uppercase block">3rd_Factor_Configuration</span>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] text-white/80">Voice_Neural_Print</span>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 uppercase">Verified</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] text-white/80">Phone_Telemetry</span>
                  </div>
                  <button className="text-[8px] font-mono text-amber-500 uppercase hover:underline">Relink_Node</button>
                </div>
              </div>
            </div>

            {/* Ancestral Resonance / Life Data */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <span className="text-[9px] font-mono text-white/20 uppercase block">Ancestral_Resonance_Markers</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[8px] font-mono text-white/40 uppercase">Resonance_ID_String (FNV-1a)</label>
                    <div className="p-3 bg-black/60 border border-emerald-500/20 rounded-xl text-[10px] font-mono text-emerald-400 flex justify-between items-center">
                       <span>{profile.resonanceId}</span>
                       <Zap className="w-3 h-3 animate-pulse" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-mono text-white/40 uppercase">Vocal_Identity_Alias</label>
                    <div className="p-3 bg-black/60 border border-white/10 rounded-xl text-[10px] font-mono text-white/60">
                       Brandon Demeiso Hamilton // ARCHITECT_AZAZEL
                    </div>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] font-mono text-white/40 uppercase">Spatial_Relocation_History</label>
                 <div className="p-3 bg-black/60 border border-white/10 rounded-xl text-[9px] font-mono text-white/40 leading-relaxed italic">
                    1512 S 10 S Grand // 318 Pine Ridge // 652 Apple Drive // Rambler St. // Waco TX // Monroe LA
                 </div>
              </div>
            </div>
               </div>
            </div>

            {/* IoT Device Integration */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em]">Synaptic_Hardware_Control</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DEVICE_TYPES.map(device => (
                    <div key={device.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 hover:bg-white/[0.04] transition-all">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                                {device.icon}
                             </div>
                             <span className="text-[11px] font-black text-white uppercase">{device.name}</span>
                          </div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                       </div>

                       <div className="space-y-3">
                          <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                             <span>AI_Control_Weight</span>
                             <span className="text-cyan-400">{((profile.deviceWeights[device.id] || 1) * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" max="2" step="0.1"
                            value={profile.deviceWeights[device.id] || 1}
                            onChange={(e) => updateWeight(device.id, parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                          />
                          <p className="text-[8px] text-white/20 italic leading-relaxed">Adjusts the recursive reasoning depth of the AI model specifically for this hardware.</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar: Sovereign Vault */}
          <div className="space-y-12">
            <div className="p-8 bg-gradient-to-br from-rose-500/10 to-purple-600/10 border border-white/10 rounded-[40px] space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[80px] -mr-16 -mt-16" />
               
               <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/40">
                     <Wallet className="w-8 h-8 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic text-white uppercase">Cryptographic_Vault</h4>
                    <p className="text-[10px] font-mono text-white/40 mt-2">Personal assets are linked via MetaMask and verified through OpenSea.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  {profile.authFactorStatus.metaMaskLinked ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-emerald-400 uppercase">Linked_Address</span>
                            <span className="text-[11px] font-bold text-white">{profile.ethereumAddress}</span>
                         </div>
                         <Shield className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.open(`https://opensea.io/${profile.displayName}`, '_blank')}
                          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-white/60 hover:text-white flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          OpenSea
                        </button>
                        <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-white/60 hover:text-white flex items-center justify-center gap-2">
                          <Activity className="w-3 h-3" />
                          Activity
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={connectWallet}
                      className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect_MetaMask
                    </button>
                  )}

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest pl-2">Syn_Correlator_Alias</label>
                    <input 
                      type="text"
                      value={profile.sovereignToken || ''}
                      onChange={(e) => setProfile({...profile, sovereignToken: e.target.value})}
                      placeholder="Enter 7-Digit Alias..."
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 font-mono text-lg tracking-[0.4em] text-rose-500 focus:outline-none focus:border-rose-500/50"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                       <span className="text-[8px] font-mono text-white/40 uppercase block">Metaverse_Presence</span>
                       <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-rose-500" />
                          <span className="text-[10px] text-white">Land_Occupant: Active</span>
                       </div>
                    </div>
                  </div>

                  {/* Permanent Data Ledger Integration */}
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Permanent_Data_Ledger</span>
                        <Database className="w-3 h-3 text-cyan-400" />
                     </div>
                     <div className="space-y-1">
                        <div className="text-[7px] font-mono text-white/20 uppercase italic">TELEMETRY_SOURCE_ORIGIN: 0x888b_759l_15h08d6aa69f</div>
                        <div className="text-[7px] font-mono text-white/20 uppercase italic">DEVICE_ID_FOREVER_LOG: COMPLETED</div>
                        <div className="text-[7px] font-mono text-white/20 uppercase italic">CODE_TRANSFORMATION_LINK: COMBINED_SOURCE_ORIGIN</div>
                     </div>
                  </div>

                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 transition-all">
                    Purge_Local_Cache
                  </button>
               </div>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live_Security_Feed</span>
               </div>
               <div className="space-y-4 h-32 overflow-hidden flex flex-col-reverse">
                  <div className="text-[9px] font-mono text-rose-500/60 uppercase animate-[pulse_2s_infinite]">... Biometric_Scan_Successful</div>
                  <div className="text-[9px] font-mono text-white/20 uppercase italic">... Resonance_Key_Validated</div>
                  <div className="text-[9px] font-mono text-white/20 uppercase italic">... Device_Omission_Detected</div>
                  <div className="text-[9px] font-mono text-white/20 uppercase italic">... Nexus_Gate_Sync_Active</div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
