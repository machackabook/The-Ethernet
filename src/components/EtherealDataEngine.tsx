import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, Stars, Text, Float as FloatDrei } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, Zap, Radio, Database, Terminal, Settings, Sliders, Layers } from 'lucide-react';

// --- Fourier Representation Shader ---
const FourierWaveShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#22d3ee') },
    uFrequency: { value: 2.0 },
    uAmplitude: { value: 0.5 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Multi-dimensional Fourier Sum approximation
      float elevation = sin(pos.x * uFrequency + uTime) * uAmplitude;
      elevation += sin(pos.y * uFrequency * 0.5 + uTime * 1.5) * uAmplitude * 0.5;
      elevation += sin((pos.x + pos.y) * uFrequency * 0.25 + uTime * 0.5) * uAmplitude * 0.25;
      
      pos.z += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float strength = vElevation * 0.5 + 0.5;
      vec3 finalColor = mix(vec3(0.0, 0.05, 0.1), uColor, strength);
      gl_FragColor = vec4(finalColor, 0.8);
    }
  `
};

function TorusKnotIsohodecadron({ fractalScale = 1, complexity = 2 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[3 * fractalScale, 1 * complexity, 128, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#f43f5e"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#f43f5e"
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function FourierPlane({ frequency = 2, amplitude = 0.5 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uFrequency.value = frequency;
      materialRef.current.uniforms.uAmplitude.value = amplitude;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[20, 20, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[FourierWaveShader]}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// --- Main Engine Component ---
export function EtherealDataEngine() {
  const [params, setParams] = useState({
    fractalScale: 1.0,
    complexity: 2,
    fourierFreq: 2.0,
    amplitude: 0.5
  });

  const [activeLayer, setActiveLayer] = useState<'VISUAL' | 'TELEMETRY' | 'MATRIX'>('VISUAL');

  return (
    <div className="w-full h-full bg-[#050508] text-white flex font-sans overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-8 z-10">
         <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-rose-500 uppercase">Aether_Vis_Engine</h1>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1">Multi-Dimensional Data Synthesis</p>
         </div>

         <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Fractal_Params</span>
                  <Settings className="w-3 h-3 text-rose-400" />
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                        <span>Iso-Scale</span>
                        <span>{params.fractalScale.toFixed(2)}</span>
                     </div>
                     <input 
                        type="range" min="0.5" max="3" step="0.1" 
                        value={params.fractalScale}
                        onChange={(e) => setParams(p => ({ ...p, fractalScale: parseFloat(e.target.value) }))}
                        className="w-full accent-rose-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                        <span>Complexity_Nodes</span>
                        <span>{params.complexity}</span>
                     </div>
                     <input 
                        type="range" min="1" max="10" step="1" 
                        value={params.complexity}
                        onChange={(e) => setParams(p => ({ ...p, complexity: parseInt(e.target.value) }))}
                        className="w-full accent-rose-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Fourier_Sync</span>
                  <Sliders className="w-3 h-3 text-cyan-400" />
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                        <span>Wave_Freq</span>
                        <span>{params.fourierFreq.toFixed(2)} Hz</span>
                     </div>
                     <input 
                        type="range" min="0.1" max="5" step="0.1" 
                        value={params.fourierFreq}
                        onChange={(e) => setParams(p => ({ ...p, fourierFreq: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                        <span>Signal_Amp</span>
                        <span>{params.amplitude.toFixed(2)}</span>
                     </div>
                     <input 
                        type="range" min="0.1" max="2" step="0.1" 
                        value={params.amplitude}
                        onChange={(e) => setParams(p => ({ ...p, amplitude: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-2">Engine_Layers</h3>
            {[
               { id: 'VISUAL', label: 'Ethereal_Render', icon: <Layers className="w-3 h-3" />, color: 'text-rose-400' },
               { id: 'TELEMETRY', label: 'Fourier_Matrix', icon: <Radio className="w-3 h-3" />, color: 'text-cyan-400' },
               { id: 'MATRIX', label: 'Collective_Unconscious', icon: <Database className="w-3 h-3" />, color: 'text-emerald-400' },
            ].map(layer => (
               <button 
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${activeLayer === layer.id ? 'bg-white/5 border-white/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
               >
                  <div className={layer.color}>{layer.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{layer.label}</span>
               </button>
            ))}
         </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative">
         <div className="absolute inset-0">
            <Canvas>
               <PerspectiveCamera makeDefault position={[0, 5, 20]} />
               <color attach="background" args={['#050508']} />
               <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
               <ambientLight intensity={0.5} />
               <pointLight position={[10, 10, 10]} intensity={2} color="#f43f5e" />
               <pointLight position={[-10, 10, -10]} intensity={2} color="#22d3ee" />

               <TorusKnotIsohodecadron fractalScale={params.fractalScale} complexity={params.complexity} />
               <FourierPlane frequency={params.fourierFreq} amplitude={params.amplitude} />

               <OrbitControls enableZoom={true} enablePan={true} maxDistance={50} minDistance={5} />
            </Canvas>
         </div>

         {/* HUD Overlay */}
         <div className="absolute top-8 left-8 p-6 bg-black/40 border border-white/5 rounded-[30px] backdrop-blur-xl pointer-events-none z-10 min-w-64">
            <div className="flex items-center gap-3 mb-4">
               <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
               <div className="text-[10px] font-black uppercase tracking-widest">Collective_Sync_Status</div>
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase mb-1">
                     <span>Neural_Integration</span>
                     <span>94.2%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div animate={{ width: '94.2%' }} className="h-full bg-rose-500" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase mb-1">
                     <span>Unconscious_Buffer</span>
                     <span>62.1%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div animate={{ width: '62.1%' }} className="h-full bg-cyan-400" />
                  </div>
               </div>
            </div>
         </div>

         {/* Top-Right Telemetry */}
         <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-10">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl text-right">
               <div className="text-[8px] font-mono text-white/20 uppercase italic">Active_Spacetime_Mesh</div>
               <div className="text-sm font-black text-white mt-1">ISO_KNOT_V4.28</div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl text-right">
               <div className="text-[8px] font-mono text-white/20 uppercase italic">Fourier_Decomposition</div>
               <div className="text-sm font-black text-cyan-400 mt-1">SINE_WAVE_ALPHA_STABLE</div>
            </div>
         </div>

         {/* Bottom Logs */}
         <div className="absolute bottom-8 left-8 right-8 h-32 bg-black/40 border border-white/5 rounded-[30px] backdrop-blur-xl p-6 flex flex-col gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/60">
               <Terminal className="w-3 h-3" /> System_Logs
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[9px] text-white/30 space-y-1">
               <div className="flex gap-4">
                  <span className="text-rose-500">[ENGINE]</span>
                  <span>Parameters synchronized with Collective Unconscious.</span>
               </div>
               <div className="flex gap-4">
                  <span className="text-cyan-400">[FOURIER]</span>
                  <span>Decomposing telemetry into harmonic sine representations.</span>
               </div>
               <div className="flex gap-4">
                  <span className="text-emerald-400">[SYNC]</span>
                  <span>Neural bridge optimized for multi-dimensional rendering.</span>
               </div>
               <div className="flex gap-4">
                  <span className="text-white/20">[CORE]</span>
                  <span>Isohodecadron mesh generated at grid coordinates [12, -4, 8].</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
