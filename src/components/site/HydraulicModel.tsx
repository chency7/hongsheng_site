'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model(props: any) {
  const { scene } = useGLTF('/model/yy.glb');
  const ref = useRef<THREE.Group>(null!);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    timeRef.current += delta;
    const t = timeRef.current;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.3 + 0.5;
    ref.current.rotation.x = Math.cos(t * 0.15) * 0.1;
  });

  return <primitive ref={ref} object={scene} {...props} />;
}

useGLTF.preload('/model/yy.glb');

export default function HydraulicModel() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
      <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F4B400" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
          <Model scale={0.8} />
        </Float>

        <Environment preset="city" />
        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
}
