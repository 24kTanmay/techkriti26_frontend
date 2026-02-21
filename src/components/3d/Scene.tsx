'use client'

import React, { Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Head } from './Head'
import { HumanDna2 } from './HumanDna2'
import { Nebula } from './nebula/Nebula'
import NeuralHUD from '../common/NeuralHUD'
import { ScrollProgressProvider, useScrollProgress } from '@/context/ScrollProgressContext'

// ─── Hoisted constant: computed once, not every frame
const START_ROTATION_Y = (22 * Math.PI) / 180

function TransformGroup({ children }: { children: React.ReactNode }) {
  const groupRef = React.useRef<THREE.Group>(null!)
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

function SceneContent() {
  const progressRef = useScrollProgress()
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#scroll-trigger',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5,
        onUpdate: (self) => {
          progressRef.current = self.progress 
        },
      })
    })
    return () => ctx.revert()
  }, [progressRef, hasMounted])

  if (!hasMounted) return null

  return (
    <>
      <NeuralHUD />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 5000 }}
        gl={{ 
          antialias: false, 
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: 'high-performance',
          alpha: true
        }}
        dpr={[1, 1.5]}
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

          <Nebula />

          <Environment preset="city" background={false} />

          <EffectComposer multisampling={4}>
            <Bloom
              luminanceThreshold={0.8}
              luminanceSmoothing={0.3}
              intensity={0.25}
            />
          </EffectComposer>
        </Suspense>
        <Preload all />
      </Canvas>
    </>
  )
}

export default function Scene() {
  return (
    <ScrollProgressProvider>
      <SceneContent />
    </ScrollProgressProvider>
  )
}
