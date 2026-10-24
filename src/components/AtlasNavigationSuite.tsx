import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Map as MapIcon, Crosshair, Navigation, Info, Zap, Shield, Target, Satellite, Radio, MousePointer2, X, Activity, Atom, Database } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, PerspectiveCamera, Float, Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Volumetric Nebula Shader ---
const NebulaShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#f43f5e') },
    uNoiseScale: { value: 2.0 },
    uOpacity: { value: 0.15 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uNoiseScale;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vPosition;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.13, 0.1, 0.11));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                     mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                     mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
    }

    void main() {
      float n = noise(vPosition * uNoiseScale + uTime * 0.1);
      float alpha = smoothstep(0.4, 0.6, n) * uOpacity;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

interface BodyDetails {
  name: string;
  color: string;
  size: number;
  pos: [number, number, number];
  composition: string;
  stellarClass: string;
  temperature: string;
  mass: string;
}

function CelestialBody({ 
  body, 
  onSelect 
}: { 
  body: BodyDetails, 
  onSelect: (body: BodyDetails) => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <Float speed={2} rotationIntensity={hovered ? 2 : 1} floatIntensity={1}>
      <group position={body.pos}>
        <Sphere 
          args={[body.size, 64, 64]} 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(body);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={body.color}
            speed={hovered ? 4 : 2}
            distort={hovered ? 0.6 : 0.4}
            radius={1}
            emissive={body.color}
            emissiveIntensity={hovered ? 4 : 2}
          />
        </Sphere>
        {/* Volumetric Aura */}
        <Sphere args={[body.size * 1.5, 32, 32]}>
          <shaderMaterial
            ref={materialRef}
            attach="material"
            args={[NebulaShader]}
            transparent
            side={THREE.BackSide}
            uniforms={{
              ...NebulaShader.uniforms,
              uColor: { value: new THREE.Color(body.color) },
              uNoiseScale: { value: hovered ? 2.5 : 1.5 }
            }}
          />
        </Sphere>
        <Text
          position={[0, -body.size - 0.5, 0]}
          fontSize={0.2}
          color="white"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6nu21tu_igv.woff2"
          anchorX="center"
          anchorY="middle"
        >
          {body.name}
        </Text>
      </group>
    </Float>
  );
}

export function AtlasNavigationSuite() {
  const [activeZone, setActiveZone] = useState('SOLAR_SYSTEM');
  const [isWarping, setIsWarping] = useState(false);
  const [telemetry, setTelemetry] = useState({ x: 124.5, y: -89.2, z: 2.13 });
  const [selectedBody, setSelectedBody] = useState<BodyDetails | null>(null);

  const zones = useMemo(() => [
    { id: 'SOLAR_SYSTEM', name: 'SOLAR_STATIC_01', color: '#f43f5e', coords: { x: 0, y: 0, z: 0 }, bodies: [
      { 
        name: 'HELIOS_CORE', color: '#fbbf24', size: 2, pos: [0, 0, 0],
        composition: '98% Plasma, 2% Noble Gases', stellarClass: 'G2V_STABLE',
        temperature: '5,778 K', mass: '1.989 × 10³⁰ kg'
      },
      { 
        name: 'TERRA_ALPHA', color: '#10b981', size: 0.8, pos: [5, 0, 0],
        composition: 'Silicate Rocks, Liquid Iron Core', stellarClass: 'TERRESTRIAL',
        temperature: '288 K', mass: '5.972 × 10²⁴ kg'
      },
    ]},
    { id: 'NEBULA_M42', name: 'ORION_NEBULA_M42', color: '#8b5cf6', coords: { x: 450.2, y: 12.5, z: -88.1 }, bodies: [
      { 
        name: 'STELLAR_CRADLE', color: '#a78bfa', size: 3, pos: [0, 2, 0],
        composition: 'Ionized Hydrogen, Helium', stellarClass: 'PROTO_STAR_CLUSTER',
        temperature: '10,000 K', mass: '2,000 Mo'
      },
      { 
        name: 'ION_STORM', color: '#6366f1', size: 1.5, pos: [-4, -1, 2],
        composition: 'High-Energy Particulates', stellarClass: 'ELECTROMAGNETIC_ANOMALY',
        temperature: '1.2M K', mass: 'NEGLIGIBLE'
      },
    ]},
    { id: 'VOID_CORE', name: 'ANIMUS_VOID_CORE', color: '#06b6d4', coords: { x: 999.9, y: 999.9, z: 999.9 }, bodies: [
      { 
        name: 'BLACK_HOLE_v1', color: '#ffffff', size: 4, pos: [0, 0, 0],
        composition: 'SINGULARITY / UNKNOWN', stellarClass: 'SUPERMASSIVE_VOID',
        temperature: '0 K (Theoretical)', mass: '4.1M Mo'
      },
    ]},
    { id: 'HUBBLE_DEEP', name: 'HUBBLE_DEEP_FIELD', color: '#f59e0b', coords: { x: -1420.4, y: 560.1, z: 12.0 }, bodies: [
      { 
        name: 'GALAXY_CLUSTER_A', color: '#fbbf24', size: 5, pos: [0, 10, -20],
        composition: 'Dark Matter, Gas, Dust', stellarClass: 'GALACTIC_SUPERSTRUCTURE',
        temperature: 'VARIES', mass: '10¹⁴ Mo'
      },
    ]},
  ], []);

  const triggerWarp = (zone: any) => {
    setIsWarping(true);
    setSelectedBody(null);
    
    // Sync exploration XP to global universe state
    const saved = localStorage.getItem('nexus_universe_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        state.xp = state.xp + 150;
        if (state.xp >= 1000) {
          state.xp -= 1000;
          state.level += 1;
        }
        localStorage.setItem('nexus_universe_state', JSON.stringify(state));
      } catch (e) {
        console.error('Failed to sync exploration XP', e);
      }
    }

    setTimeout(() => {
      setActiveZone(zone.id);
      setTelemetry(zone.coords);
      setIsWarping(false);
    }, 1500);
  };

  const currentZone = zones.find(z => z.id === activeZone);

  return (
    <div className="w-full h-full bg-[#050508] text-white flex flex-col font-sans overflow-hidden">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur z-20">
        <div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase text-rose-500">Atlas_Nav_Suite_v10</h1>
           <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Synaptic Spacetime Mapping</span>
              <div className="h-px w-20 bg-rose-500/30" />
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_5px_#f43f5e]" />
                 <span className="text-[9px] font-mono text-rose-500 uppercase tracking-widest italic">Hubble_Telemetry_Link: ACTIVE</span>
              </div>
           </div>
        </div>
        <div className="flex gap-4">
           {zones.map(zone => (
             <button 
               key={zone.id}
               onClick={() => triggerWarp(zone)}
               className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${activeZone === zone.id ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
             >
               {zone.id}
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 relative">
         <AnimatePresence>
            {isWarping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black flex items-center justify-center"
              >
                 <div className="flex flex-col items-center gap-8">
                    <div className="relative w-32 h-32">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                         className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full shadow-[0_0_30px_#f43f5e]"
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="w-12 h-12 text-rose-500 animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center">
                       <div className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Engaging Hyperdrive</div>
                       <div className="text-[10px] font-mono text-rose-500/60 uppercase tracking-[0.5em]">Tearing Spacetime Shroud...</div>
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>

         <div className="absolute inset-0 z-0">
            <Canvas dpr={[1, 2]}>
               <PerspectiveCamera makeDefault position={[0, 5, 15]} />
               <color attach="background" args={['#050508']} />
               <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
               <ambientLight intensity={0.5} />
               <pointLight position={[10, 10, 10]} intensity={1.5} color={currentZone?.color} />
               
               {currentZone?.bodies.map((body, i) => (
                 <CelestialBody 
                   key={i}
                   body={body as any}
                   onSelect={setSelectedBody}
                 />
               ))}

               <OrbitControls 
                 enableZoom={true} 
                 enablePan={true} 
                 maxDistance={100}
                 minDistance={2}
                 autoRotate={!isWarping && !selectedBody}
                 autoRotateSpeed={0.5}
               />
            </Canvas>
         </div>

         {/* Navigation Hints */}
         <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2 bg-black/40 border border-white/5 rounded-full backdrop-blur pointer-events-none z-10 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            <div className="flex items-center gap-2"><MousePointer2 className="w-3 h-3" /> Orbit</div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">SCROLL: Zoom</div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">SHIFT + DRAG: Pan</div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">CLICK: Select Body</div>
         </div>

         {/* 3D HUD Interface */}
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-full h-full p-12 flex justify-between items-end z-10">
               {/* Left HUD Panel */}
               <div className="w-80 bg-black/60 border border-white/10 rounded-[30px] p-6 backdrop-blur-3xl pointer-events-auto">
                  <div className="flex items-center gap-3 mb-6">
                     <Target className="w-5 h-5 text-rose-500" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-white">Target_Vector_Analysis</h3>
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: 'Coordinate_X', value: telemetry.x.toFixed(4) },
                       { label: 'Coordinate_Y', value: telemetry.y.toFixed(4) },
                       { label: 'Coordinate_Z', value: telemetry.z.toFixed(4) },
                       { label: 'Spectral_Shift', value: '0.0014nm/s' },
                       { label: 'Stellar_Class', value: activeZone === 'SOLAR_SYSTEM' ? 'G2V_STABLE' : 'VOID_TYPE_NULL' },
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase">{item.label}</span>
                          <span className="text-[9px] font-mono text-rose-400 font-bold">{item.value}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Center Reticle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-rose-500/10 rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 border-2 border-rose-500/20 rounded-full flex items-center justify-center animate-pulse">
                     <div className="w-4 h-4 bg-rose-500/60 rounded-full shadow-[0_0_20px_#f43f5e]" />
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                       className="absolute inset-0 flex justify-center"
                     >
                        <div className="w-0.5 h-1/2 bg-gradient-to-b from-rose-500 to-transparent" />
                     </motion.div>
                  </div>
               </div>

               {/* Right Side: Selected Body Panel OR Satellite Info */}
               <AnimatePresence mode="wait">
                  {selectedBody ? (
                    <motion.div 
                      key="body-panel"
                      initial={{ x: 400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 400, opacity: 0 }}
                      className="w-96 bg-black/80 border border-rose-500/30 rounded-[40px] p-8 backdrop-blur-3xl pointer-events-auto relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-6">
                          <button onClick={() => setSelectedBody(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                             <X className="w-4 h-4" />
                          </button>
                       </div>
                       
                       <div className="mb-8">
                          <div className="text-[10px] font-mono text-rose-500 uppercase tracking-[0.4em] mb-2 italic">Stellar_Probe_Data</div>
                          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{selectedBody.name}</h2>
                       </div>

                       <div className="space-y-6">
                          <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                             <div className="flex items-center gap-3 mb-2 text-rose-400">
                                <Activity className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Composition_Breakdown</span>
                             </div>
                             <p className="text-xs font-mono text-white/60 leading-relaxed font-black">{selectedBody.composition}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             {[
                               { label: 'Stellar_Type', value: selectedBody.stellarClass, icon: <StarIcon className="w-3 h-3" /> },
                               { label: 'Avg_Temp', value: selectedBody.temperature, icon: <Thermometer className="w-3 h-3" /> },
                               { label: 'Calc_Mass', value: selectedBody.mass, icon: <Atom className="w-3 h-3" /> },
                               { label: 'Stability', value: 'OPTIMAL', icon: <Database className="w-3 h-3" /> },
                             ].map((item, i) => (
                               <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                  <div className="text-[8px] font-mono text-white/20 uppercase mb-2">
                                     <div className="flex items-center gap-2">{item.icon} {item.label}</div>
                                  </div>
                                  <div className="text-[10px] font-black text-white">{item.value}</div>
                               </div>
                             ))}
                          </div>

                          <button className="w-full py-4 bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                             Begin_Exo_Probe_Launch
                          </button>
                       </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="telemetry-panel"
                      initial={{ x: 400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 400, opacity: 0 }}
                      className="w-80 bg-black/60 border border-white/10 rounded-[30px] p-6 backdrop-blur-3xl pointer-events-auto"
                    >
                       <div className="flex items-center gap-3 mb-6">
                          <Satellite className="w-5 h-5 text-rose-500" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-white">Satellite_Telemetry</h3>
                       </div>
                       <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-mono mb-4 text-rose-500">
                             <span>LIVE_FEED: ACTIVE</span>
                             <span>BW: 1.2 PB/S</span>
                          </div>
                          <div className="h-40 bg-white/5 rounded-2xl overflow-hidden relative">
                             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(244,63,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                             <motion.div 
                               animate={{ x: [-100, 100] }} 
                               transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                               className="absolute w-1 h-full bg-rose-500/40 shadow-[0_0_10px_#f43f5e]" 
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Globe className="w-16 h-16 text-rose-500/20 animate-[spin_20s_linear_infinite]" />
                             </div>
                          </div>
                          <div className="mt-6">
                             <button className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                                Recalibrate_Astro_Mesh <Radio className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Thermometer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

