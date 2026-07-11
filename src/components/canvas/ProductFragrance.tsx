"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BottleModel({ hoverColor = "#D4AF37" }: { hoverColor?: string }) {
  const bottleRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const capRef = useRef<THREE.Mesh>(null);

  // Mouse parallax interaction
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!bottleRef.current) return;
    
    // Continuous rotation combined with mouse parallax
    const t = state.clock.getElapsedTime();
    bottleRef.current.rotation.y = t * 0.25 + mouse.x * 0.4;
    bottleRef.current.rotation.x = Math.sin(t * 0.1) * 0.08 + mouse.y * 0.15;
    bottleRef.current.position.y = Math.sin(t * 1.5) * 0.08;

    // Liquid movement inside
    if (liquidRef.current) {
      liquidRef.current.rotation.y = -t * 0.3;
      liquidRef.current.position.y = Math.sin(t * 2) * 0.02 - 0.2;
      const scaleVal = 1 + Math.sin(t * 3) * 0.015;
      liquidRef.current.scale.set(scaleVal, 1, scaleVal);
    }
  });

  return (
    <group ref={bottleRef}>
      {/* Outer Glass Bottle Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 2.2, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.03}
          metalness={0.1}
          transmission={0.92}
          ior={1.48}
          thickness={1.6}
          transparent
          opacity={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* Curved Shoulder/Neck of Bottle */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.5, 1, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.03}
          transmission={0.92}
          ior={1.48}
          thickness={1.6}
          transparent
          clearcoat={1.0}
        />
      </mesh>

      {/* Gold Atomizer Neck Collar */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.2, 32]} />
        <meshStandardMaterial
          color={hoverColor}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Luxury Heavy Bottle Cap */}
      <mesh ref={capRef} position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
        <meshStandardMaterial
          color={hoverColor}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner Fragrance Liquid */}
      <mesh ref={liquidRef} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 1.3, 32]} />
        <meshPhysicalMaterial
          color={hoverColor}
          roughness={0.15}
          transmission={0.7}
          thickness={0.5}
          transparent
          opacity={0.8}
          clearcoat={0.3}
        />
      </mesh>

      {/* Atomizer Straw */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

export default function ProductFragrance({ hoverColor = "#D4AF37" }: { hoverColor?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 border border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      shadows
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-5, 3, -2]} intensity={1.2} />
      <pointLight position={[0, -3, 2]} intensity={2.0} color={hoverColor} />
      <pointLight position={[2, 2, -2]} intensity={1.5} color="#ffffff" />
      <BottleModel hoverColor={hoverColor} />
    </Canvas>
  );
}
