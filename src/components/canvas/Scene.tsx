'use client'

import React, { Suspense, createContext, useContext, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Head } from './Head'
import { HumanDna2 } from './HumanDna2'
import { ManualSpace } from './manualspace'

// ─── Optimization: Scroll progress stored in a ref, NOT state.
// This means scroll events NEVER trigger React re-renders.
// Components read from the context ref inside useFrame instead.
export const ScrollProgressContext = createContext<React.MutableRefObject<number>>({ current: 0 } as any)
export const useScrollProgress = () => useContext(ScrollProgressContext)

// ─── Hoisted constant: computed once, not every frame
const START_ROTATION_Y = (22 * Math.PI) / 180

function TransformGroup({ children }: { children: React.ReactElement[] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const progressRef = useScrollProgress()

  useFrame(() => {
    const p = progressRef.current

    const easedZoomP = THREE.MathUtils.smoothstep(p, 0, 0.2)
    const easedRotationP = THREE.MathUtils.smoothstep(p, 0, 0.1)

    const zoom = 0.8 + (easedZoomP * 1.5)

    if (groupRef.current) {
      groupRef.current.scale.setScalar(zoom)
      groupRef.current.rotation.y = START_ROTATION_Y * (1 - easedRotationP)
      groupRef.current.position.y = -(easedZoomP * 1.7) - 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {children}
    </group>
  )
}

export default function Scene() {
  // ─── Optimization: useRef instead of useState — no React re-renders on scroll
  const progressRef = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#scroll-trigger',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5,
        onUpdate: (self) => {
          progressRef.current = self.progress // Write to ref only, no setState
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <ScrollProgressContext.Provider value={progressRef}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 5000 }}
        gl={{ antialias: true, alpha: false, toneMapping: 3 }}
        dpr={[1, 1.5]}  // Optimization: was [1,2] — saves ~33% GPU fill-rate on HiDPI
        style={{ background: '#050505' }}
      >
        <color attach="background" args={['#050505']} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-3, 2, 4]} intensity={1.0} color="#aa77ee" />
        <pointLight position={[0, 0, -4]} intensity={0.8} color="#cc99ff" />

        <Suspense fallback={null}>
          <TransformGroup>
            <Head />
            <HumanDna2 />
          </TransformGroup>

          <ManualSpace />

          <Environment preset="city" background={false} />
        </Suspense>

        {/* Optimization: DepthOfField removed (most expensive post pass, barely visible) */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.3}
            intensity={0.25}
          />
        </EffectComposer>
        <Preload all />
      </Canvas>
    </ScrollProgressContext.Provider>
  )
}
