import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const InteractiveFractalEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isBypassed, setIsBypassed] = useState(false);
  const [targetURL, setTargetURL] = useState('https://wikipedia.org');
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Tracks real-time mouse drift matrix for mathematical mutations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Custom raymarching shader configured for cyan, violet, and true proxy portal calculations
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight) },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_portalOpen: { value: 0.0 }
      },
      vertexShader: `
        void main() { gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_portalOpen;

        float map(vec3 p) {
          vec3 z = p;
          float dr = 1.0;
          float r = 0.0;
          float power = 5.0 + sin(u_time * 0.05) * 1.5;
          
          for (int i = 0; i < 6; i++) {
            r = length(z);
            if (r > 2.0) break;
            
            float theta = acos(z.y / r) + u_mouse.y * 0.2;
            float phi = atan(z.x, z.z) + u_mouse.x * 0.2;
            dr = pow(r, power - 1.0) * power * dr + 1.0;
            
            float zr = pow(r, power);
            z = zr * vec3(sin(theta * power) * sin(phi * power), cos(theta * power), sin(theta * power) * cos(phi * power));
            z += p;
          }
          return 0.5 * log(r) * r / dr;
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
          vec3 ro = vec3(0.0, 0.0, -2.5);
          vec3 rd = normalize(vec3(uv, 1.0));
          
          float t = 0.0;
          float glow = 0.0;
          
          for(int i = 0; i < 48; i++) {
            vec3 p = ro + rd * t;
            float d = map(p);
            if(d < 0.001) break;
            t += d;
            glow += exp(-d * 1.5) * 0.04;
          }

          // Slowly shifting dynamic elemental hue shifts (Cyan and Deep Space Violet)
          float cycle = u_time * 0.02;
          vec3 cyan = vec3(0.0, 0.9, 1.0) * (0.6 + 0.4 * sin(cycle));
          vec3 spaceViolet = vec3(0.28, 0.0, 0.61) * (0.6 + 0.4 * cos(cycle + 1.5));
          
          // Portal visualization ripple effect overlay
          float distFromCenter = length(uv);
          float portalGate = smoothstep(0.4, 0.0, abs(distFromCenter - u_portalOpen * 0.5));
          vec3 portalColor = vec3(1.0, 0.4, 0.0) * portalGate * 2.0;

          vec3 baseFractal = mix(cyan, spaceViolet, sin(uv.y + cycle) * 0.5 + 0.5) * glow;
          gl_FragColor = vec4(baseFractal + portalColor, 1.0);
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

    return () => {
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync uniform coordinates with react states during runtime interaction loop
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_mouse.value.set(mouse.x, mouse.y);
    }
  }, [mouse]);

  // Activates animated portal bypass transition sequence
  const executePortalBypass = () => {
    if (!materialRef.current) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (materialRef.current) materialRef.current.uniforms.u_portalOpen.value = progress;
      if (progress >= 1.0) {
        clearInterval(interval);
        setIsBypassed(true);
      }
    }, 30);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }} onMouseMove={handleMouseMove}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Authentication & Portal Activation Overlay */}
      {!isBypassed ? (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', background: 'rgba(10,5,25,0.75)', padding: '30px', borderRadius: '16px', border: '1px solid #00f0ff', boxShadow: '0 0 20px #47009c', pointerEvents: 'auto', zIndex: 10 }}>
          <h2 style={{ color: '#00f0ff', marginBottom: '20px', fontFamily: 'monospace' }}>NEXUS_GATE ACCESS REQUIRED</h2>
          <button onClick={executePortalBypass} style={{ background: 'linear-gradient(45deg, #47009c, #00f0ff)', border: 'none', padding: '12px 30px', color: '#fff', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 0 15px #00f0ff' }}>
            ACTIVATE PORTAL BYPASS
          </button>
        </div>
      ) : (
        /* Integrated Live Sub-System Browser Frame */
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%', background: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 40px rgba(0,240,255,0.5)', zIndex: 20 }}>
          <div style={{ background: '#222', padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#00f0ff', fontFamily: 'monospace', fontSize: '12px' }}>PROXY_BROWSER://</span>
            <input type="text" value={targetURL} onChange={(e) => setTargetURL(e.target.value)} style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: 'none' }} />
            <button onClick={() => setIsBypassed(false)} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>Disconnect</button>
          </div>
          <iframe src={targetURL} title="True Web Portal" style={{ flex: 1, border: 'none' }} sandbox="allow-scripts allow-same-origin allow-forms" />
        </div>
      )}
    </div>
  );
};
