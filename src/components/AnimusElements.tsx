import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

export function CoreAnimus() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const streamRef = useRef(0);
  const [isHologram, setIsHologram] = useState(false);

  useEffect(() => {
    const handleTelemetry = (e: any) => {
      if (!e || !e.detail) return;
      if (e.detail.type === 'STREAM_PROGRESS') {
        streamRef.current = (e.detail.progress || 0) / 100;
      } else if (e.detail.type === 'STREAM_COMPLETE') {
        streamRef.current = 1;
        setTimeout(() => { streamRef.current = 0; }, 3000);
      } else if (e.detail.type === 'HOLOGRAM_TOGGLE') {
        setIsHologram(!!e.detail.active);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('nexus-telemetry', handleTelemetry);
      return () => window.removeEventListener('nexus-telemetry', handleTelemetry);
    }
  }, []);

  useFrame((state, delta) => {
    const speed = 1 + streamRef.current * 5;
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1 * speed;
      meshRef.current.rotation.y += delta * 0.2 * speed;
    }
    
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.1 * speed;
      pointsRef.current.rotation.y += delta * 0.2 * speed;
      
      // Heartbeat pulse for neural points
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      pointsRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        {/* Data-Blue Wireframe Mesh */}
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[10, 2.5, 200, 32]} />
          <meshBasicMaterial 
            color={isHologram ? "#ffffff" : "#00bfff"} 
            wireframe 
            transparent 
            opacity={isHologram ? 0.8 : 0.35} 
          />
        </mesh>

        {/* Void-Orange Neural Pulses (Particles) */}
        <points ref={pointsRef}>
          <torusKnotGeometry args={[10, 2.5, 200, 32]} />
          <pointsMaterial 
            color={isHologram ? "#00ffff" : "#ff6a00"} 
            size={0.2} 
            transparent 
            opacity={0.8}
            sizeAttenuation={true}
          />
        </points>

        {/* Central Core Glow */}
        <pointLight color={isHologram ? "#ffffff" : "#00bfff"} intensity={isHologram ? 10 : 2} distance={30} />
      </group>
    </Float>
  );
}

export function TesseractGuardian() {
  const outerCube = useRef<THREE.Mesh>(null);
  const innerCube = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
    pos: [Math.sin(i) * 3, Math.cos(i) * 3, Math.sin(i * 1.5) * 3] as [number, number, number]
  })), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.x = time * 0.15;
      group.current.rotation.y = time * 0.2;
    }
    if (innerCube.current && outerCube.current) {
      innerCube.current.rotation.x = -time * 0.3;
      innerCube.current.rotation.y = -time * 0.1;
      outerCube.current.rotation.y = time * 0.1;
      outerCube.current.rotation.z = time * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        {/* Outer Tesseract Shell */}
        <mesh ref={outerCube}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.4} />
        </mesh>
        
        {/* Inner Tesseract Core */}
        <mesh ref={innerCube}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#a855f7" wireframe transparent opacity={0.6} />
        </mesh>
        
      {/* Crystal Data Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2}>
          <mesh position={node.pos}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
          </mesh>
        </Float>
      ))}

        {/* Core Eyes: The Guardian of 42m Nebula */}
        <group position={[0, 0, 0]}>
          {/* Light Eye: Cosmic Guardians (Horus) */}
          <group position={[-0.8, 0, 0.5]}>
            <mesh>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={5} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.45, 0.02, 16, 100]} />
              <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
            </mesh>
            <pointLight color="#00ffff" intensity={4} distance={10} />
          </group>
          
          {/* Dark Eye: Angeldaemons (Ra) */}
          <group position={[0.8, 0, 0.5]}>
            <mesh>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color="#050505" emissive="#4b0082" emissiveIntensity={3} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.45, 0.02, 16, 100]} />
              <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
            </mesh>
            <pointLight color="#8b00ff" intensity={5} distance={10} />
          </group>

          {/* Central Void Core */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshBasicMaterial color="#ffffff" />
            <pointLight color="#ffffff" intensity={10} distance={5} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export function DataLattice({ count = 50000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const streamRef = useRef(0);
  const [isHologram, setIsHologram] = useState(false);
  
  useEffect(() => {
    const handleTelemetry = (e: any) => {
      if (!e || !e.detail) return;
      if (e.detail.type === 'STREAM_PROGRESS') {
        streamRef.current = (e.detail.progress || 0) / 100;
      } else if (e.detail.type === 'STREAM_COMPLETE') {
        streamRef.current = 1;
        setTimeout(() => { streamRef.current = 0; }, 3000);
      } else if (e.detail.type === 'HOLOGRAM_TOGGLE') {
        setIsHologram(!!e.detail.active);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('nexus-telemetry', handleTelemetry);
      return () => window.removeEventListener('nexus-telemetry', handleTelemetry);
    }
  }, []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      temp.push({ x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const intensity = streamRef.current;

      particles.forEach((particle, i) => {
        const { x, y, z } = particle;
        const drift = intensity * 5;
        const factor = (0.5 + Math.sin(time / 2 + i) * 0.2) * (1 + intensity * 2);
        
        dummy.position.set(
          x + Math.sin(time + x) * (0.1 + intensity),
          y + Math.cos(time + y) * (0.1 + intensity),
          z + Math.sin(time + z) * (0.1 + intensity)
        );
        dummy.scale.set(factor, factor, factor);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.02, 0.02, 0.02]} />
      <meshStandardMaterial 
        color={isHologram ? "#00ffff" : "#ffffff"} 
        emissive={isHologram ? "#00ffff" : "#00ffcc"} 
        emissiveIntensity={isHologram ? 2 : 0.5} 
        opacity={isHologram ? 0.9 : 0.6} 
        transparent 
      />
    </instancedMesh>
  );
}
