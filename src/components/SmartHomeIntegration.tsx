import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Map as MapIcon, Tv, Apple, Smartphone, Settings, Shield, Zap, Cpu, RefreshCw, Radio, Power, Volume2, Globe, Target, Layout, BrainCircuit, Bot, CheckCircle } from 'lucide-react';
import { profileService, UserProfile } from '../services/profileService';
import { auth } from '../lib/firebase';

interface SmartDevice {
  id: string;
  profileId: string; // ID used in profile.deviceWeights
  name: string;
  brand: 'GOOGLE' | 'APPLE' | 'AMAZON' | 'ROKU' | 'SYSTEM';
  status: 'ONLINE' | 'OFFLINE';
  type: 'HOME' | 'TV' | 'MOBILE' | 'AUTO';
  interactionWeight: number; // User-specific AI model weight
}

const INITIAL_DEVICES: SmartDevice[] = [
  { id: 'GH_01', profileId: 'google-home', name: 'Nexus_Home_Alpha', brand: 'GOOGLE', status: 'ONLINE', type: 'HOME', interactionWeight: 0.85 },
  { id: 'RK_44', profileId: 'roku-stream', name: 'Roku_Streamer_Pro', brand: 'ROKU', status: 'ONLINE', type: 'TV', interactionWeight: 0.12 },
  { id: 'HK_09', profileId: 'apple-devices', name: 'Apple_Hk_Core', brand: 'APPLE', status: 'OFFLINE', type: 'HOME', interactionWeight: 0.45 },
  { id: 'MAP_AI', profileId: 'google-maps', name: 'Global_Nav_Link', brand: 'SYSTEM', status: 'ONLINE', type: 'AUTO', interactionWeight: 0.98 },
  { id: 'FIRE_S1', profileId: 'fire-stick', name: 'Fire_Grid_Node', brand: 'AMAZON', status: 'ONLINE', type: 'TV', interactionWeight: 0.33 },
];

export function SmartHomeIntegration() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null);
  const [aiModelWeight, setAiModelWeight] = useState(0.75);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrateSuccess, setCalibrateSuccess] = useState(false);

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
          // Sync devices from profile weights
          const synced = INITIAL_DEVICES.map(dev => {
            const weight = p.deviceWeights?.[dev.profileId] ?? dev.interactionWeight;
            return {
              ...dev,
              interactionWeight: weight
            };
          });
          setDevices(synced);
        }
      });
    }
  }, []);

  const handleDeviceWeightChange = async (device: SmartDevice, newWeight: number) => {
    const updatedDevices = devices.map(d => 
      d.id === device.id ? { ...d, interactionWeight: newWeight } : d
    );
    setDevices(updatedDevices);
    if (selectedDevice?.id === device.id) {
      setSelectedDevice({ ...selectedDevice, interactionWeight: newWeight });
    }

    if (profile) {
      const updatedWeights = {
        ...profile.deviceWeights,
        [device.profileId]: newWeight
      };
      const updatedProfile = {
        ...profile,
        deviceWeights: updatedWeights
      };
      setProfile(updatedProfile);
      await profileService.updateProfile(profile.userId, {
        deviceWeights: updatedWeights
      });
    }
  };

  const handleCalibrateAll = async () => {
    setIsCalibrating(true);
    setCalibrateSuccess(false);
    
    // Simulate complex AI recalibration calculations
    setTimeout(async () => {
      setIsCalibrating(false);
      setCalibrateSuccess(true);
      setTimeout(() => setCalibrateSuccess(false), 2000);

      // Recalibrate every device weight based on the main aiModelWeight slider
      const calibratedDevices = devices.map(d => ({
        ...d,
        interactionWeight: parseFloat((d.interactionWeight * aiModelWeight * 1.2).toFixed(2))
      }));
      setDevices(calibratedDevices);

      if (profile) {
        const updatedWeights: Record<string, number> = {};
        calibratedDevices.forEach(d => {
          updatedWeights[d.profileId] = d.interactionWeight;
        });

        const updatedProfile = {
          ...profile,
          deviceWeights: updatedWeights
        };
        setProfile(updatedProfile);
        await profileService.updateProfile(profile.userId, {
          deviceWeights: updatedWeights
        });
      }
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-[#050508] text-white flex font-sans overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
      {/* Left Sidebar: AI Model weighting */}
      <div className="w-96 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-10 flex flex-col gap-12 z-10 shrink-0">
         <div>
            <div className="flex items-center gap-3 mb-3">
               <BrainCircuit className="w-6 h-6 text-rose-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Singularity_AI_Layer</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">Nexus_Model_Sync</h1>
         </div>

         <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[30px] p-8">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                     <Bot className="w-5 h-5 text-rose-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">Global_Influence</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-500">{Math.round(aiModelWeight * 100)}%</span>
               </div>
               <div className="space-y-6">
                  <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={aiModelWeight}
                    onChange={(e) => setAiModelWeight(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                  />
                  <p className="text-[9px] font-mono text-white/30 leading-relaxed uppercase italic">
                     Adjusting this weight recalibrates individual neural responses across all connected smart nodes.
                  </p>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[9px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2">
                  <Settings className="w-3 h-3" /> Integration_Protocols
               </h3>
               {[
                  { name: 'Google_Home_v3', status: 'ACTIVE', color: 'text-emerald-400' },
                  { name: 'Apple_HomeKit', status: 'STANDBY', color: 'text-amber-400' },
                  { name: 'Roku_OS_Sync', status: 'ACTIVE', color: 'text-emerald-400' },
                  { name: 'Fire_Stick_API', status: 'ERROR', color: 'text-rose-400' },
               ].map((proto, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                     <span className="text-[10px] font-black text-white/60 uppercase">{proto.name}</span>
                     <span className={`text-[8px] font-mono uppercase ${proto.color}`}>{proto.status}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="mt-auto">
            <button 
              onClick={handleCalibrateAll}
              disabled={isCalibrating}
              className={`w-full py-5 rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 ${calibrateSuccess ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:bg-rose-500 hover:text-white'}`}
            >
               {isCalibrating ? (
                 <span className="animate-pulse">Recalibrating...</span>
               ) : calibrateSuccess ? (
                 <>
                   <CheckCircle className="w-4 h-4" /> Nodes_Calibrated
                 </>
               ) : (
                 'Recalibrate_All_Nodes'
               )}
            </button>
         </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 p-12 overflow-y-auto scrollbar-hide">
         <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Active_Device_Matrix</h2>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live_Sync
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <AnimatePresence>
                  {devices.map(device => (
                     <motion.button
                        key={device.id}
                        layout
                        onClick={() => setSelectedDevice(device)}
                        className={`group relative h-64 bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-left transition-all hover:bg-white/[0.05] hover:border-white/20 overflow-hidden ${selectedDevice?.id === device.id ? 'ring-2 ring-rose-500 border-transparent shadow-[0_0_40px_rgba(244,63,94,0.1)]' : ''}`}
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
                           {device.brand === 'GOOGLE' && <Globe className="w-24 h-24" />}
                           {device.brand === 'APPLE' && <Apple className="w-24 h-24" />}
                           {device.brand === 'AMAZON' && <Smartphone className="w-24 h-24" />}
                           {device.brand === 'ROKU' && <Tv className="w-24 h-24" />}
                           {device.brand === 'SYSTEM' && <MapIcon className="w-24 h-24" />}
                        </div>

                        <div className="relative h-full flex flex-col">
                           <div className="flex justify-between items-start mb-6">
                              <div className={`p-3 rounded-2xl bg-white/5 ${device.status === 'ONLINE' ? 'text-emerald-400' : 'text-white/20'}`}>
                                 {device.type === 'HOME' && <Home className="w-6 h-6" />}
                                 {device.type === 'TV' && <Tv className="w-6 h-6" />}
                                 {device.type === 'MOBILE' && <Smartphone className="w-6 h-6" />}
                                 {device.type === 'AUTO' && <MapIcon className="w-6 h-6" />}
                              </div>
                              <div className={`text-[8px] font-mono uppercase tracking-widest italic ${device.status === 'ONLINE' ? 'text-emerald-500' : 'text-white/10'}`}>
                                 {device.status}
                              </div>
                           </div>
                           
                           <div className="mt-auto">
                              <div className="text-[10px] font-mono text-white/30 uppercase mb-1 tracking-widest">{device.brand}_Interface</div>
                              <h3 className="text-xl font-black italic tracking-tighter uppercase text-white mb-4 line-clamp-1">{device.name}</h3>
                              
                              <div className="flex items-center gap-4">
                                 <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                       style={{ width: `${Math.min(device.interactionWeight * 100, 100)}%` }}
                                       className="h-full bg-rose-500 transition-all duration-300"
                                    />
                                 </div>
                                 <div className="text-[8px] font-mono text-white/20 uppercase">Weight: {device.interactionWeight.toFixed(2)}</div>
                              </div>
                           </div>
                        </div>
                     </motion.button>
                  ))}
               </AnimatePresence>
            </div>

            {/* Selected Device Context Panel */}
            <AnimatePresence mode="wait">
               {selectedDevice ? (
                  <motion.div 
                     key={selectedDevice.id}
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 20 }}
                     className="bg-white/[0.03] border border-white/10 rounded-[50px] p-12 grid grid-cols-12 gap-12 shadow-2xl relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
                     
                     <div className="col-span-12 lg:col-span-5 space-y-8 relative">
                        <div>
                           <div className="flex items-center gap-3 mb-4">
                              <Target className="w-6 h-6 text-rose-500" />
                              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Active_Node_Context</span>
                           </div>
                           <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">{selectedDevice.name}</h2>
                           <p className="text-sm font-mono text-white/40 mt-4 leading-relaxed italic uppercase">
                              Deep integration across {selectedDevice.brand} ecosystem with user-weighted neural steering.
                           </p>
                        </div>

                        {/* Node-specific Weight Control */}
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                           <div className="flex justify-between items-center text-[9px] font-mono uppercase">
                              <span className="text-white/40">Adjust_Node_Weight</span>
                              <span className="text-rose-500 font-bold">{(selectedDevice.interactionWeight * 100).toFixed(0)}%</span>
                           </div>
                           <input 
                             type="range" min="0" max="2" step="0.05"
                             value={selectedDevice.interactionWeight}
                             onChange={(e) => handleDeviceWeightChange(selectedDevice, parseFloat(e.target.value))}
                             className="w-full accent-rose-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                           />
                        </div>

                        <div className="flex flex-wrap gap-4">
                           <button className="flex-1 py-4 bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                              <Power className="w-4 h-4" /> Power_Cycle
                           </button>
                           <button className="flex-1 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                              <Volume2 className="w-4 h-4" /> Volume_Control
                           </button>
                        </div>
                     </div>

                     <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6 relative">
                        {[
                           { label: 'Latency_Core', value: '4ms', icon: <Zap className="w-4 h-4 text-rose-400" /> },
                           { label: 'Security_Tier', value: 'ECC_V4', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
                           { label: 'AI_Steerage', value: selectedDevice.interactionWeight.toFixed(2), icon: <BrainCircuit className="w-4 h-4 text-cyan-400" /> },
                           { label: 'Sync_Hash', value: '0x88f2...e3', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
                        ].map((stat, i) => (
                           <div key={i} className="bg-black/40 border border-white/5 rounded-3xl p-6">
                              <div className="flex items-center gap-3 mb-3">
                                 {stat.icon}
                                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                              </div>
                              <div className="text-xl font-black text-white uppercase">{stat.value}</div>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center opacity-10 gap-4 border-2 border-dashed border-white/5 rounded-[40px]">
                     <Layout className="w-12 h-12" />
                     <div className="text-sm font-black uppercase tracking-widest">Select_Node_To_Drilldown</div>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
