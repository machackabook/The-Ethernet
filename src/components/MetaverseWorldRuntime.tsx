import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad, Crosshair, Compass, Shield, Hammer, FastForward, Swords, Milestone, Cpu, RefreshCw, Zap, Flame, Terminal, HelpCircle, LayoutGrid } from 'lucide-react';

interface MetaverseWorldRuntimeProps {
  keyMap: Record<string, string>;
  onDeployDrone: () => void;
}

interface GridCell {
  x: number;
  y: number;
  type: 'empty' | 'block' | 'spawn' | 'hazard';
  color?: string;
}

interface PVPEvent {
  id: string;
  timestamp: string;
  message: string;
  type: 'combat' | 'build' | 'system' | 'evolution';
}

const ORBIT_SYSTEMS = [
  { id: 'jita', name: 'Jita 4-4 (New Eden)', radius: 50, speed: 0.8, color: 'bg-blue-400' },
  { id: 'tarsonis', name: 'Tarsonis (Koprulu Sector)', radius: 85, speed: 0.5, color: 'bg-rose-400' },
  { id: 'char', name: 'Char Prime (Zerg Core)', radius: 120, speed: 0.3, color: 'bg-amber-600' },
  { id: 'caldari', name: 'Caldari Prime (Eve Orbit)', radius: 155, speed: 0.2, color: 'bg-teal-400' },
];

export function MetaverseWorldRuntime({ keyMap, onDeployDrone }: MetaverseWorldRuntimeProps) {
  // Gameplay State
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [playerHp, setPlayerHp] = useState(100);
  const [playerShield, setPlayerShield] = useState(50);
  const [isJumping, setIsJumping] = useState(false);
  const [isFiring, setIsFiring] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  
  // Opponent (PVP Bot)
  const [botPos, setBotPos] = useState({ x: 4, y: 4 });
  const [botHp, setBotHp] = useState(100);
  const [botShield, setBotShield] = useState(40);
  const [botStatus, setBotStatus] = useState<'idle' | 'taking_damage' | 'respawn'>('idle');

  // Interactive Voxel blocks (Minecraft/Roblox-style)
  const [voxelGrid, setVoxelGrid] = useState<GridCell[]>(() => {
    const cells: GridCell[] = [];
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        cells.push({
          x,
          y,
          type: (x === 0 || x === 5 || y === 0 || y === 5) && Math.random() > 0.8 ? 'block' : 'empty',
          color: 'bg-slate-800/40'
        });
      }
    }
    return cells;
  });

  // Flow & Genie Evolutionary (Quin) parameters
  const [evolutionGen, setEvolutionGen] = useState(144);
  const [mutationRate, setMutationRate] = useState(65);
  const [geneticDrift, setGeneticDrift] = useState('DELTA-X9');
  const [quinDNA, setQuinDNA] = useState<string[]>(['ACTG', 'CGTA', 'TTAG', 'GCCA']);
  const [cellsMatrix, setCellsMatrix] = useState<number[][]>(() => 
    Array(8).fill(null).map(() => Array(8).fill(null).map(() => Math.random() > 0.6 ? 1 : 0))
  );

  // EVE / StarCraft Space Sector Simulation
  const [spaceTime, setSpaceTime] = useState(0);
  const [warpFlash, setWarpFlash] = useState(false);
  const [launchedDrones, setLaunchedDrones] = useState<{ id: string; progress: number }[]>([]);
  const [storyFeed, setStoryFeed] = useState<string>('Deterministic timeline initial state synchronized.');

  // PVP Arena Event Log
  const [logs, setLogs] = useState<PVPEvent[]>([
    { id: '1', timestamp: '05:57:42', message: 'Sovereign Quin Sandbox engine initialized.', type: 'system' },
    { id: '2', timestamp: '05:57:45', message: 'Roblox-Minecraft voxel renderer loaded on Canvas 0.', type: 'system' },
    { id: '3', timestamp: '05:57:48', message: 'StarCraft battlecruiser fleet deployed in Tarsonis Sector.', type: 'evolution' }
  ]);

  // Floating damage text
  const [damageIndicators, setDamageIndicators] = useState<{ id: string; text: string; x: number; y: number }[]>([]);

  const addLog = (message: string, type: 'combat' | 'build' | 'system' | 'evolution') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs(prev => [
      { id: Math.random().toString(), timestamp: timeStr, message, type },
      ...prev.slice(0, 18)
    ]);
  };

  useEffect(() => {
    const handleDroneDeploy = () => {
        onDeployDrone();
        addLog('Scout drone deployed. Mapping 3D Void...', 'system');
    };
    window.addEventListener('nexus-drone-deploy', handleDroneDeploy);
    
    const interval = setInterval(() => {
      setEvolutionGen(prev => prev + 1);
      
      // Mutate Quin cell matrix (Genie autopoiesis simulation)
      setCellsMatrix(prev => prev.map(row => 
        row.map(cell => {
          if (Math.random() * 100 < mutationRate) {
            return cell === 1 ? 0 : 1; // flip cell state based on mutation rate
          }
          return cell;
        })
      ));

      // Mutate random DNA nucleotide
      const nucleo = ['A', 'C', 'T', 'G'];
      setQuinDNA(prev => prev.map(dna => {
        if (Math.random() > 0.7) {
          const idx = Math.floor(Math.random() * dna.length);
          const chars = dna.split('');
          chars[idx] = nucleo[Math.floor(Math.random() * nucleo.length)];
          return chars.join('');
        }
        return dna;
      }));

      // Eve / StarCraft space orbit updates
      setSpaceTime(prev => prev + 0.05);

      // Deterministic Story progression
      const stories = [
        "Caldari trade convoys report warp disruption bubbles near Jita orbit.",
        "Protoss carrier groups initiate plasma sweeps in Char System sector.",
        "Evolving Quin organisms exhibit autonomous cellular code synthesis.",
        "Fortnite PvP Arena localized gravity storm shrinks safe voxel zone.",
        "Genie automated runtime compiled 14 mutated smart contracts live.",
        "Saints Row gang activity detected in Voxel City District 4.",
        "New Eden market indices stabilize; VOD-Tokens trade volume surged."
      ];
      if (Math.random() > 0.85) {
        setStoryFeed(stories[Math.floor(Math.random() * stories.length)]);
        addLog(`[STORY_EVOLUTION] ${stories[Math.floor(Math.random() * stories.length)]}`, 'evolution');
      }

      // Slowly regenerate shields
      setPlayerShield(prev => Math.min(100, prev + 1));
      setBotShield(prev => Math.min(100, prev + 1));
    }, 1200); 
    
    return () => {
      window.removeEventListener('nexus-drone-deploy', handleDroneDeploy);
      clearInterval(interval);
    };
  }, [mutationRate]);

  // Handle Drone progressions
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunchedDrones(prev => 
        prev.map(d => ({ ...d, progress: d.progress + 5 }))
            .filter(d => d.progress < 100)
      );
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Action Triggers
  const handleMove = (dx: number, dy: number) => {
    const newX = Math.max(0, Math.min(5, playerPos.x + dx));
    const newY = Math.max(0, Math.min(5, playerPos.y + dy));
    
    // Check for voxel block collision
    const obstacle = voxelGrid.find(cell => cell.x === newX && cell.y === newY && cell.type === 'block');
    if (obstacle) {
      addLog("Movement blocked by structural Voxel barrier.", "system");
      return;
    }

    setPlayerPos({ x: newX, y: newY });
    addLog(`Navigated voxel sector to matrix [${newX}, ${newY}].`, "system");
  };

  const handleJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    addLog("Thrust vector vertical lift initialized (Roblox Physics Jump).", "system");
    setTimeout(() => setIsJumping(false), 500);
  };

  const handleFire = () => {
    if (isFiring) return;
    setIsFiring(true);
    addLog("Plasma burst discharged. Active PvP threat engagement started.", "combat");

    // Calculate distance to bot to see if hits
    const dx = Math.abs(playerPos.x - botPos.x);
    const dy = Math.abs(playerPos.y - botPos.y);
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance <= 4) {
      // Hit!
      setBotStatus('taking_damage');
      
      const isCrit = Math.random() > 0.6;
      const damage = isCrit ? Math.floor(25 + Math.random() * 15) : Math.floor(12 + Math.random() * 8);
      
      // Floating indicator
      const indId = Math.random().toString();
      setDamageIndicators(prev => [...prev, {
        id: indId,
        text: isCrit ? `CRIT -${damage}! 🔥` : `-${damage}`,
        x: botPos.x,
        y: botPos.y
      }]);
      setTimeout(() => {
        setDamageIndicators(prev => prev.filter(ind => ind.id !== indId));
      }, 1000);

      // Reduce Bot Shield then HP
      setBotShield(prev => {
        if (prev >= damage) return prev - damage;
        const remainder = damage - prev;
        setBotHp(h => {
          const nextHp = Math.max(0, h - remainder);
          if (nextHp <= 0) {
            addLog("Target DROID_BOT_X destroyed! Roblox loot box dispersed.", "combat");
            // Respawn bot shortly
            setTimeout(() => {
              setBotHp(100);
              setBotShield(50);
              setBotPos({ x: Math.floor(Math.random() * 6), y: Math.floor(Math.random() * 6) });
              addLog("New PvP Bot respawned at deterministic coordinate.", "system");
            }, 2000);
          }
          return nextHp;
        });
        return 0;
      });

      addLog(`Fortnite PvP Combat: Dealt ${damage} damage to DROID_BOT_X.`, "combat");
    } else {
      addLog("Discharged energy round missed. Target outside targeting lock.", "combat");
    }

    setTimeout(() => {
      setIsFiring(false);
      setBotStatus('idle');
    }, 400);
  };

  const handleShieldRestore = () => {
    setShieldActive(true);
    setPlayerShield(100);
    addLog("Sovereign defensive energy shield fully re-charged.", "combat");
    setTimeout(() => setShieldActive(false), 1500);
  };

  const handleBuildVoxel = () => {
    // Attempt to place block directly in front of player
    const buildX = playerPos.x === 5 ? 4 : playerPos.x + 1;
    const buildY = playerPos.y;

    if (buildX === botPos.x && buildY === botPos.y) {
      addLog("Error: Cannot build voxel inside another entity.", "system");
      return;
    }

    // Place or remove block
    setVoxelGrid(prev => prev.map(cell => {
      if (cell.x === buildX && cell.y === buildY) {
        const isCurrentlyBlock = cell.type === 'block';
        addLog(
          isCurrentlyBlock 
            ? `Voxel block de-constructed at matrix [${buildX}, ${buildY}].` 
            : `Minecraft Voxel deployed at matrix [${buildX}, ${buildY}].`,
          "build"
        );
        return { ...cell, type: isCurrentlyBlock ? 'empty' : 'block' };
      }
      return cell;
    }));
  };

  const handleWarpDrive = () => {
    setWarpFlash(true);
    addLog("Warp drive engaged. Interstellar space coordinates re-calibrating deterministically.", "evolution");
    setTimeout(() => {
      setWarpFlash(false);
      setSpaceTime(prev => prev + 10);
      addLog("Superluminal jump finalized in New Eden Outer Rim.", "system");
    }, 800);
  };

  const handleLaunchDrone = () => {
    const droneId = Math.random().toString();
    setLaunchedDrones(prev => [...prev, { id: droneId, progress: 0 }]);
    addLog("Launched StarCraft Tactical Interceptor drone.", "evolution");
  };

  const handleSovereignSync = () => {
    setEvolutionGen(prev => prev + 50);
    // Shuffle the cellular automaton
    setCellsMatrix(prev => prev.map(row => row.map(() => Math.random() > 0.4 ? 1 : 0)));
    addLog("Quin Evolutionary Matrix synced. Genetic entropy recalibrated.", "evolution");
  };

  // Register Global Keyboard Listeners mapped to custom shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Find which action matches this key
      const pressedKey = e.key.toLowerCase();
      
      // Match key from keyMap
      let matchedAction: string | null = null;
      Object.entries(keyMap).forEach(([actionId, mappedKey]) => {
        if (mappedKey.toLowerCase() === pressedKey || (mappedKey === ' ' && e.key === ' ')) {
          matchedAction = actionId;
        }
      });

      if (!matchedAction) return;

      // Prevent default movement/page scrolling
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key)) {
        e.preventDefault();
      }

      switch (matchedAction) {
        case 'move-forward':
          handleMove(0, -1);
          break;
        case 'move-backward':
          handleMove(0, 1);
          break;
        case 'strafe-left':
          handleMove(-1, 0);
          break;
        case 'strafe-right':
          handleMove(1, 0);
          break;
        case 'jump':
          handleJump();
          break;
        case 'fire-weapon':
          handleFire();
          break;
        case 'activate-shield':
          handleShieldRestore();
          break;
        case 'build-voxel':
          handleBuildVoxel();
          break;
        case 'warp-drive':
          handleWarpDrive();
          break;
        case 'launch-drone':
          handleLaunchDrone();
          break;
        case 'sub-kernel-sync':
          handleSovereignSync();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [playerPos, botPos, voxelGrid, keyMap, isJumping, isFiring]);

  return (
    <div className="w-full h-full bg-black/90 rounded-[32px] border border-white/5 flex flex-col overflow-hidden text-white font-sans max-h-[64vh]">
      
      {/* Warp Flash Overlay */}
      <AnimatePresence>
        {warpFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white backdrop-blur-md pointer-events-none flex items-center justify-center"
          >
            <span className="text-black font-black uppercase text-xl tracking-[0.5em] animate-ping">WARP_DRIVE_ENGAGED</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Engine Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-black to-slate-950/40 border-b border-white/5 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Gamepad className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Quin_Evolutionary_World_Engine</h3>
            <p className="text-[7px] font-mono text-white/30 uppercase leading-none mt-1">Multi-Domain Sovereign Simulation // High-End Sandbox</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-[8px] font-mono text-purple-300">
             <Cpu className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
             Gen: {evolutionGen}
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[8px] font-mono text-emerald-300">
             <Zap className="w-3 h-3 text-emerald-400" />
             FLOW_STABILITY: 100%
          </div>
        </div>
      </div>

      {/* Main Grid Viewport splits */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden max-h-full">
        
        {/* Left Col: Voxel Arena / Roblox PvP (Grid 5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
              <Swords className="w-3 h-3" /> Roblox_Voxel_PvP_Arena
            </span>
            <span className="text-[7px] font-mono text-white/40">Fortnite Style Mechanics</span>
          </div>

          {/* Voxel Grid Map */}
          <div className="flex-1 relative bg-black/50 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-2 min-h-[220px]">
            <div className="grid grid-cols-6 gap-1.5 w-full max-w-[240px] aspect-square relative z-10">
              {voxelGrid.map(cell => {
                const isPlayer = playerPos.x === cell.x && playerPos.y === cell.y;
                const isBot = botPos.x === cell.x && botPos.y === cell.y;
                const hasBlock = cell.type === 'block';

                return (
                  <div 
                    key={`${cell.x}-${cell.y}`}
                    className={`aspect-square rounded-md border flex items-center justify-center relative transition-all overflow-hidden ${
                      isPlayer ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.3)]' :
                      isBot ? 'border-rose-500 bg-rose-950/20' :
                      hasBlock ? 'border-amber-600 bg-amber-950/40 shadow-inner' :
                      'border-white/5 bg-white/[0.01]'
                    }`}
                  >
                    {/* Render Voxel Cube graphic if block */}
                    {hasBlock && (
                      <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-sm border border-amber-400/50 shadow-md animate-pulse" />
                    )}

                    {/* Player Representation (Roblox-style Voxel Character) */}
                    {isPlayer && (
                      <motion.div 
                        animate={isJumping ? { y: [-15, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="w-5 h-5 flex flex-col items-center justify-center relative z-20"
                      >
                        <div className="w-3.5 h-3.5 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded border border-cyan-300 relative">
                           {shieldActive && <div className="absolute inset-0 bg-white/40 rounded animate-ping" />}
                           {/* Face dots */}
                           <div className="absolute top-1 left-0.5 w-1 h-1 bg-white rounded-full" />
                           <div className="absolute top-1 right-0.5 w-1 h-1 bg-white rounded-full" />
                        </div>
                        <div className="text-[6px] font-mono text-cyan-400 mt-0.5 scale-90 font-black">Quin</div>
                      </motion.div>
                    )}

                    {/* Opponent Bot Representation */}
                    {isBot && (
                      <div className={`w-5 h-5 flex flex-col items-center justify-center relative z-20 transition-all ${botStatus === 'taking_damage' ? 'scale-110 rotate-12 duration-75' : ''}`}>
                        <div className={`w-3.5 h-3.5 rounded border relative ${botStatus === 'taking_damage' ? 'bg-rose-500 border-white' : 'bg-gradient-to-tr from-rose-600 to-red-800 border-rose-400'}`}>
                           <div className="absolute top-1 left-0.5 w-1 h-1 bg-white rounded-full" />
                           <div className="absolute top-1 right-0.5 w-1 h-1 bg-white rounded-full" />
                        </div>
                        <div className="text-[6px] font-mono text-rose-400 mt-0.5 scale-90 font-black">Drake</div>
                      </div>
                    )}

                    {/* Cell Coords tooltip on hover */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/40 flex items-center justify-center text-[5px] font-mono">
                      {cell.x},{cell.y}
                    </div>
                  </div>
                );
              })}

              {/* Render Firing projectile beams */}
              {isFiring && (
                <div 
                  className="absolute bg-gradient-to-r from-cyan-400 via-rose-500 to-transparent pointer-events-none z-30 h-1.5 rounded"
                  style={{
                    left: `${playerPos.x * 40 + 20}px`,
                    top: `${playerPos.y * 40 + 20}px`,
                    width: `${Math.sqrt(Math.pow(botPos.x - playerPos.x, 2) + Math.pow(botPos.y - playerPos.y, 2)) * 40}px`,
                    transform: `rotate(${Math.atan2(botPos.y - playerPos.y, botPos.x - playerPos.x) * 180 / Math.PI}deg)`,
                    transformOrigin: 'top left',
                  }}
                />
              )}

              {/* Float Damage indicators */}
              {damageIndicators.map(ind => (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -20 }}
                  className="absolute z-40 text-rose-400 text-[10px] font-mono font-black"
                  style={{
                    left: `${ind.x * 40 + 10}px`,
                    top: `${ind.y * 40}px`
                  }}
                >
                  {ind.text}
                </motion.div>
              ))}
            </div>

            {/* Mesh Scanlines visual element */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
          </div>

          {/* Player Vitals HUD */}
          <div className="grid grid-cols-2 gap-2 text-[8px] font-mono uppercase bg-white/[0.02] p-2 rounded-xl border border-white/5">
            <div className="space-y-1.5 border-r border-white/5 pr-2">
              <div className="flex justify-between">
                <span>Player_Health</span>
                <span className="text-cyan-400 font-bold">{playerHp}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full transition-all" style={{ width: `${playerHp}%` }} />
              </div>
              <div className="flex justify-between">
                <span>Player_Shield</span>
                <span className="text-blue-400 font-bold">{playerShield}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full transition-all" style={{ width: `${playerShield}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 pl-2">
              <div className="flex justify-between">
                <span>DROID_BOT_HP</span>
                <span className="text-rose-400 font-bold">{botHp}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full transition-all" style={{ width: `${botHp}%` }} />
              </div>
              <div className="flex justify-between">
                <span>DROID_SHIELD</span>
                <span className="text-pink-400 font-bold">{botShield}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-pink-400 h-full transition-all" style={{ width: `${botShield}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Center Col: Eve Meets Starcraft Deterministic Space Sector (Grid 4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
              <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} /> Deterministic_Space_Sector
            </span>
            <span className="text-[7px] font-mono text-white/40">Koprulu System meets New Eden</span>
          </div>

          {/* Celestial map rendering orbital systems */}
          <div className="flex-1 relative bg-black/60 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[160px]">
            <div className="w-full h-full relative flex items-center justify-center max-w-[200px] aspect-square">
              {/* Central Star */}
              <div className="w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full blur-[2px] shadow-[0_0_15px_#f59e0b] relative z-20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              {/* Orbit rings & planetary entities */}
              {ORBIT_SYSTEMS.map(sys => {
                const angle = spaceTime * sys.speed;
                const px = Math.cos(angle) * sys.radius * 0.55;
                const py = Math.sin(angle) * sys.radius * 0.55;

                return (
                  <React.Fragment key={sys.id}>
                    {/* Orbit Ring */}
                    <div 
                      className="absolute border border-dashed border-white/5 rounded-full pointer-events-none" 
                      style={{ width: `${sys.radius * 1.1}px`, height: `${sys.radius * 1.1}px` }} 
                    />
                    
                    {/* Planet Node */}
                    <motion.div 
                      className={`absolute w-3 h-3 rounded-full ${sys.color} border border-white/20 shadow-md cursor-pointer flex items-center justify-center z-10`}
                      style={{
                        transform: `translate(${px}px, ${py}px)`
                      }}
                      whileHover={{ scale: 1.3 }}
                    >
                      {/* Interactive name tooltips on hovering */}
                      <span className="absolute text-[5px] font-mono text-white/60 bg-black/80 px-1 py-0.5 rounded border border-white/10 opacity-0 hover:opacity-100 pointer-events-none translate-y-3 whitespace-nowrap">
                        {sys.name}
                      </span>
                    </motion.div>
                  </React.Fragment>
                );
              })}

              {/* Render Launched Carrier Drones */}
              {launchedDrones.map(dr => {
                const startAngle = 0;
                const targetRadius = 140;
                const progressRad = (dr.progress / 100) * targetRadius * 0.55;
                const px = Math.cos(startAngle) * progressRad;
                const py = Math.sin(startAngle) * progressRad;

                return (
                  <div 
                    key={dr.id}
                    className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee] pointer-events-none"
                    style={{ transform: `translate(${px}px, ${py}px)` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Evolving Storyline timelines */}
          <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1.5 text-[8px] font-mono uppercase">
             <div className="flex gap-2 text-purple-400 font-bold border-b border-white/5 pb-1">
               <Milestone className="w-3 h-3 shrink-0" />
               Evolving Storyline Log
             </div>
             <p className="text-white/60 leading-normal lowercase first-letter:uppercase italic">
               "{storyFeed}"
             </p>
          </div>
        </div>

        {/* Right Col: Flow & Genie Evolutionary (Quin) cellular grid (Grid 3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Quin_Genetic_Autopoiesis
            </span>
            <span className="text-[7px] font-mono text-white/40">Flow & Genie Runtime</span>
          </div>

          {/* DNA Helix visualization */}
          <div className="h-10 bg-black/40 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-around px-2 shrink-0">
            {quinDNA.map((gene, idx) => (
              <div key={idx} className="flex flex-col items-center">
                 <span className="text-[6px] font-mono text-white/30">Locus_0{idx}</span>
                 <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest animate-pulse">{gene}</span>
              </div>
            ))}
          </div>

          {/* Evolutionary cellular matrix */}
          <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between overflow-hidden min-h-[140px]">
            <div className="grid grid-cols-8 gap-0.5 w-full aspect-square max-w-[120px] mx-auto">
              {cellsMatrix.flatMap((row, rIdx) => 
                row.map((cell, cIdx) => (
                  <div 
                    key={`${rIdx}-${cIdx}`}
                    className={`aspect-square rounded-[1px] transition-all duration-500 ${
                      cell === 1 
                        ? 'bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_4px_#06b6d4]' 
                        : 'bg-white/[0.02]'
                    }`}
                  />
                ))
              )}
            </div>

            <div className="text-[7px] font-mono text-white/40 space-y-1 pt-1.5 border-t border-white/5">
              <div className="flex justify-between">
                <span>Mutation Rate:</span>
                <span className="text-white font-bold">{mutationRate}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="90" 
                value={mutationRate} 
                onChange={(e) => setMutationRate(parseInt(e.target.value))}
                className="w-full accent-cyan-500 opacity-70 hover:opacity-100 cursor-pointer h-1 rounded"
              />
              <div className="flex justify-between">
                <span>Genetic Drift:</span>
                <span className="text-purple-400 font-bold">{geneticDrift}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Dashboard Console Overlay */}
      <div className="bg-black border-t border-white/5 p-4 flex flex-col md:flex-row justify-between gap-4 shrink-0 overflow-y-auto">
        
        {/* On screen keyboard control fallback buttons */}
        <div className="flex flex-wrap gap-2 max-w-full md:max-w-[50%]">
          <button 
            onClick={() => handleMove(0, -1)} 
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            Forward <span className="text-[6px] text-purple-400">[{keyMap['move-forward'] === ' ' ? 'Space' : keyMap['move-forward']}]</span>
          </button>
          <button 
            onClick={() => handleMove(0, 1)} 
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            Back <span className="text-[6px] text-purple-400">[{keyMap['move-backward'] === ' ' ? 'Space' : keyMap['move-backward']}]</span>
          </button>
          <button 
            onClick={() => handleMove(-1, 0)} 
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            L_Strafe <span className="text-[6px] text-purple-400">[{keyMap['strafe-left'] === ' ' ? 'Space' : keyMap['strafe-left']}]</span>
          </button>
          <button 
            onClick={() => handleMove(1, 0)} 
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            R_Strafe <span className="text-[6px] text-purple-400">[{keyMap['strafe-right'] === ' ' ? 'Space' : keyMap['strafe-right']}]</span>
          </button>
          <button 
            onClick={handleJump} 
            className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            Jump_Ascend <span className="text-[6px] text-cyan-300">[{keyMap['jump'] === ' ' ? 'Space' : keyMap['jump']}]</span>
          </button>
          <button 
            onClick={handleFire} 
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            Fire_PVP <span className="text-[6px] text-rose-300">[{keyMap['fire-weapon'] === ' ' ? 'Space' : keyMap['fire-weapon']}]</span>
          </button>
          <button 
            onClick={handleBuildVoxel} 
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            Voxel_Build <span className="text-[6px] text-amber-300">[{keyMap['build-voxel'] === ' ' ? 'Space' : keyMap['build-voxel']}]</span>
          </button>
          <button 
            onClick={handleWarpDrive} 
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 rounded-lg text-[8px] font-mono uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            Warp <span className="text-[6px] text-purple-300">[{keyMap['warp-drive'] === ' ' ? 'Space' : keyMap['warp-drive']}]</span>
          </button>
        </div>

        {/* Combat and Event Terminal Logs Feed */}
        <div className="flex-1 bg-black/80 border border-white/5 rounded-xl p-3 h-20 overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 text-[8px] font-mono font-black text-white/40 uppercase mb-1 border-b border-white/5 pb-1">
             <Terminal className="w-3 h-3 text-cyan-500" /> Matrix_Runtime_Command_Stdout
          </div>
          <div className="space-y-1.5">
            {logs.map(log => (
              <div key={log.id} className="text-[7px] font-mono flex items-start gap-2 uppercase tracking-wide leading-none">
                <span className="text-white/20">[{log.timestamp}]</span>
                <span className={
                  log.type === 'combat' ? 'text-rose-400 font-black' :
                  log.type === 'build' ? 'text-amber-400' :
                  log.type === 'evolution' ? 'text-purple-400 font-bold' :
                  'text-white/60'
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
