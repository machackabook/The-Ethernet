import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Sliders, Zap, Activity, Info } from 'lucide-react';

interface VoidParams {
  power: number;
  iterations: number;
  glowIntensity: number;
  colorShift: number;
  smoothness: number;
}

export function AnimusVoidCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<VoidParams>({
    power: 8.0,
    iterations: 8,
    glowIntensity: 0.15,
    colorShift: 0.0,
    smoothness: 1.2
  });
  const [showControls, setShowControls] = useState(false);
  const [telemetry, setTelemetry] = useState({ x: 0, y: 0, z: 0 });
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight) },
        u_power: { value: params.power },
        u_iterations: { value: params.iterations },
        u_glow: { value: params.glowIntensity },
        u_colorShift: { value: params.colorShift },
        u_smooth: { value: params.smoothness },
        u_telemetry: { value: new THREE.Vector3(0, 0, 0) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_power;
        uniform int u_iterations;
        uniform float u_glow;
        uniform float u_colorShift;
        uniform float u_smooth;
        uniform vec3 u_telemetry;

        vec3 palette(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263, 0.416, 0.557 + u_colorShift);
          return a + b * cos(6.28318 * (c * t + d));
        }

        float map(vec3 p) {
          vec3 z = p;
          float dr = 1.0;
          float r = 0.0;
          
          for (int i = 0; i < 12; i++) {
            if (i >= u_iterations) break;
            r = length(z);
            if (r > 2.0) break;
            
            float theta = acos(z.y / r) + u_telemetry.x * 0.1;
            float phi = atan(z.x, z.z) + u_telemetry.y * 0.1;
            dr = pow(r, u_power - 1.0) * u_power * dr + 1.0;
            
            float zr = pow(r, u_power);
            z = zr * vec3(sin(theta * u_power) * sin(phi * u_power), cos(theta * u_power), sin(theta * u_power) * cos(phi * u_power));
            z += p;
          }
          return 0.5 * log(r) * r / dr;
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
          vec3 ro = vec3(0.0, 0.0, -3.0 + u_telemetry.z);
          vec3 rd = normalize(vec3(uv, 1.5));
          
          float t = 0.0;
          float glow = 0.0;
          
          for(int i = 0; i < 64; i++) {
            vec3 p = ro + rd * t;
            float d = map(p);
            if(d < 0.001) break;
            t += d;
            glow += exp(-d * u_smooth) * u_glow;
          }

          vec3 color = palette(t * 0.1 + u_time * 0.05) * glow;
          
          // Add telemetry "nodes" pulse
          float pulse = sin(u_time * 2.0 + length(uv) * 10.0) * 0.5 + 0.5;
          color += vec3(0.0, 0.8, 1.0) * pulse * 0.05 * (1.0 - length(uv));

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.u_time.value += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      material.uniforms.u_resolution.value.set(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Update uniforms from params
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_power.value = params.power;
      materialRef.current.uniforms.u_iterations.value = params.iterations;
      materialRef.current.uniforms.u_glow.value = params.glowIntensity;
      materialRef.current.uniforms.u_colorShift.value = params.colorShift;
      materialRef.current.uniforms.u_smooth.value = params.smoothness;
    }
  }, [params]);

  // Listen for global telemetry event
  useEffect(() => {
    const handleTelemetry = (e: any) => {
      const { cpu, net } = e.detail;
      setTelemetry({
        x: (cpu / 100) * 2 - 1,
        y: (net / 100) * 2 - 1,
        z: Math.sin(Date.now() / 1000) * 0.5
      });
      if (materialRef.current) {
        materialRef.current.uniforms.u_telemetry.value.set(
          (cpu / 100) * 2,
          (net / 100) * 2,
          Math.sin(Date.now() / 1000) * 0.2
        );
      }
    };
    window.addEventListener('nexus-telemetry-update', handleTelemetry);
    return () => window.removeEventListener('nexus-telemetry-update', handleTelemetry);
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-sans">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      {/* 1. HUD OVERLAY: ANIMUS VOID STATUS */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
             <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Animus_Void_Core // ACTIVE</span>
          </div>
          <h1 className="text-4xl font-black italic text-white tracking-tighter opacity-80">ETHEREAL_ENGINE_v4</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase">Power_Resonance</span>
              <span className="text-xs font-mono text-cyan-400">{params.power.toFixed(2)}</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase">Core_Iterations</span>
              <span className="text-xs font-mono text-purple-400">{params.iterations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PARAMETER CONTROLS SLIDEOUT */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex gap-4 items-center">
        <button 
          onClick={() => setShowControls(!showControls)}
          className={`p-4 rounded-full border transition-all ${showControls ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black/40 text-white/40 border-white/10 hover:border-cyan-500/50'}`}
        >
          <Sliders className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="w-64 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global_Parameters</span>
                <Zap className="w-3 h-3 text-cyan-400" />
              </div>

              {[
                { label: 'POWER', key: 'power', min: 2, max: 12, step: 0.1 },
                { label: 'ITERATIONS', key: 'iterations', min: 2, max: 12, step: 1 },
                { label: 'GLOW', key: 'glowIntensity', min: 0.05, max: 0.5, step: 0.01 },
                { label: 'COLOR', key: 'colorShift', min: -1, max: 1, step: 0.1 },
                { label: 'SMOOTH', key: 'smoothness', min: 0.5, max: 3, step: 0.1 },
              ].map((ctrl) => (
                <div key={ctrl.key} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] font-bold text-white/60 uppercase">{ctrl.label}</label>
                    <span className="text-[9px] font-mono text-cyan-400">{(params as any)[ctrl.key]}</span>
                  </div>
                  <input 
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={(params as any)[ctrl.key]}
                    onChange={(e) => setParams(prev => ({ ...prev, [ctrl.key]: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. FOURIER TELEMETRY DATA STREAM */}
      <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
        <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-3 min-w-[240px]">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Activity className="w-3 h-3 text-emerald-400" />
                 <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Fourier_Telemetry_Buffer</span>
              </div>
              <span className="text-[7px] font-mono text-emerald-400">SYNC_OK</span>
           </div>
           <div className="h-12 w-full flex items-end gap-1 px-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  className="flex-1 bg-cyan-400/20 border-t border-cyan-400/50"
                />
              ))}
           </div>
           <div className="flex justify-between text-[7px] font-mono text-white/20">
              <span>0.0 Hz</span>
              <span>2.4 GHz</span>
           </div>
        </div>

        <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <Info className="w-3 h-3 text-cyan-400" />
              <span className="text-[8px] font-black text-cyan-400 uppercase">Mandelbulb_Kernel_Engaged</span>
           </div>
           <span className="text-[7px] font-mono text-white/10 uppercase tracking-tighter">Collective_Unconscious_Reversion_Matrix</span>
        </div>
      </div>
    </div>
  );
}
