import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, Home, Map, Tv, Smartphone, Cpu, Mic, Volume2, User, Zap, ChevronRight, Activity, Bell } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'home' | 'visual' | 'mobile' | 'maps';
  status: 'online' | 'offline' | 'learning';
  aiWeight: number; // 1-100 indicating AI dominance in decision making
  lastDecision: string;
}

export function SmartSyncSuite() {
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [proximityStatus, setProximityStatus] = useState(0.85); // 0 to 1
  const [aiAnalysis, setAiAnalysis] = useState("Adaptive learning kernel processing user habit patterns...");
  const [devices, setDevices] = useState<Device[]>([
    { id: 'dev-1', name: 'Google_Home_Nexus', type: 'home', status: 'online', aiWeight: 94, lastDecision: 'Optimized energy flow for evening profile.' },
    { id: 'dev-2', name: 'Apple_Link_15', type: 'mobile', status: 'online', aiWeight: 88, lastDecision: 'Prioritized relevant deep-link notifications.' },
    { id: 'dev-3', name: 'Roku_Stream_Matrix', type: 'visual', status: 'learning', aiWeight: 72, lastDecision: 'Predicting content preference based on mood delta.' },
    { id: 'dev-4', name: 'Map_Navigation_Core', type: 'maps', status: 'online', aiWeight: 98, lastDecision: 'Rerouting based on predictive congestion models.' },
  ]);

  useEffect(() => {
    // Simulate AI learning activity
    const interval = setInterval(() => {
      const messages = [
        "Analyzing voice structure frequency variance...",
        "Updating permanent memory strata for profile Architect Azazel...",
        "Refining proximity awareness threshold (current: 0.85m)...",
        "Correlating big data environmental sensors with user comfort metrics...",
      ];
      setAiAnalysis(messages[Math.floor(Math.random() * messages.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Device['type']) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'visual': return <Tv className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'maps': return <Map className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      {/* 1. LAYER CONTROL HEADER */}
      <header className="h-24 border-b border-white/5 flex items-center px-12 justify-between bg-black/40 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-8">
           <div className="relative">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-[20px] flex items-center justify-center">
                 <Cpu className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#050505] animate-pulse" />
           </div>
           <div className="flex flex-col">
              <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-black italic tracking-tighter uppercase">Smart_Sync_Suite</h1>
                 <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[8px] font-black text-cyan-400 uppercase">1:1 AI_RATIO_ACTIVE</span>
              </div>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">Weighted_Device_Governance_Matrix // V4.2</span>
           </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-white/40 uppercase">Proximity_Awareness</span>
                 <span className="text-sm font-mono text-cyan-400">{(proximityStatus * 100).toFixed(1)}%</span>
              </div>
              <div className="w-32 h-1 bg-white/5 mt-1 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: `${proximityStatus * 100}%` }}
                   className="h-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
                 />
              </div>
           </div>
           <button className="p-4 bg-white/5 border border-white/10 rounded-2xl relative">
              <Bell className="w-5 h-5 text-white/60" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]" />
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 2. DEVICE LISTING PANEL */}
        <div className="w-[480px] border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-10 overflow-y-auto custom-scrollbar">
           <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10">Synced_Infrastructures</div>
           
           <div className="flex flex-col gap-4">
              {devices.map((device) => (
                <button 
                  key={device.id}
                  onClick={() => setActiveDevice(device)}
                  className={`p-6 border rounded-[32px] flex items-center justify-between transition-all group ${
                    activeDevice?.id === device.id ? 'bg-cyan-500 border-cyan-500 text-black shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl transition-all ${activeDevice?.id === device.id ? 'bg-black/20 text-black' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                      {getIcon(device.type)}
                    </div>
                    <div className="flex flex-col items-start">
                       <span className={`text-sm font-black uppercase tracking-tight ${activeDevice?.id === device.id ? 'text-black' : 'text-white/80'}`}>{device.name}</span>
                       <span className={`text-[9px] font-mono uppercase font-medium ${activeDevice?.id === device.id ? 'text-black/60' : 'text-white/20'}`}>{device.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className={`text-[8px] font-black uppercase ${activeDevice?.id === device.id ? 'text-black/40' : 'text-white/20'}`}>AI_Weight</span>
                     <span className={`text-base font-mono font-black ${activeDevice?.id === device.id ? 'text-black' : 'text-cyan-400'}`}>{device.aiWeight}%</span>
                  </div>
                </button>
              ))}
           </div>

           <div className="mt-auto pt-10 border-t border-white/5">
              <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Permanent_Memory_Scribe</span>
                 </div>
                 <p className="text-[11px] text-white/40 leading-relaxed font-mono italic">
                   "{aiAnalysis}"
                 </p>
                 <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 font-black uppercase text-[8px] text-white/20">
                       <User className="w-3 h-3" />
                       Anchor: Architect_Azazel
                    </div>
                    <div className="text-[8px] font-mono text-cyan-400">SYNCED_00:01:22</div>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. AI INTERACTION & SETTINGS */}
        <div className="flex-1 p-16 flex flex-col gap-12 overflow-y-auto custom-scrollbar">
           <AnimatePresence mode="wait">
              {activeDevice ? (
                <motion.div
                  key={activeDevice.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-12"
                >
                  <div className="flex items-start justify-between">
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full w-fit">
                           {getIcon(activeDevice.type)}
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{activeDevice.type}_Bridge_Control</span>
                        </div>
                        <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">{activeDevice.name}</h2>
                     </div>
                     <button className="p-8 bg-rose-500/10 border-2 border-rose-500 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                        <Power className="w-10 h-10" />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[48px] flex flex-col gap-8 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Activity className="w-40 h-40 text-cyan-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Governance_Logic_Override</span>
                           <span className="text-2xl font-black uppercase text-white/80">AI_Decision_Autonomy</span>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-mono text-white/40">Model_Confidence</span>
                              <span className="text-3xl font-mono font-black text-cyan-400">{activeDevice.aiWeight}%</span>
                           </div>
                           <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${activeDevice.aiWeight}%` }}
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                              />
                           </div>
                        </div>
                        <p className="text-[11px] text-white/40 font-mono italic leading-loose">
                           AI Reasoning: "{activeDevice.lastDecision}"
                        </p>
                     </div>

                     <div className="grid grid-rows-2 gap-8">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-cyan-400 transition-colors">
                                 <Volume2 className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black uppercase tracking-tight">Voice_Synthesis</span>
                                 <span className="text-[9px] font-mono text-white/20 uppercase">Cortana_Frequency_V4</span>
                              </div>
                           </div>
                           <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white" />
                        </div>
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-emerald-400 transition-colors">
                                 <Zap className="w-6 h-6" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black uppercase tracking-tight">Adaptive_Learning</span>
                                 <span className="text-[9px] font-mono text-white/20 uppercase">Habitual_Logic_Enabled</span>
                              </div>
                           </div>
                           <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white" />
                        </div>
                     </div>
                  </div>

                  <div className="p-10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 rounded-[48px] flex flex-col gap-8">
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">External_Integration_Status</span>
                     <div className="flex gap-12">
                        {['Google_Home', 'Roku', 'AppleSDK', 'FireTV'].map((provider) => (
                           <div key={provider} className="flex flex-col items-center gap-3 group opacity-60 hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center transition-all group-hover:border-white/20">
                                 <Cpu className="w-7 h-7 text-white/40 group-hover:text-white" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{provider}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 opacity-30">
                  <div className="w-32 h-32 bg-white/5 border border-white/5 rounded-[48px] flex items-center justify-center">
                    <Activity className="w-12 h-12 text-white/40" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <p className="text-xl font-black uppercase text-white">No_Infrastructure_Linked</p>
                     <p className="text-[10px] font-mono max-w-[280px]">Select a governance device from the master listing node to engage AI-weighted control.</p>
                  </div>
                </div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
