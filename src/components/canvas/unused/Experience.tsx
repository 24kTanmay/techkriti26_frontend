"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Group>(null);

  // Particles for the background / cosmic field
  const { positions, colors } = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useEffect(() => {
    if (!pointsRef.current || !coreRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // Phase 1 -> 2: Zoom into the core (Inner Awareness)
    tl.to(coreRef.current.position, {
      z: 2,
      duration: 1,
    })
    .to(coreRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 1,
    }, "<")
    
    // Phase 2 -> 3: Dissolve core and zoom out (Cosmic Transcendence)
    .to(coreRef.current.position, {
      z: -5,
      y: 2,
      duration: 1,
    })
    .to(pointsRef.current.scale, {
      x: 3,
      y: 3,
      z: 3,
      duration: 1,
    }, "<")
    .to(pointsRef.current.rotation, {
      y: Math.PI * 2,
      duration: 2,
    }, "<");

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.z += 0.0005;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      coreRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={colors.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <group ref={coreRef}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[1, 64, 64]}>
            <MeshDistortMaterial
              color="#6366f1"
              speed={2}
              distort={0.4}
              radius={1}
              emissive="#4338ca"
              emissiveIntensity={0.5}
            />
          </Sphere>
        </Float>
      </group>
    </>
  );
}
