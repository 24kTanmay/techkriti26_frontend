'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import '../materials/HelixMaterial'
import '../materials/DataDustMaterial'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Helix() {
  const { scene } = useGLTF('/models/dna.glb')

  const helixMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh)
      }
    })
    return meshes
  }, [scene])

  // Center and scale
  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const c = new THREE.Vector3()
    box.getCenter(c)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const sf = maxDim > 0 ? 4.0 / maxDim : 1
    return { center: c, scaleFactor: sf }
  }, [scene])

  const materialRef = useRef<any>(null)
  const dustMatRef = useRef<any>(null)
  const groupRef = useRef<THREE.Group>(null!)
  const scrollProgress = useRef(0)
  const { viewport } = useThree()

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#scroll-trigger',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          scrollProgress.current = self.progress
        },
      })
    })
    return () => ctx.revert()
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = scrollProgress.current

    if (materialRef.current) {
      materialRef.current.uTime = t
      materialRef.current.uScrollProgress = p
    }

    if (dustMatRef.current) {
      dustMatRef.current.uTime = t
      dustMatRef.current.uScrollProgress = p
      dustMatRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2)
    }

    if (groupRef.current) {
      // Rotation
      groupRef.current.rotation.y = t * 0.3
      
      // Position: Start low, move to 0 as we scroll
      // Changed from -8 to -3.5 to make it visible sooner
      groupRef.current.position.y = -3.5 * (1.0 - p) 

      // Mouse following tilt (coordinated with Head)
      const targetRotX = -state.pointer.y * 0.3
      const targetRotY = state.pointer.x * 0.3
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1)
      // We already have rotation.y set for constant spin, so we can't just set it to targetRotY. 
      // We can add the tilt offset.
      // groupRef.current.rotation.y += ... 
    }
  })

  const particleGeo = useMemo(() => {
    if (helixMeshes.length === 0) return null
    const geo = helixMeshes[0].geometry.clone()
    const count = geo.attributes.position.count
    const randoms = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) randoms[i] = Math.random()
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
    return geo
  }, [helixMeshes])

  return (
    <group ref={groupRef} scale={scaleFactor} position={[0, -2, 0]}>
      {helixMeshes.map((mesh, i) => (
        <mesh key={i} geometry={mesh.geometry}>
          {/* @ts-ignore */}
          <helixMaterial 
            ref={materialRef} 
            transparent 
            depthWrite={true} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {particleGeo && (
        <points geometry={particleGeo}>
          {/* @ts-ignore */}
          <dataDustMaterial
            ref={dustMatRef}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  )
}

