import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, GitBranch, Share2, Box, Cpu, Zap, Activity, Shield, RefreshCw, Send, ArrowRight, MessageSquare, Code, Image as ImageIcon, Sparkles, Rocket, Terminal, Globe, Sword, Book, Package, ListTodo, Database, Info, Loader2 } from 'lucide-react';
import NebulaHighFidelityShader from './NebulaHighFidelityShader';
import { aiService } from '../services/aiService';

interface UnlockedUniverseState {
  activeWorldSeed: string;         
  hyperdriveWarpActive: boolean;   
  atmosphericScatterIntensity: number; 
  activeFactionsGrid: string[];   
  spatialCoordinates: { x: number; y: number; z: number }; 
  level: number;
  xp: number;
  classId: string | null;
  skills: {
    strength: number;
    logic: number;
    magic: number;
    engineering: number;
  };
  inventory: string[];
}

interface Task {
  id: string;
  type: 'COGNITIVE' | 'GENERATIVE' | 'ANALYTICAL';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED';
  label: string;
  module: string;
  progress: number;
}

// --- Skill Milestones Database ---
const SKILL_PERKS: Record<string, { name: string; level: number; perk: string }[]> = {
  strength: [
    { name: 'Titan Grip', level: 10, perk: 'Equip heavy mesh-fragments' },
    { name: 'World Crusher', level: 25, perk: '2x Structural damage' },
    { name: 'Galaxy Cleaver', level: 50, perk: 'Slice spacetime rift clusters' }
  ],
  logic: [
    { name: 'Neural Sync', level: 5, perk: '2x Processing Speed' },
    { name: 'Deep Trace', level: 20, perk: 'See hidden world seeds' },
    { name: 'Omni-Code', level: 40, perk: 'Direct matrix manipulation' }
  ],
  magic: [
    { name: 'Flora Ingress', level: 15, perk: 'Control sentient planets' },
    { name: 'Gravity Bend', level: 30, perk: 'Local gravity inversion' },
    { name: 'Reality Collapse', level: 60, perk: 'Spawn temporary black holes' }
  ],
  engineering: [
    { name: 'Nexus Forge', level: 10, perk: 'Build Advanced Hubs' },
    { name: 'Star-Lifter', level: 40, perk: 'Dyson sphere components unlocked' },
    { name: 'Void-Engine', level: 80, perk: 'FTL travel without fuel' }
  ]
};

export function CreativeOrchestrator({ onBack }: { onBack?: () => void }) {
  // --- Persistent State Logic ---
  const [universeState, setUniverseState] = useState<UnlockedUniverseState>(() => {
    const saved = localStorage.getItem('nexus_universe_state');
    return saved ? JSON.parse(saved) : {
      activeWorldSeed: 'NEXUS_ALPHA_001',
      hyperdriveWarpActive: false,
      atmosphericScatterIntensity: 0.35,
      activeFactionsGrid: ['TERRAN_NOVA', 'VOID_ZERG', 'PROTOSS_CORE'],
      spatialCoordinates: { x: 124.2, y: -88.1, z: 9.3 },
      level: 1,
      xp: 0,
      classId: null,
      skills: { strength: 1, logic: 1, magic: 1, engineering: 1 },
      inventory: ['STARK_NANOBOT_CORE', 'MJOLNIR_FRAGMENT']
    };
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexus_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 't1', type: 'COGNITIVE', status: 'COMPLETED', label: 'Draft_Ingestion', module: 'Nexus_Core', progress: 100 },
      { id: 't2', type: 'ANALYTICAL', status: 'PROCESSING', label: 'Semantic_Decomposition', module: 'DeepMind_V3', progress: 65 },
      { id: 't3', type: 'GENERATIVE', status: 'QUEUED', label: 'Code_Synthesis_L3', module: 'Nexus_Pro', progress: 0 },
    ];
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);

  const generateAITask = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingTask(true);
    setWorldGenerationLog(prev => [`[AI] Processing neural request: "${aiPrompt}"`, ...prev]);

    try {
      const response = await aiService.processRequest(
        `Analyze the following natural language task description and output a JSON object representing a task.
        Description: "${aiPrompt}"
        
        JSON keys:
        - label: A short, futuristic, technical name (e.g., "Neural_Mesh_Sync", "Voxel_Dilation")
        - type: One of "COGNITIVE", "GENERATIVE", "ANALYTICAL"
        - module: A futuristic software component name (e.g., "Nexus_Core", "Ethereal_Engine")
        - effort: A number 1-10
        - priority: One of "CRITICAL", "HIGH", "NORMAL"
        - dependencies: A comma-separated string of required modules or null
        
        Output ONLY the JSON object.`,
        "You are a task orchestrator for a futuristic Sovereign OS."
      );

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const taskData = JSON.parse(cleanJson);

      const newTask: Task = {
        id: `t-${Date.now()}`,
        label: taskData.label || 'Unknown_Matrix_Job',
        type: taskData.type || 'COGNITIVE',
        module: taskData.module || 'Generic_Nexus',
        status: 'QUEUED',
        progress: 0
      };

      setTasks(prev => [newTask, ...prev]);
      setAiPrompt('');
      setWorldGenerationLog(prev => [
        `[SYNC] AI-Task Generated: ${newTask.label}`,
        `[NODE] Metadata: Effort ${taskData.effort}, Priority ${taskData.priority}`,
        ...prev
      ]);
      grantXp(50, 'logic');
    } catch (error) {
      console.error('AI Task Gen error:', error);
      setWorldGenerationLog(prev => [`[ERR] Neural bridge failed. Manual override recommended.`, ...prev]);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('nexus_universe_state', JSON.stringify(universeState));
  }, [universeState]);

  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Character Classes Database ---
  const characterFactions = {
    HEAVEN: {
      name: "Cosmic Guardians (Surface/Olympus)",
      classes: [
        { id: 'ares', name: 'Ares_Mode', desc: 'God of War / Combat Specialist', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
        { id: 'thor', name: 'Thor_Mode', desc: 'Stormbringer / Electrical Node', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
        { id: 'spidey', name: 'Web_Sovereign', desc: 'Multiverse Crawler / Surface Prot', icon: <Globe className="w-4 h-4 text-rose-400" /> },
      ]
    },
    HELL: {
      name: "Angeldaemons (Void/Abyssal)",
      classes: [
        { id: 'thanos', name: 'Titan_God', desc: 'World Ender / Resource Void', icon: <Shield className="w-4 h-4 text-purple-400" /> },
        { id: 'loki', name: 'Loki_Logic', desc: 'Chaos Node / Deception Root', icon: <MessageSquare className="w-4 h-4 text-amber-400" /> },
        { id: 'ender', name: 'Hive_Master', desc: 'Strategic Void Controller', icon: <Cpu className="w-4 h-4 text-white" /> },
      ]
    }
  };

  const selectClass = (id: string) => {
    setUniverseState(prev => ({ ...prev, classId: id }));
    setWorldGenerationLog(prev => [`[CORE] Identity synchronized: ${id.toUpperCase()}`, ...prev]);
  };

  const [engineMode, setEngineMode] = useState<'GENIE' | 'FLOW'>('GENIE');
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'SKILLS' | 'INVENTORY' | 'QUESTS'>('PIPELINE');
  const [worldGenerationLog, setWorldGenerationLog] = useState<string[]>(['[SYNK] World Orchestrator Online.', '[SYNK] Listening for procedural injectors.']);

  const grantXp = (amount: number, skill?: keyof UnlockedUniverseState['skills']) => {
    setUniverseState(prev => {
      const newXp = prev.xp + amount;
      const levelUp = newXp >= 1000;
      const updatedSkills = { ...prev.skills };
      if (skill) updatedSkills[skill] += Math.floor(amount / 50);

      return {
        ...prev,
        xp: levelUp ? newXp - 1000 : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
        skills: updatedSkills
      };
    });
    if (skill) setWorldGenerationLog(prev => [`[XP] +${amount} to ${skill.toUpperCase()}`, ...prev]);
  };

  const triggerHyperdrive = () => {
    setUniverseState(prev => ({ ...prev, hyperdriveWarpActive: true }));
    setWorldGenerationLog(prev => [`[WARP] Engaging Hyperdrive Core v7...`, ...prev]);
    
    setTimeout(() => {
      const newSeed = `SEED_${Math.random().toString(36).substring(7).toUpperCase()}`;
      setUniverseState(prev => {
        const nextXp = prev.xp + 200;
        const levelUp = nextXp >= 1000;
        return { 
          ...prev, 
          hyperdriveWarpActive: false,
          activeWorldSeed: newSeed,
          xp: levelUp ? nextXp - 1000 : nextXp,
          level: levelUp ? prev.level + 1 : prev.level
        };
      });
      setWorldGenerationLog(prev => [
        `[STORY] Crossing the Boson Einstein Rosenbridge... Spacetime folding complete.`,
        `[WARP] Arrived at Galactic Sector ${newSeed}`,
        ...prev
      ]);
    }, 2000);
  };

  const genieInject = (type: string) => {
    setWorldGenerationLog(prev => [`[GENIE] Injecting ${type} procedural DNA into matrix...`, ...prev]);
    
    // Grant XP based on action type
    if (type === 'Infect_Flora') grantXp(40, 'magic');
    else if (type === 'Spawn_Mesh') grantXp(50, 'engineering');
    else if (type === 'Gravity_Shift') grantXp(100, 'logic');
    else if (type === 'Assemble_Army') grantXp(80, 'strength');
    else grantXp(30);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'PROCESSING') {
          const nextProgress = task.progress + Math.random() * 10;
          if (nextProgress >= 100) {
            return { ...task, progress: 100, status: 'COMPLETED' };
          }
          return { ...task, progress: nextProgress };
        }
        if (task.status === 'QUEUED' && Math.random() > 0.8) {
           return { ...task, status: 'PROCESSING', progress: 0 };
        }
        return task;
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-[#050508] text-white p-6 overflow-hidden flex flex-col font-sans">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-emerald-400">Universe_Orchestrator_PRO</h1>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Synaptic Spacetime Architecture</span>
             <div className="h-px w-20 bg-emerald-500/30" />
             <span className="text-[10px] font-mono text-emerald-500/80 uppercase">SEED: {universeState.activeWorldSeed}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                onClick={() => setEngineMode('GENIE')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${engineMode === 'GENIE' ? 'bg-cyan-500 text-black font-black' : 'text-white/40 hover:text-white'}`}
              >
                <Sparkles className="w-3 h-3" /> Genie_Brush
              </button>
              <button 
                onClick={() => setEngineMode('FLOW')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${engineMode === 'FLOW' ? 'bg-emerald-500 text-black font-black' : 'text-white/40 hover:text-white'}`}
              >
                <RefreshCw className="w-3 h-3" /> Flow_Engine
              </button>
           </div>
           {onBack && (
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-white/40">
                <ArrowRight className="w-5 h-5 rotate-180" />
             </button>
           )}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
         {/* Live High-Fidelity Shader Rendering Plane */}
         <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
            <div className="flex-1 bg-black rounded-[40px] relative overflow-hidden group shadow-2xl">
               <AnimatePresence>
                  {universeState.hyperdriveWarpActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-black flex items-center justify-center"
                    >
                       <div className="flex flex-col items-center gap-8">
                          <div className="relative w-48 h-48">
                             <motion.div 
                               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                               transition={{ duration: 0.5, repeat: Infinity }}
                               className="absolute inset-0 border-4 border-cyan-500 rounded-full blur-xl"
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Rocket className="w-20 h-20 text-cyan-400 animate-bounce" />
                             </div>
                          </div>
                          <div className="text-center">
                             <div className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Engaging Hyperdrive</div>
                             <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.5em]">Tearing Spacetime Shroud...</div>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               <div className="absolute inset-0 z-0">
                  <NebulaHighFidelityShader />
               </div>

               {/* Engine Overlay HUD */}
               <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end z-10 pointer-events-none">
                  <div className="bg-black/60 border border-white/10 p-6 rounded-[30px] backdrop-blur-xl pointer-events-auto">
                     <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${engineMode === 'GENIE' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                           {engineMode === 'GENIE' ? <Sparkles className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest">{engineMode}_Module_Active</h2>
                     </div>
                      <div className="flex gap-2">
                        {engineMode === 'GENIE' ? (
                          [
                            { id: 'flora', label: 'Infect_Flora', lvl: 1 },
                            { id: 'mesh', label: 'Spawn_Mesh', lvl: 1 },
                            { id: 'gravity', label: 'Gravity_Shift', lvl: 3 },
                            { id: 'moon', label: 'Moon_Base_v1', lvl: 5 },
                            { id: 'minecraft', label: 'Vox_Build_Mod', lvl: 10 },
                          ].map(action => (
                            <button 
                              key={action.id} 
                              disabled={universeState.level < action.lvl}
                              onClick={() => genieInject(action.label)} 
                              className={`px-3 py-1.5 border border-white/10 rounded-lg text-[8px] font-mono uppercase tracking-widest transition-all ${universeState.level >= action.lvl ? 'bg-white/5 hover:bg-cyan-500 hover:text-black cursor-pointer' : 'bg-white/5 opacity-20 cursor-not-allowed'}`}
                            >
                              {action.label} {universeState.level < action.lvl && `(Lvl ${action.lvl})`}
                            </button>
                          ))
                        ) : (
                          [
                            { id: 'army', label: 'Assemble_Army', lvl: 1 },
                            { id: 'nexus', label: 'Build_Nexus', lvl: 1 },
                            { id: 'ge', label: 'Merc_Exchange', lvl: 5 },
                            { id: 'gta', label: 'GTA_Sync_Map', lvl: 8 },
                            { id: 'rs', label: 'Skill_Grind_Looper', lvl: 10 },
                          ].map(action => (
                            <button 
                              key={action.id} 
                              disabled={universeState.level < action.lvl}
                              onClick={() => genieInject(action.label)} 
                              className={`px-3 py-1.5 border border-white/10 rounded-lg text-[8px] font-mono uppercase tracking-widest transition-all ${universeState.level >= action.lvl ? 'bg-white/5 hover:bg-emerald-500 hover:text-black cursor-pointer' : 'bg-white/5 opacity-20 cursor-not-allowed'}`}
                            >
                              {action.label} {universeState.level < action.lvl && `(Lvl ${action.lvl})`}
                            </button>
                          ))
                        )}
                     </div>
                  </div>

                  <div className="text-right">
                     <button 
                       onClick={triggerHyperdrive}
                       className="group pointer-events-auto flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-[30px] hover:bg-cyan-500 hover:text-black transition-all shadow-2xl"
                     >
                        <div className="text-right">
                           <div className="text-xs font-black uppercase tracking-widest">Jump_Next_Sector</div>
                           <div className="text-[8px] font-mono opacity-60 uppercase italic">Hyperdrive_Core: READY</div>
                        </div>
                        <Rocket className="w-6 h-6 group-hover:translate-y-[-4px] transition-transform" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Performance Node Status */}
            <div className="h-40 bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex items-center justify-between relative">
               <div className="flex gap-12">
                  <div>
                     <div className="text-[9px] font-mono text-white/20 uppercase mb-2 italic">Active_Spacetime_Mesh</div>
                     <div className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">RENDER_v10.3</div>
                  </div>
                  <div>
                     <div className="text-[9px] font-mono text-white/20 uppercase mb-2 italic">Neural_Coordinate</div>
                     <div className="text-2xl font-black text-white font-mono tracking-tighter">X:{universeState.spatialCoordinates.x} Y:{universeState.spatialCoordinates.y}</div>
                  </div>
                  <div>
                     <div className="text-[9px] font-mono text-white/20 uppercase mb-2 italic">Character_Origin</div>
                     <div className="text-xl font-black text-rose-400 font-mono tracking-tighter uppercase">
                        {universeState.classId ? universeState.classId.replace(/_/g, ' ') : 'UNASSIGNED'}
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-4">
                     <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-white/80 tracking-widest">Level {universeState.level}</div>
                        <div className="text-[8px] font-mono text-white/40 uppercase underline decoration-rose-500/50 underline-offset-4 cursor-help" title="Fable Skill System x RuneScape Grinding">Singularity_Arch_XP</div>
                     </div>
                     <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 flex items-center justify-center relative">
                        <div className="text-xs font-black text-rose-500">{Math.floor((universeState.xp / 1000) * 100)}%</div>
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                           <circle 
                              cx="24" cy="24" r="20" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="4" 
                              strokeDasharray={`${(universeState.xp / 1000) * 125} 125`}
                              className="text-rose-500"
                           />
                        </svg>
                     </div>
                  </div>
                  <button 
                    onClick={() => setUniverseState(prev => ({ ...prev, xp: (prev.xp + 50) % 1000, level: prev.xp + 50 >= 1000 ? prev.level + 1 : prev.level }))}
                    className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-[8px] font-mono text-rose-400 uppercase tracking-widest transition-all"
                  >
                    +50_XP_GRIND (Runescape_Style)
                  </button>
               </div>
            </div>
         </div>

         {/* Right Sidebar: Pipeline & Logs */}
         <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
            {/* Character Selection Panel (If not selected) */}
            {!universeState.classId && (
               <div className="bg-rose-500/10 border border-rose-500/20 rounded-[30px] p-6 flex flex-col gap-4 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                     <Shield className="w-3 h-3 text-rose-400" /> Identity_Sync_Required
                  </h3>
                  <div className="space-y-4">
                     {Object.entries(characterFactions).map(([key, faction]) => (
                        <div key={key} className="space-y-2">
                           <div className="text-[8px] font-mono text-white/30 uppercase">{faction.name}</div>
                           <div className="grid grid-cols-1 gap-2">
                              {faction.classes.map(cls => (
                                 <button 
                                    key={cls.id} 
                                    onClick={() => selectClass(cls.id)}
                                    className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:border-rose-500/50 transition-all text-left group"
                                 >
                                    <div className="flex items-center gap-3 mb-1">
                                       {cls.icon}
                                       <span className="text-[10px] font-black uppercase text-white group-hover:text-rose-400 transition-colors">{cls.name}</span>
                                    </div>
                                    <p className="text-[8px] font-mono text-white/40 leading-tight">{cls.desc}</p>
                                 </button>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            {/* World Gen Log */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[30px] p-6 flex flex-col gap-6 min-h-0 shadow-xl">
               <div className="flex justify-between items-center shrink-0">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                     <Terminal className="w-3 h-3 text-cyan-400" /> Synaptic_Logs
                  </h3>
                  {universeState.classId && (
                     <button 
                        onClick={() => setUniverseState(prev => ({ ...prev, classId: null }))}
                        className="text-[8px] font-mono text-white/20 hover:text-rose-400 uppercase tracking-widest transition-colors"
                     >
                        Reset_Identity
                     </button>
                  )}
               </div>
               <div className="flex-1 overflow-y-auto font-mono text-[9px] space-y-2 pr-2 scrollbar-hide text-white/40">
                  {worldGenerationLog.map((log, i) => (
                    <div key={i} className="border-l border-white/5 pl-3 hover:text-white transition-colors">
                       <span className="text-cyan-400/50 mr-2">[{log.match(/\[(.*?)\]/)?.[1]}]</span>
                       {log.replace(/\[.*?\]/, '')}
                    </div>
                  ))}
               </div>
            </div>

            {/* Tabbed HUD Interface */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[30px] p-6 flex-1 flex flex-col min-h-0 shadow-xl overflow-hidden">
               <div className="flex bg-white/5 p-1 rounded-2xl mb-6 shrink-0">
                  {[
                    { id: 'PIPELINE', icon: <GitBranch className="w-3 h-3" /> },
                    { id: 'SKILLS', icon: <Sword className="w-3 h-3" /> },
                    { id: 'INVENTORY', icon: <Package className="w-3 h-3" /> },
                    { id: 'QUESTS', icon: <ListTodo className="w-3 h-3" /> },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[8px] font-mono uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white/10 text-white font-black' : 'text-white/30 hover:text-white'}`}
                    >
                      {tab.icon}
                    </button>
                  ))}
               </div>

               <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                  {activeTab === 'PIPELINE' && (
                    <div className="space-y-4">
                       {/* AI Task Generator Input */}
                       <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-400 tracking-widest">
                             <Sparkles className="w-3 h-3" /> Neural_Task_Generator
                          </div>
                          <div className="flex gap-2">
                             <input 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && generateAITask()}
                                placeholder="Describe task (e.g. sync neural mesh)..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-mono focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20 uppercase"
                             />
                             <button 
                                onClick={generateAITask}
                                disabled={isGeneratingTask || !aiPrompt.trim()}
                                className="w-10 h-10 bg-emerald-500 text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
                             >
                                {isGeneratingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                             </button>
                          </div>
                          <p className="text-[7px] font-mono text-emerald-500/40 italic uppercase">Atlas_AI parses natural language into serialized pipeline nodes</p>
                       </div>

                       <AnimatePresence initial={false}>
                        {tasks.map(task => (
                          <motion.div 
                            key={task.id}
                            className="bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-emerald-500/20 transition-all relative overflow-hidden group"
                          >
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <div className="text-[10px] font-black uppercase text-white mb-1 group-hover:text-emerald-400 transition-colors">{task.label}</div>
                                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">Module: {task.module}</div>
                               </div>
                               <div className={`text-[7px] font-bold px-1.5 py-0.5 rounded border ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : task.status === 'PROCESSING' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse' : 'bg-white/5 text-white/30 border-white/10'}`}>
                                  {task.status}
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full ${task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-cyan-400'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${task.progress}%` }}
                                  />
                               </div>
                               <span className="text-[8px] font-mono text-white/40">{Math.round(task.progress)}%</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                   {activeTab === 'SKILLS' && (
                    <div className="space-y-4">
                       {Object.entries(universeState.skills).map(([skill, level]) => {
                         const currentPerks = SKILL_PERKS[skill as keyof typeof SKILL_PERKS] || [];
                         const nextPerk = currentPerks.find(p => p.level > level);
                         const progress = (level % 10) * 10;
                         
                         return (
                           <div key={skill} className="bg-white/5 border border-white/10 rounded-2xl p-4 group relative overflow-visible hover:border-cyan-500/30 transition-all">
                              {/* Enhanced Skill Tooltip Interface */}
                              <div className="absolute inset-x-0 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none z-[100]">
                                 <div className="bg-[#0a0a0c] border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_40px_rgba(6,182,212,0.15)] backdrop-blur-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                       <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full" />
                                          <span className="text-[10px] font-black tracking-widest uppercase text-white">{skill}_Algorithmic_Matrix</span>
                                       </div>
                                       <span className="text-[8px] font-mono text-cyan-400/60 uppercase italic tracking-tighter">Resonance_Tier_v4</span>
                                    </div>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                       {currentPerks.map((p, i) => (
                                          <div key={i} className={`relative pl-4 border-l ${p.level <= level ? 'border-cyan-500' : 'border-white/5 opacity-20'}`}>
                                             <div className={`absolute -left-[5px] top-1 w-2 h-2 border border-black rounded-full ${p.level <= level ? 'bg-cyan-500' : 'bg-white/10'}`} />
                                             <div className="flex justify-between items-center text-[9px] font-bold mb-1">
                                                <span className={p.level <= level ? 'text-white' : 'text-white/40'}>LVL {p.level}: {p.name}</span>
                                                {p.level <= level && (
                                                   <span className="text-[7px] text-cyan-400 border border-cyan-400/20 px-1 rounded bg-cyan-400/5">SYNCHRONIZED</span>
                                                )}
                                             </div>
                                             <p className="text-[8px] text-white/40 italic leading-snug lowercase tracking-tight">{p.perk}</p>
                                          </div>
                                       ))}
                                    </div>
                                    {nextPerk && (
                                       <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                          <div className="text-[7px] font-mono text-white/30 uppercase tracking-widest leading-none">
                                             Req: <span className="text-white">+{nextPerk.level - level} Resonance Points</span>
                                          </div>
                                          <div className="text-[7px] font-black text-cyan-400 uppercase tracking-widest">Target: {nextPerk.name}</div>
                                       </div>
                                    )}
                                 </div>
                                 <div className="w-4 h-4 bg-[#0a0a0c] border-r border-b border-cyan-500/30 rotate-45 mx-auto -mt-2" />
                              </div>

                              <div className="flex justify-between items-center mb-2">
                                 <div className="text-[10px] font-black uppercase text-white font-mono flex items-center gap-2">
                                    {skill === 'strength' && <Sword className="w-3 h-3 text-rose-500" />}
                                    {skill === 'logic' && <Cpu className="w-3 h-3 text-cyan-400" />}
                                    {skill === 'magic' && <Sparkles className="w-3 h-3 text-purple-400" />}
                                    {skill === 'engineering' && <RefreshCw className="w-3 h-3 text-emerald-400" />}
                                    {skill}
                                 </div>
                                 <div className="text-xs font-black text-rose-400">Lv.{level}</div>
                              </div>
                              <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                                 <motion.div 
                                   className="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                                   initial={{ width: 0 }}
                                   animate={{ width: `${progress}%` }}
                                   transition={{ duration: 1, ease: "easeOut" }}
                                 />
                                 {/* Tick marks for every 10% */}
                                 <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                       <div key={i} className="w-[1px] h-full bg-white/10" />
                                    ))}
                                 </div>
                              </div>
                              <div className="flex justify-between items-center text-[7px] font-mono tracking-widest uppercase">
                                <span className="text-white/20 italic">
                                  {nextPerk ? `Next: ${nextPerk.name} (LV.${nextPerk.level})` : 'Max Milestone Detected'}
                                </span>
                                <span className="text-rose-500/50">{100 - progress}% XP TO NEXT NODE</span>
                              </div>
                           </div>
                         );
                       })}
                    </div>
                  )}

                  {activeTab === 'INVENTORY' && (
                    <div className="grid grid-cols-2 gap-3">
                       {universeState.inventory.map((item, i) => (
                         <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 group hover:border-rose-500/50 transition-all cursor-crosshair">
                            <Box className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                            <div className="text-[7px] font-mono text-white/40 text-center uppercase leading-tight">{item.replace(/_/g, ' ')}</div>
                         </div>
                       ))}
                       <div className="aspect-square bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex items-center justify-center">
                          <span className="text-[8px] font-mono text-white/10 uppercase italic">Empty_Slot</span>
                       </div>
                    </div>
                  )}

                  {activeTab === 'QUESTS' && (
                    <div className="space-y-3">
                       {[
                         { title: "Heimdall's Sight", desc: "Scan 5 Galactic Sectors", progress: 2, total: 5, reward: "Bifrost_Key" },
                         { title: "Stark's Legacy", desc: "Build a Vox_Nexus_v2", progress: 0, total: 1, reward: "Iron_Mesh_DNA" },
                         { title: "Thanos' Remnant", desc: "Harvest Void Matter", progress: 85, total: 100, reward: "Infinity_Shard" },
                       ].map((quest, i) => (
                         <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition-all">
                            <div className="flex justify-between items-start mb-2">
                               <div className="text-[9px] font-black uppercase text-rose-400">{quest.title}</div>
                               <div className="text-[7px] font-mono text-white/30 uppercase italic">{quest.reward}</div>
                            </div>
                            <p className="text-[8px] font-mono text-white/40 mb-3 leading-tight">{quest.desc}</p>
                            <div className="flex items-center gap-3">
                               <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-white/20" style={{ width: `${(quest.progress / quest.total) * 100}%` }} />
                               </div>
                               <span className="text-[7px] font-mono text-white/30">{quest.progress}/{quest.total}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
