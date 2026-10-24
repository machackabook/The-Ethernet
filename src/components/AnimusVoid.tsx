import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars, OrbitControls, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, BrainCircuit, Sliders, RefreshCw, Layers, Shield, Eye, Database, Glasses, Compass } from 'lucide-react';

interface FractalEntityProps {
  position: [number, number, number];
  size?: number;
  complexity?: number;
  distortSpeed?: number;
  color?: string;
}

interface XRBinderProps {
  onGlLoaded: (gl: THREE.WebGLRenderer) => void;
  isSimulatedVR: boolean;
}

function XRBinder({ onGlLoaded, isSimulatedVR }: XRBinderProps) {
  const { gl, camera } = useThree();
  
  useEffect(() => {
    if (gl && gl.xr) {
      gl.xr.enabled = true;
    }
    onGlLoaded(gl);
  }, [gl, onGlLoaded]);

  // If simulated VR is active, we animate the camera to orbit slowly for a 360 sweeping immersive experience
  useFrame((state) => {
    if (isSimulatedVR) {
      const time = state.clock.getElapsedTime();
      camera.position.x = Math.sin(time * 0.1) * 14;
      camera.position.z = Math.cos(time * 0.1) * 14;
      camera.position.y = Math.sin(time * 0.05) * 4;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function FractalEntity({ position, size = 1, complexity = 5, distortSpeed = 2, color = "#ff0080" }: FractalEntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, Math.min(Math.max(complexity, 1), 6)]} />
        <MeshDistortMaterial
          color={color}
          speed={distortSpeed}
          distort={0.45}
          radius={1}
          emissive="#200010"
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function DataHologram({ position, label, value }: { position: [number, number, number], label: string, value: string }) {
  return (
    <group position={position}>
      <Text
        color="#00f3ff"
        fontSize={0.22}
        maxWidth={3}
        lineHeight={1.2}
        letterSpacing={0.04}
        textAlign="center"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tMe8Spvp-K_l_to3_668xHdfaV2p.woff"
      >
        {`${label}\n${value}`}
      </Text>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.2, 0.01, 1.2]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

interface NebulaProps {
  color: string;
  density: number;
  particleSize: number;
}

function Nebula({ color, density, particleSize }: NebulaProps) {
  const points = useMemo(() => {
    const p = new Float32Array(8000 * 3);
    for (let i = 0; i < 8000; i++) {
        p[i * 3] = (Math.random() - 0.5) * 50;
        p[i * 3 + 1] = (Math.random() - 0.5) * 50;
        p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, []);

  // Limit rendering count based on density parameter (scale from 1000 to 8000)
  const activeCount = Math.min(Math.max(density, 1000), 8000);
  const activePositions = useMemo(() => {
    return points.slice(0, activeCount * 3);
  }, [points, activeCount]);

  return (
    <Points positions={activePositions}>
      <PointMaterial
        transparent
        color={color}
        size={particleSize}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function AnimusVoid() {
  const [complexity, setComplexity] = useState(() => {
    const saved = localStorage.getItem('animus-void-complexity');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [speed, setSpeed] = useState(() => {
    const saved = localStorage.getItem('animus-void-speed');
    return saved ? parseFloat(saved) : 1;
  });
  
  // High fidelity new parameters
  const [fractalDepth, setFractalDepth] = useState<number>(() => {
    const saved = localStorage.getItem('animus-void-depth');
    return saved ? parseInt(saved) : 3;
  });
  const [nebulaDensity, setNebulaDensity] = useState<number>(4000);
  const [nebulaParticleSize, setNebulaParticleSize] = useState<number>(0.15);
  const [nebulaColor, setNebulaColor] = useState('#8000ff');
  const [distortSpeed, setDistortSpeed] = useState<number>(2.0);
  const [highlightedEntity, setHighlightedEntity] = useState<string | null>(null);

  // WebXR support state and session manager references
  const [xrSupported, setXrSupported] = useState<boolean | null>(null);
  const [isInVR, setIsInVR] = useState(false);
  const [isSimulatedVR, setIsSimulatedVR] = useState(false);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setXrSupported(supported);
      });
    } else {
      setXrSupported(false);
    }
  }, []);

  // AI Interactive Feedback text
  const [aiFeedback, setAiFeedback] = useState('Anima system ready. Adjust void parameters to tune the collective unconscious channels.');
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    localStorage.setItem('animus-void-complexity', complexity.toString());
  }, [complexity]);

  useEffect(() => {
    localStorage.setItem('animus-void-speed', speed.toString());
  }, [speed]);

  useEffect(() => {
    localStorage.setItem('animus-void-depth', fractalDepth.toString());
  }, [fractalDepth]);

  // Handle AI Visual feedback triggers based on adjustments
  const triggerAiFeedback = (paramName: string, valueStr: string, comment: string) => {
    setIsAiThinking(true);
    setTimeout(() => {
      setAiFeedback(`ANIMA // [${paramName}: ${valueStr}] — ${comment}`);
      setIsAiThinking(false);
    }, 300);
  };

  const handleToggleVR = async () => {
    if (isInVR || isSimulatedVR) {
      if (isSimulatedVR) {
        setIsSimulatedVR(false);
        triggerAiFeedback('Immersive_VR', 'OFFLINE', 'Simulated 360-degree virtual space closed. Restoring desktop controls.');
      } else if (glRef.current && glRef.current.xr.isPresenting) {
        const session = glRef.current.xr.getSession();
        if (session) {
          await session.end();
        }
      }
      return;
    }

    if (glRef.current && typeof navigator !== 'undefined' && navigator.xr && xrSupported) {
      try {
        const session = await navigator.xr.requestSession('immersive-vr', {
          optionalFeatures: ['local-floor', 'bounded-floor']
        });
        await glRef.current.xr.setSession(session);
        setIsInVR(true);
        triggerAiFeedback('WebXR_Core', 'TRANSMITTING', 'Synchronized with immersive VR environment. Render pipeline bound.');
        
        session.addEventListener('end', () => {
          setIsInVR(false);
          triggerAiFeedback('WebXR_Core', 'DISCONNECTED', 'Immersive VR session ended by client or device hardware.');
        });
      } catch (err) {
        console.warn('WebXR session initiation rejected, starting simulation fallback', err);
        setIsSimulatedVR(true);
        triggerAiFeedback('Simulated_VR', 'ENGAGED', 'No physical HMD response. Simulated 360 spatial camera orbit initialized.');
      }
    } else {
      setIsSimulatedVR(true);
      triggerAiFeedback('Simulated_VR', 'ENGAGED', 'WebXR not native in host browser. Engaged immersive 360 panorama preview mode.');
    }
  };

  return (
    <div className="w-full h-full bg-black relative rounded-[40px] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <XRBinder onGlLoaded={(gl) => { glRef.current = gl; }} isSimulatedVR={isSimulatedVR} />
        <color attach="background" args={['#020204']} />
        <fog attach="fog" args={['#020204', 10, 25]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00a0" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00f3ff" />

        <Nebula color={nebulaColor} density={nebulaDensity} particleSize={nebulaParticleSize} />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0.5} fade speed={speed} />

        {/* Central Fractal Entity representing user Animus */}
        <FractalEntity 
          position={[0, 0, 0]} 
          size={3.2} 
          complexity={fractalDepth} 
          distortSpeed={distortSpeed}
          color="#ff0070"
        />
        
        {/* Secondary Cosmic Entities */}
        <FractalEntity 
          position={[8, 4, -4]} 
          size={1.6} 
          complexity={Math.max(fractalDepth - 1, 1)} 
          distortSpeed={distortSpeed * 0.8}
          color="#00f3ff"
        />
        
        <FractalEntity 
          position={[-7, -3, -8]} 
          size={2.2} 
          complexity={Math.max(fractalDepth - 2, 1)} 
          distortSpeed={distortSpeed * 1.2}
          color={nebulaColor}
        />

        <DataHologram position={[4, 2.5, 0]} label="NEURAL_LOAD" value={`${Math.round(complexity * 100)}%`} />
        <DataHologram position={[-4.5, 3.5, 1]} label="VOXEL_SYNC" value={speed > 5 ? "HYPER_DRIVE" : "STABLE_OSC"} />
        <DataHologram position={[0.5, -4.5, -1]} label="RECURSION" value={`${fractalDepth}D_VOID`} />

        {!isSimulatedVR && (
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            autoRotate={true} 
            autoRotateSpeed={speed * 0.5} 
          />
        )}
      </Canvas>

      {/* Control Overlay */}
      <div className="absolute top-8 left-8 z-10 space-y-4">
        <div className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          Animus_Void_Parameters
        </div>
        
        <div className="p-6 bg-black/80 backdrop-blur-3xl border border-white/5 rounded-[30px] space-y-5 w-80 shadow-2xl pointer-events-auto">
           {/* Fractal Complexity (Depth) */}
           <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Layers className="w-3 h-3 text-rose-500" /> Fractal_Depth</span>
                <span className="text-rose-500">{fractalDepth}D</span>
              </div>
              <input 
                type="range" 
                min="1" max="6" step="1" 
                value={fractalDepth}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFractalDepth(val);
                  triggerAiFeedback(
                    'Fractal_Depth', 
                    `${val}D`, 
                    val > 4 
                      ? 'Recursion threshold exceeded. Multiversal geometry is collapsing inward.' 
                      : 'Standard geometric vectors established. Spatial stability at optimal state.'
                  );
                }}
                className="w-full h-1 accent-rose-500 bg-white/10 rounded-full appearance-none cursor-pointer" 
              />
           </div>

           {/* Cosmic Distort Speed */}
           <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Sliders className="w-3 h-3 text-cyan-400" /> Entity_Distortion</span>
                <span className="text-cyan-400">{distortSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" max="5.0" step="0.1" 
                value={distortSpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDistortSpeed(val);
                  triggerAiFeedback(
                    'Distortion', 
                    `${val.toFixed(1)}x`, 
                    val > 3.5 
                      ? 'Slight gravitational shear detected. Quantum entities experiencing relativistic decay.' 
                      : 'Distortion wave aligned with default Animus frequency.'
                  );
                }}
                className="w-full h-1 accent-cyan-500 bg-white/10 rounded-full appearance-none cursor-pointer" 
              />
           </div>

           {/* Nebula Appearance - Density & Size */}
           <div className="space-y-4 pt-3 border-t border-white/5">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Nebula_Appearance</span>
              
              <div className="space-y-2">
                 <div className="flex justify-between text-[7px] font-mono text-white/40 uppercase">
                   <span>Dust_Density</span>
                   <span className="text-purple-400">{nebulaDensity} Points</span>
                 </div>
                 <input 
                   type="range" 
                   min="1000" max="8000" step="500" 
                   value={nebulaDensity}
                   onChange={(e) => {
                     const val = parseInt(e.target.value);
                     setNebulaDensity(val);
                     triggerAiFeedback(
                       'Nebula_Density', 
                       `${val} Pts`, 
                       val > 6000 
                         ? 'Deep space cosmic background saturated. Telemetry noise channels amplified.' 
                         : 'Cosmic void clarity maximized. Telemetry throughput stabilized.'
                     );
                   }}
                   className="w-full h-1 accent-purple-500 bg-white/10 rounded-full appearance-none cursor-pointer" 
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-[7px] font-mono text-white/40 uppercase">
                   <span>Particle_Scale</span>
                   <span className="text-purple-400">{nebulaParticleSize.toFixed(2)}</span>
                 </div>
                 <input 
                   type="range" 
                   min="0.05" max="0.4" step="0.01" 
                   value={nebulaParticleSize}
                   onChange={(e) => {
                     const val = parseFloat(e.target.value);
                     setNebulaParticleSize(val);
                     triggerAiFeedback(
                       'Particle_Scale', 
                       `${val.toFixed(2)}`, 
                       'Nebula particulate scattering coefficient modified.'
                     );
                   }}
                   className="w-full h-1 accent-purple-500 bg-white/10 rounded-full appearance-none cursor-pointer" 
                 />
              </div>
           </div>

           {/* Cosmic Entities Highlighting */}
           <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Focus_Cosmic_Node</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Singularity', color: '#ff0070', comment: 'Focusing on central high-mass black hole. Time dilation scaling.' },
                  { name: 'Nebula_Core', color: '#8000ff', comment: 'Targeting cosmic cluster stellar nurseries.' },
                  { name: 'Void_Hole', color: '#00ffff', comment: 'Probing quantum spatial anomalies.' },
                  { name: 'Stellar_Web', color: '#00ff80', comment: 'Tracing gravitational lines of the collective unconscious.' }
                ].map(entity => (
                  <button 
                    key={entity.name}
                    onClick={() => {
                      setHighlightedEntity(entity.name);
                      setNebulaColor(entity.color);
                      triggerAiFeedback('Focus_Target', entity.name.toUpperCase(), entity.comment);
                    }}
                    className={`py-2 px-3 rounded-xl text-[7px] font-bold uppercase transition-all border ${highlightedEntity === entity.name ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                  >
                    {entity.name.replace('_', ' ')}
                  </button>
                ))}
              </div>
           </div>

            {/* WebXR Immersive Transition Module */}
            <div className="pt-3 border-t border-white/5 space-y-2">
               <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">WebXR_Immersive_Core</span>
               <button 
                 onClick={handleToggleVR}
                 className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                   isInVR || isSimulatedVR 
                     ? 'bg-rose-500 text-white animate-pulse' 
                     : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:scale-102 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                 }`}
               >
                 <Glasses className="w-4 h-4" />
                 {isInVR ? 'Exit_VR_Environment' : isSimulatedVR ? 'Exit_Simulated_360_VR' : 'Transition_to_360_VR'}
               </button>
               <div className="flex justify-between items-center px-1 text-[7px] font-mono text-white/30 uppercase pb-2">
                  <span>Hardware Link:</span>
                  <span className={xrSupported ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                     {xrSupported === null ? 'Scanning...' : xrSupported ? 'Device Ready (HMD)' : 'Simulated Sandbox'}
                  </span>
               </div>
            </div>

           <div className="pt-3 border-t border-white/5 flex gap-2">
              <button 
                onClick={() => {
                  setComplexity(0.5);
                  setSpeed(1);
                  setFractalDepth(3);
                  setNebulaDensity(4000);
                  setNebulaParticleSize(0.15);
                  setNebulaColor('#8000ff');
                  setDistortSpeed(2.0);
                  setHighlightedEntity(null);
                  setAiFeedback('Anima system recalibrated to baseline. Spatial orientation restored.');
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Reset_Oscillation
              </button>
           </div>
        </div>
      </div>

      {/* Realtime AI Cognitive Feedback Panel */}
      <div className="absolute bottom-8 right-8 z-10 w-96 pointer-events-auto">
        <div className="glass-card p-6 rounded-[30px] border border-white/10 flex gap-4 items-start shadow-2xl relative overflow-hidden backdrop-blur-3xl">
           <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
           <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl shrink-0">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
           </div>
           <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                 <span className="text-[8px] font-mono text-rose-400 uppercase tracking-widest font-black flex items-center gap-2">
                    Anima_AI_Resonance_Core
                 </span>
                 {isAiThinking && (
                    <span className="text-[7px] font-mono text-white/30 uppercase animate-pulse">Syncing...</span>
                 )}
              </div>
              <p className="text-[9px] font-mono text-white/80 leading-relaxed uppercase">
                 {aiFeedback}
              </p>
           </div>
        </div>
      </div>

      {/* Decorative HUD */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-black italic text-white tracking-tighter uppercase leading-none">V-874_VOID</span>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mt-1">Deep_Space_Reconnaissance</span>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col gap-1">
            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
               <motion.div className="h-full bg-rose-500" animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 4 }} />
            </div>
            <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
               <motion.div className="h-full bg-cyan-500" animate={{ x: [100, -100] }} transition={{ repeat: Infinity, duration: 3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Immersive VR Screen Mask Overlay */}
      <AnimatePresence>
        {(isInVR || isSimulatedVR) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-12 bg-black/10 backdrop-blur-[1px]"
          >
            {/* Cinematic Headset Vignette & Scanning Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.85))] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-25" />

            {/* Top HUD Bar */}
            <div className="flex justify-between items-start w-full relative z-40">
              <div className="space-y-1 bg-black/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-mono text-rose-500 tracking-widest font-black uppercase">
                    {isInVR ? 'IMMERSIVE_HMD_LINK_ONLINE' : 'SIMULATED_360_PERSPECTIVE_ACTIVE'}
                  </span>
                </div>
                <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  FPS: 90.00 // LATENCY: 4.1MS // SECTOR: VOID_RECURSION_TRANSIT
                </div>
              </div>

              {/* Exit Button - Interactive (pointer-events-auto) */}
              <button
                onClick={handleToggleVR}
                className="pointer-events-auto px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center gap-2.5 shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} /> Exit_Immersive_Space
              </button>
            </div>

            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none opacity-80">
              <div className="w-16 h-16 border border-dashed border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute w-28 h-28 border border-white/5 rounded-full" />
              <div className="absolute w-2 h-2 bg-rose-500 rounded-full" />
              <div className="absolute -top-8 text-[7px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Target_Sync_Lock</div>
            </div>

            {/* Bottom Telemetry readouts */}
            <div className="flex justify-between items-end w-full relative z-40">
              <div className="space-y-1 bg-black/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md text-[8px] font-mono text-white/40 uppercase leading-relaxed">
                <div className="text-cyan-400">TELEMETRY_STREAM: CONNECTED</div>
                <div>YAW: {(Math.sin(Date.now() / 2000) * 35).toFixed(2)}°</div>
                <div>PITCH: {(Math.cos(Date.now() / 2000) * 20).toFixed(2)}°</div>
              </div>

              <div className="text-right space-y-1 bg-black/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md text-[8px] font-mono text-white/40 uppercase leading-relaxed">
                <div className="text-rose-400 font-bold">RECURSION_LEVEL: {fractalDepth}D</div>
                <div>NEBULA_DENSITY: {nebulaDensity} PTS</div>
                <div>PARTICLE_SCALE: {nebulaParticleSize.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
