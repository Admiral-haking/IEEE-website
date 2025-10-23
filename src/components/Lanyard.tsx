"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import * as THREE from 'three';

// Types for the component
interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  className?: string;
  style?: React.CSSProperties;
}

// Card component with physics
function Card({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/assets/lanyard/card.glb');
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [2, 3, 0.1],
    material: { friction: 0.3, restitution: 0.1 }
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </mesh>
  );
}

// Lanyard string component with physics
function LanyardString({ 
  startPosition, 
  endPosition, 
  segments = 20 
}: { 
  startPosition: [number, number, number]; 
  endPosition: [number, number, number];
  segments?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position: startPosition,
    args: [0.05]
  }));

  // Create lanyard texture
  const lanyardTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load('/assets/lanyard/lanyard.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, segments);
    return texture;
  }, [segments]);

  // Create lanyard geometry
  const lanyardGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = THREE.MathUtils.lerp(startPosition[0], endPosition[0], t);
      const y = THREE.MathUtils.lerp(startPosition[1], endPosition[1], t);
      const z = THREE.MathUtils.lerp(startPosition[2], endPosition[2], t);
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, segments, 0.02, 8, false);
    return geometry;
  }, [startPosition, endPosition, segments]);

  const lanyardMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      map: lanyardTexture,
      transparent: true,
      opacity: 0.9
    });
  }, [lanyardTexture]);

  return (
    <group ref={groupRef}>
      <mesh geometry={lanyardGeometry} material={lanyardMaterial} castShadow />
      <mesh ref={ref} position={startPosition}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

// Physics world component
function PhysicsWorld({ gravity }: { gravity: [number, number, number] }) {
  // Ground plane
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
    material: { friction: 0.4, restitution: 0.3 }
  }));

  return (
    <>
      {/* Ground */}
      <mesh ref={groundRef} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Card */}
      <Card position={[0, 5, 0]} />
      
      {/* Lanyard string */}
      <LanyardString 
        startPosition={[0, 8, 0]} 
        endPosition={[0, 5, 0]} 
        segments={15}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}

// Main Lanyard component
export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  className = '',
  style = {}
}: LanyardProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        ...style
      }}
    >
      <Canvas
        camera={{ position, fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Physics gravity={gravity}>
          <PhysicsWorld gravity={gravity} />
        </Physics>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
}
