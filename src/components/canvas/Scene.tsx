'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Head } from './Head'
import { Helix } from './Helix'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 4], fov: 40 }}
      gl={{ antialias: true, alpha: false, toneMapping: 3 }}
      dpr={[1, 2]}
      style={{ background: '#050505' }}
    >
      <color attach="background" args={['#050505']} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={1.0} color="#aa77ee" />
      <pointLight position={[2, -3, -2]} intensity={0.6} color="#7744bb" />
      <pointLight position={[0, 0, -4]} intensity={0.8} color="#cc99ff" />

      <Suspense fallback={null}>
        <group scale={1.2}>
          <Head />
          {/* <Helix /> */}
        </group>
        <Environment preset="city" background={false} />
      </Suspense>

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={1.8}
        />
      </EffectComposer>
      <Preload all />
    </Canvas>
  )
}
