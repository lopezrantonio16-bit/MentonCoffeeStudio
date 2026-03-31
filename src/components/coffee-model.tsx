"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Center, Bounds } from "@react-three/drei";
import type { Group } from "three";

function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/model/coffee-bag.glb");

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export function CoffeeModel() {
  return (
    <div className="aspect-square rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.4}>
            <Center>
              <Model />
            </Center>
          </Bounds>
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/model/coffee-bag.glb");
