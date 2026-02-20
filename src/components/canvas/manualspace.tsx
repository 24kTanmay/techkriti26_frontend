'use client'

import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './Scene'

export function ManualSpace() {
  const { scene } = useGLTF('/models/space.glb')
  const spaceRef = useRef<THREE.Group>(null!)
  const progressRef = useScrollProgress()

  // ─── Optimization: Collect material refs ONCE into a flat array.
  // useFrame will iterate this array directly — no scene.traverse() per frame.
  const spaceMaterials = useRef<THREE.Material[]>([])

  useEffect(() => {
    // 1. FORCE CENTER: Reset the model's pivot point to its geometric center
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    scene.position.sub(center)

    // 2. MATERIAL SETUP + CACHE
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const materials = Array.isArray(mesh.material)
          ? (mesh.material as THREE.Material[])
          : [mesh.material as THREE.Material]

        materials.forEach((m: any) => {
          m.transparent = true
          m.opacity = 0
          m.side = THREE.BackSide
          m.depthWrite = false
          if (m.emissive) {
            m.emissive = new THREE.Color(0xffffff)
            m.emissiveIntensity = 0.1
          }
          // Cache the material reference for fast per-frame updates
          spaceMaterials.current.push(m)
        })
        mesh.renderOrder = -10
      }
    })
  }, [scene])

  useFrame((state) => {
    if (!spaceRef.current) return

    const progress = progressRef.current

    // Timing: Fade in 0.45 -> 0.60
    const fadeIn = THREE.MathUtils.smoothstep(progress, 0.45, 0.60)

    // ─── Optimization: Early return when space is invisible — skip all GPU writes
    spaceRef.current.visible = fadeIn > 0
    if (!spaceRef.current.visible) return

    // ─── Optimization: Direct array iteration, O(n) flat loop — no tree traversal
    spaceMaterials.current.forEach((m: any) => { m.opacity = fadeIn })

    const t = state.clock.elapsedTime
    spaceRef.current.rotation.y = t * 0.01

    const scale = 400 + fadeIn * 100
    spaceRef.current.scale.setScalar(scale)
  })

  return (
    <group ref={spaceRef} position={[0, 25, 0]}>
      <primitive object={scene} />
    </group>
  )
}
