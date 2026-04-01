"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import type { Group } from "three";

function Model({ onLoaded }: { onLoaded: () => void }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/model/coffee-bag.glb");

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.39;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export function CoffeeModel() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="aspect-square md:aspect-[6/5] max-w-2xl mx-auto overflow-hidden relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-foreground/20 border-t-foreground/60 animate-spin" />
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <directionalLight position={[0, -3, 3]} intensity={0.2} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.05}>
            <Center>
              <Model onLoaded={() => setLoaded(true)} />
            </Center>
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/model/coffee-bag.glb");
