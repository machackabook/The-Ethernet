import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Cpu, Save, Key, Layers, Zap, Info, ChevronRight, CheckCircle2, AlertCircle, Search, Filter, Trash2, Edit3, Plus, Code2, Shield, Eye, Activity as ActivityIcon, Globe } from 'lucide-react';
import { AIModelTier } from '../services/aiService';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'configuring' | 'deprecated';
  tier: AIModelTier;
  version: string;
}

export function ModelIntegrationHub() {
  const [activeModelId, setActiveModelId] = useState('nexus-pro-7');
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const [models] = useState<AIModel[]>([
    { 
      id: 'nexus-pro-7', 
      name: 'Nexus_Pro_v7', 
      provider: 'DeepMind_Kernel', 
      description: 'The primary synaptic powerhouse. 1Million+ context window with multiversal grounding.',
      capabilities: ['Code_Gen', 'System_Orchestration', 'Multimodal_Ingestion'],
      status: 'active',
      tier: AIModelTier.PRO,
      version: '7.3.1-STABLE'
    },
    { 
      id: 'nexus-flash-4', 
      name: 'Nexus_Flash_v4', 
      provider: 'DeepMind_Kernel', 
      description: 'Low-latency, high-frequency inference engine for real-time telemetry spikes.',
      capabilities: ['Stream_Analysis', 'Chat_Reflex', 'Draft_Recovery'],
      status: 'active',
      tier: AIModelTier.FLASH,
      version: '4.0.0-LIGHTSPEED'
    },
    { 
      id: 'deepmind-nebula-alpha', 
      name: 'Nebula_Alpha', 
      provider: 'DeepMind_OpenSource', 
      description: 'Experimental graphical rendering model using decentralized compute layers.',
      capabilities: ['Fractal_Rendering', 'Visual_Synthesis'],
      status: 'configuring',
      tier: AIModelTier.PRO,
      version: '0.9.2-EXP'
    },
  ]);

  const activeModel = models.find(m => m.id === activeModelId);

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white p-6 overflow-y-auto scrollbar-hide flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-cyan-400">Model_Integration_Hub</h1>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mt-1">Cross-Kernel AI Orchestration Layer</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono uppercase transition-all">
            <Plus className="w-3 h-3" /> Register_Model
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Model List */}
        <div className="xl:col-span-4 flex flex-col gap-4">
           <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search Models..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[11px] font-mono focus:outline-none focus:border-cyan-400/50 uppercase"
              />
           </div>
           
           <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide">
              {models.map(model => (
                <button 
                  key={model.id}
                  onClick={() => setActiveModelId(model.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${activeModelId === model.id ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-lg ${activeModelId === model.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'}`}>
                      <Cpu className="w-4 h-4" />
                    </div>
                    {model.status === 'active' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-500 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">{model.name}</h4>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">{model.provider}</span>
                    <span className="text-[8px] font-mono text-cyan-400/60 font-bold">{model.version}</span>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Configuration Panel */}
        <div className="xl:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeModelId}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex flex-col h-full"
             >
               {/* Details Header */}
               <div className="p-8 border-b border-white/5 bg-black/40">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-cyan-500/10 rounded-3xl border-2 border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                          <Box className="w-8 h-8 text-cyan-400 animate-pulse" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{activeModel?.name}</h2>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-[10px] font-mono text-white/40 tracking-[0.2em]">{activeModel?.provider}</span>
                             <span className="h-1 w-1 bg-white/20 rounded-full" />
                             <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">STABLE_REL_PRIMARY</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-all text-white/40 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-rose-500/20 rounded-lg border border-white/5 transition-all text-white/40 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed max-w-2xl font-mono uppercase italic">
                    {activeModel?.description}
                  </p>
               </div>

               {/* Config Body */}
               <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 flex items-center gap-2">
                           <Layers className="w-3 h-3 text-cyan-400" /> Capabilities_Inventory
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                           {activeModel?.capabilities.map(cap => {
                             const getIcon = (name: string) => {
                               if (name.includes('Code')) return <Code2 className="w-3 h-3 text-emerald-400" />;
                               if (name.includes('System')) return <Shield className="w-3 h-3 text-cyan-400" />;
                               if (name.includes('Multimodal')) return <Eye className="w-3 h-3 text-purple-400" />;
                               if (name.includes('Stream')) return <ActivityIcon className="w-3 h-3 text-amber-400" />;
                               if (name.includes('Visual')) return <Zap className="w-3 h-3 text-fuchsia-400" />;
                               if (name.includes('Fractal')) return <Globe className="w-3 h-3 text-sky-400" />;
                               return <Box className="w-3 h-3 text-white/40" />;
                             };

                             return (
                               <div key={cap} className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                                 <div className="p-1.5 bg-black/40 rounded-lg group-hover:scale-110 transition-transform">
                                   {getIcon(cap)}
                                 </div>
                                 <span className="text-[9px] font-mono text-white/80 uppercase tracking-tighter">
                                   {cap.replace(/_/g, ' ')}
                                 </span>
                               </div>
                             );
                           })}
                        </div>
                     </div>
                     <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 flex items-center gap-2">
                           <Key className="w-3 h-3 text-amber-500" /> Authentication_Shield
                        </h5>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex justify-between items-center group">
                              <span className="text-[10px] font-mono text-white/30 truncate max-w-[150px]">
                                {apiKey ? '••••••••••••••••' : 'UNREGISTERED_ENTRY_KEY'}
                              </span>
                              <button 
                                onClick={() => setShowKeyDialog(true)}
                                className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest border border-cyan-400/30 px-2 py-1 rounded hover:bg-cyan-400 hover:text-black transition-all"
                              >
                                {apiKey ? 'Modify' : 'Provision'}
                              </button>
                           </div>
                           <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${apiKey ? 'border-emerald-500 text-emerald-400' : 'border-rose-500/30 text-rose-500'}`}>
                              <Zap className="w-5 h-5" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-purple-400" /> Performance_Presets
                     </h5>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                        {[
                          { label: 'Temp', value: '1.2 (Balanced)', desc: 'Synaptic randomness' },
                          { label: 'Token_Max', value: '32k', desc: 'Inference boundary' },
                          { label: 'Safety', value: 'Minimal', desc: 'Experimental mode' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-purple-400/30 transition-all cursor-pointer">
                             <div className="text-[8px] text-white/30 uppercase mb-1">{stat.label}</div>
                             <div className="text-xs font-bold text-white mb-1 uppercase tracking-tighter">{stat.value}</div>
                             <div className="text-[7px] text-white/20 uppercase italic tracking-widest">{stat.desc}</div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Footer Actions */}
               <div className="p-8 border-t border-white/5 bg-black/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <Info className="w-4 h-4 text-cyan-400/40" />
                     <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Changes affect active session only</span>
                  </div>
                  <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-3 group">
                    Commit_Integration <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
             </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Key Dialog */}
      <AnimatePresence>
        {showKeyDialog && (
          <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_100px_rgba(245,158,11,0.2)]"
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <Key className="w-8 h-8 text-amber-500" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Credential_Sync</h3>
                    <p className="text-[10px] font-mono text-amber-500/60 uppercase">Inject API Handshake Module</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                <div>
                   <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-2">Secret_Kernel_Key</label>
                   <input 
                     type="password" 
                     placeholder="sk-nexus-••••••••••••••••"
                     value={apiKey}
                     onChange={(e) => setApiKey(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-amber-500/50"
                   />
                </div>
                
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                   <p className="text-[8px] font-mono text-amber-500/60 leading-relaxed uppercase italic">
                     Caution: Credentials are stored in the local synaptic vault (localStorage). For multi-user environments, utilize permanent environment variables via the Command Center.
                   </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowKeyDialog(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all">Cancel</button>
                  <button 
                    onClick={() => {
                        // Logic to save key
                        setShowKeyDialog(false);
                    }}
                    className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Integrate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
