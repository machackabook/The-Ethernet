import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const FractalEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // WebGL2 Setup for Custom Fractal Raymarching
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Custom Fractal Morphing Raymarcher Shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight) },
        u_morph: { value: 0.5 }, // Controls Mandelbrot to Julia planetary transition
        u_glow: { value: 1.2 }   // Holographic luminescence factor
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_morph;
        uniform float u_glow;

        // Quaternionic Julia/Mandelbrot morphing function for planetary terrain
        float map(vec3 p) {
          vec3 z = p;
          float dr = 1.0;
          float r = 0.0;
          float power = 4.0 + sin(u_time * 0.1) * 2.0; // Dynamic evolutionary scaling
          
          for (int i = 0; i < 7; i++) {
            r = length(z);
            if (r > 2.0) break;
            
            // Convert to polar coordinates
            float theta = acos(z.y / r);
            float phi = atan(z.x, z.z);
            dr = pow(r, power - 1.0) * power * dr + 1.0;
            
            // Scale and rotate to generate StarCraft/Halo planetary megastructures
            float zr = pow(r, power);
            theta = theta * power;
            phi = phi * power;
            
            // Morph between Mandelbrot sets and Julia variations
            z = zr * vec3(sin(theta)*sin(phi), cos(theta), sin(theta)*cos(phi));
            z += mix(p, vec3(-0.4, 0.6, 0.0), u_morph); 
          }
          return 0.5 * log(r) * r / dr;
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
          vec3 ro = vec3(0.0, 0.0, -3.0); // Ray origin
          vec3 rd = normalize(vec3(uv, 1.0)); // Ray direction
          
          float t = 0.0;
          int maxSteps = 64;
          float glow = 0.0;

          for(int i = 0; i < maxSteps; i++) {
            vec3 p = ro + rd * t;
            float d = map(p);
            if(d < 0.001) break;
            t += d;
            glow += exp(-d * u_glow) * 0.05; // Holographic energy emission fields
            if(t > 8.0) break;
          }

          // Scanline processing overlay for 500% AR/VR projection look
          float scanline = sin(gl_FragCoord.y * 2.0 + u_time * 5.0) * 0.04;
          vec3 finalColor = vec3(0.0, 0.7, 1.0) * glow + vec3(scanline);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

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

  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />;
};
