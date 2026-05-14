"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { canRender3D } from "../../lib/capability";

function ShurikenMesh() {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 2.8;
    const inner = 0.55;
    const points = 4;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? r : r * inner;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 2,
      curveSegments: 8,
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.18;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#2a2118"
          metalness={0.88}
          roughness={0.22}
          emissive="#f4b942"
          emissiveIntensity={0.07}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.006}>
        <meshBasicMaterial color="#f4b942" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight position={[5, 6, 8]} intensity={1.25} color="#f4b942" />
      <directionalLight position={[-6, -2, 3]} intensity={0.6} color="#6a9c43" />
      <pointLight position={[0, 0, 5]} intensity={0.55} color="#f4ecd0" />
    </>
  );
}

function Static2DFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-50"
        style={{ animation: "spin 60s linear infinite" }}
      >
        <svg viewBox="0 0 24 24" className="h-full w-full shuriken-stroke" aria-hidden="true">
          <path
            d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
            fill="var(--color-amber)"
          />
          <circle cx="12" cy="12" r="1.6" fill="var(--color-ink)" />
        </svg>
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export function HeroBackdrop() {
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUse3D(canRender3D());
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden noise-bg">
      <div aria-hidden="true" className="grain absolute inset-0 opacity-50" />

      <div
        aria-hidden="true"
        className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(244,185,66,0.55), transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-10 h-[520px] w-[520px] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(106,156,67,0.45), transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(139,74,47,0.38), transparent 70%)" }}
      />

      <div aria-hidden="true" className="absolute inset-0">
        {mounted && use3D ? (
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 8], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
            className="!absolute inset-0"
          >
            <SceneLights />
            <ShurikenMesh />
          </Canvas>
        ) : (
          <Static2DFallback />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-transparent"
      />
    </div>
  );
}
