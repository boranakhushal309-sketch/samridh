"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WatchModel({ hoverColor = "#D4AF37" }: { hoverColor?: string }) {
  const watchRef = useRef<THREE.Group>(null);
  const secondHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);
  const hourHandRef = useRef<THREE.Mesh>(null);

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
    if (!watchRef.current) return;

    // Slow 3D display rotation and parallax reaction
    const t = state.clock.getElapsedTime();
    watchRef.current.rotation.y = t * 0.15 + mouse.x * 0.4;
    watchRef.current.rotation.x = 0.4 + Math.sin(t * 0.1) * 0.05 + mouse.y * 0.2;
    watchRef.current.position.y = Math.sin(t * 1.2) * 0.06;

    // Smooth sweeping hands (luxury kinetic watch style)
    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -t * 1.0; // Sweeps around
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * (1.0 / 60);
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -t * (1.0 / 720);
    }
  });

  return (
    <group ref={watchRef}>
      {/* Upper Leather Band / Strap */}
      <mesh position={[0, 1.3, -0.05]} castShadow>
        <boxGeometry args={[0.5, 1.2, 0.08]} />
        <meshStandardMaterial
          color="#151518"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Lower Leather Band / Strap */}
      <mesh position={[0, -1.3, -0.05]} castShadow>
        <boxGeometry args={[0.5, 1.2, 0.08]} />
        <meshStandardMaterial
          color="#151518"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Watch Casing / Bezel */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.24, 40]} />
        {/* Rotate so the cylinder face points forward */}
        <primitive object={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)} attach="quaternion" />
        <meshStandardMaterial
          color={hoverColor}
          metalness={0.92}
          roughness={0.12}
        />
      </mesh>

      {/* Watch Dial / Face (Backing) */}
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 40]} />
        <primitive object={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)} attach="quaternion" />
        <meshStandardMaterial
          color="#0a0a0c"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Gold Inner Dial Accent Ring */}
      <mesh position={[0, 0, 0.09]}>
        <ringGeometry args={[0.82, 0.86, 40]} />
        <meshStandardMaterial color={hoverColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Ticking Hands Center Pin */}
      <mesh position={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
        <primitive object={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)} attach="quaternion" />
        <meshStandardMaterial color={hoverColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sweeping Seconds Hand (Gold Wire) */}
      <group position={[0, 0, 0.14]} ref={secondHandRef}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.015, 0.8, 0.01]} />
          <meshStandardMaterial color={hoverColor} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Balance Counterweight */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.03, 0.3, 0.01]} />
          <meshStandardMaterial color={hoverColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Sweeping Minute Hand (Thicker) */}
      <group position={[0, 0, 0.12]} ref={minuteHandRef}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.04, 0.65, 0.015]} />
          <meshStandardMaterial color="#fafafa" metalness={0.1} roughness={0.3} />
        </mesh>
      </group>

      {/* Sweeping Hour Hand (Shortest) */}
      <group position={[0, 0, 0.1]} ref={hourHandRef}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.05, 0.48, 0.015]} />
          <meshStandardMaterial color="#fafafa" metalness={0.1} roughness={0.3} />
        </mesh>
      </group>

      {/* Casing Crown (Adjustment Button) */}
      <mesh position={[1.04, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 16]} />
        <primitive object={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)} attach="quaternion" />
        <meshStandardMaterial color={hoverColor} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Clock Glass Cover (Refractive and Glossy) */}
      <mesh position={[0, 0, 0.13]}>
        <cylinderGeometry args={[0.9, 0.9, 0.03, 32]} />
        <primitive object={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)} attach="quaternion" />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.02}
          transmission={0.95}
          ior={1.5}
          transparent
          opacity={0.3}
          clearcoat={1.0}
        />
      </mesh>

      {/* Hours Markers */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
        const angle = (hour * Math.PI) / 6;
        const radius = 0.72;
        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * radius;
        const isMajor = hour % 3 === 0;

        return (
          <group key={hour} position={[x, y, 0.1]}>
            <mesh>
              <boxGeometry args={[isMajor ? 0.04 : 0.02, isMajor ? 0.1 : 0.06, 0.01]} />
              <primitive object={new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle)} attach="quaternion" />
              <meshStandardMaterial color={isMajor ? hoverColor : "#88888b"} metalness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function ProductWatch({ hoverColor = "#D4AF37" }: { hoverColor?: string }) {
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
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      shadows
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 4, 4]} intensity={2.0} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.8} />
      <pointLight position={[0, -2, 2]} intensity={1.5} color={hoverColor} />
      <pointLight position={[2, 0, -1]} intensity={1} color="#ffffff" />
      <WatchModel hoverColor={hoverColor} />
    </Canvas>
  );
}
