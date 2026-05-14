"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  GodRays,
  Vignette,
} from "@react-three/postprocessing";
import { useRef } from "react";
import type { Mesh } from "three";

const LAMP_POSITION: [number, number, number] = [-1.55, -0.45, 0.4];
const SUN_POSITION: [number, number, number] = [1.1, 0.6, -0.3];

function CursorParallax() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useFrame((state, delta) => {
    const m = state.pointer;
    target.current.x += (m.x * 0.25 - target.current.x) * Math.min(1, delta * 4);
    target.current.y += (m.y * 0.15 - target.current.y) * Math.min(1, delta * 4);
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroAtmosphere() {
  const sunRef = useRef<Mesh>(null);
  const lampRef = useRef<Mesh>(null);

  return (
    <Canvas
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.2], fov: 38 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 6,
      }}
      aria-hidden
    >
      <ambientLight intensity={0.4} />
      <CursorParallax />

      <Sparkles
        count={90}
        size={3}
        scale={[6, 3, 1.5]}
        speed={0.3}
        opacity={0.6}
        color="#f7b733"
      />

      <mesh ref={lampRef} position={LAMP_POSITION}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial
          color="#ffe9a3"
          emissive="#ffe9a3"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={sunRef} position={SUN_POSITION}>
        <circleGeometry args={[0.5, 48]} />
        <meshBasicMaterial color="#f7b733" toneMapped={false} />
      </mesh>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.05}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <GodRays
          sun={sunRef as unknown as React.RefObject<Mesh>}
          samples={48}
          density={0.85}
          decay={0.92}
          weight={0.45}
          exposure={0.35}
          clampMax={1}
          blur
        />
        <Vignette eskil={false} offset={0.5} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}

export default HeroAtmosphere;
