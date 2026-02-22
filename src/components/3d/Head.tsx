'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF,MeshTransmissionMaterial, Environment  } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ParticleMaterial'
import { useScrollProgress } from '@/context/ScrollProgressContext'

// ─── Hoisted constants — computed once at module load, not every frame
const WHITE_COLOR = new THREE.Color('#ffffff')

/**
 * Head Component: The hero 3D scene containing the Glass Head and the Neural Particles.
 * 
 * Logic Overview:
 * 1. Loads a 3D model of a human head.
 * 2. Replaces its original materials with a custom Glass/Refractive material.
 * 3. Spawns thousands of particles in a "Brain" shape inside the head.
 * 4. Animates the head (zoom/rotation) and particles (explosion/implosion) based on scroll.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Configuration for the MeshTransmissionMaterial 
const PREMIUM_GLASS_CONFIG = {
  backside: true,
  samples: 8,           // Lower samples while testing to ensure it renders
  resolution: 256,
  transmission: 0.95,    // Slightly less than 1.0 so the "surface" stays visible
  roughness: 0.2,       // HIGHER roughness catches more light on a black background
  ior: 1.5,             // Standard glass IOR provides better edges
  thickness: 0.5,       // Start smaller; 1.5 might be too "thick" for some model scales
  chromaticAberration: 0.04,
  anisotropy: 0.1,
  distortion: 0.0,
  distortionScale: 0.0,
  temporalDistortion: 0.0,
  attenuationDistance: 0.5,
  attenuationColor: '#ffffff',
  color: '#ffffff',
}

/**
 * Generates a soft radial glow texture using an HTML5 Canvas.
 * This is used as the 'sprite' for every individual particle.
 */
function createGlowTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 128 
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')   // Center: Solid White
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)') // Mid: Soft Fade
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')          // Edge: Transparent
  
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const PARTICLE_COUNT = 6000

export function Head() {
  const progressRef = useScrollProgress()
  // ─── Optimization: devicePixelRatio never changes at runtime — read once
  const dprRef = useRef(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2))
  const { scene } = useGLTF('/models/human-head.glb')
  const glowTexture = useMemo(() => createGlowTexture(), [])

  // 1. Extract all meshes from the GLTF scene
  const allMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh)
      }
    })
    return meshes
  }, [scene])

  // 2. Calculate the center and scale of the model for perfect positioning
  const { center, scaleFactor } = useMemo(() => {
    const box = new THREE.Box3()
    allMeshes.forEach((m) => {
      m.geometry.computeBoundingBox()
      const geoBox = m.geometry.boundingBox!.clone()
      geoBox.applyMatrix4(m.matrixWorld)
      box.union(geoBox)
    })
    const c = new THREE.Vector3()
    box.getCenter(c)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const sf = maxDim > 0 ? 2.5 / maxDim : 1
    return { center: c, scaleFactor: sf }
  }, [allMeshes])

  const groupRef = useRef<THREE.Group>(null!)
  const headMeshRef = useRef<THREE.Mesh>(null!)
  const particleMatRef = useRef<any>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  /**
   * Particle Geometry Generation:
   * We calculate 3 key positions for every particle:
   * 1. StartPos: Compressed into a brain shape inside the head.
   * 2. SpreadPos: An exploded spherical cloud.
   * 3. EndPos: A tiny singularity orb in the center.
   */
  const particleGeo = useMemo(() => {
    const startPos = new Float32Array(PARTICLE_COUNT * 3)
    const spreadPos = new Float32Array(PARTICLE_COUNT * 3)
    const endPos = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const randoms = new Float32Array(PARTICLE_COUNT * 3)

    const colorPalette = [
        new THREE.Color('#ffffff'), 
        new THREE.Color('#ffccaa'), 
        new THREE.Color('#ff8866'), 
    ]

    const brainW = 0.03; const brainH = 0.03; const brainD = 0.03
    const brainYOffset = 0.1 

    const tempColor = new THREE.Color()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        // --- SPHERICAL DISTRIBUTION MATH ---
        // Uniform sampling on a sphere to prevent boxy clustering
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = Math.cbrt(Math.random()) // Cube root ensures uniform density through the volume

        const sinPhi = Math.sin(phi)
        const vx = r * sinPhi * Math.cos(theta)
        const vy = r * sinPhi * Math.sin(theta)
        const vz = r * Math.cos(phi)

        randoms[i3] = Math.random(); randoms[i3+1] = Math.random(); randoms[i3+2] = Math.random()

        // SET SCENE 1: Brain Shape
        startPos[i3] = vx * brainW
        startPos[i3+1] = (vy * brainH) + brainYOffset
        startPos[i3+2] = vz * brainD

        // SET SCENE 2: Explosion (Spread)
        const scatterRadius = 0.5
        spreadPos[i3] = vx * scatterRadius
        spreadPos[i3+1] = vy * scatterRadius + (brainYOffset * 0.5)
        spreadPos[i3+2] = vz * scatterRadius

        // SET SCENE 3: Singularity (Concentrated Orb)
        const coreRadius = 0.0001
        endPos[i3] = vx * coreRadius
        endPos[i3+1] = vy * coreRadius + brainYOffset
        endPos[i3+2] = vz * coreRadius

        // Color based on radius (inner particles are white/hotter)
        const colorIndex = Math.floor(r * (colorPalette.length - 1))
        tempColor.copy(colorPalette[colorIndex]).lerp(colorPalette[colorIndex+1] || colorPalette[colorIndex], r % 1)
        
        colors[i3] = tempColor.r; colors[i3+1] = tempColor.g; colors[i3+2] = tempColor.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(startPos.slice(), 3))
    geo.setAttribute('aStartPos', new THREE.BufferAttribute(startPos, 3))
    geo.setAttribute('aSpreadPos', new THREE.BufferAttribute(spreadPos, 3))
    geo.setAttribute('aEndPos', new THREE.BufferAttribute(endPos, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    return geo
  }, [])

  // RENDER LOOP
  useFrame((state) => {
    const p = progressRef.current
    const t = state.clock.elapsedTime

    // Toggle Glass Head visibility
    // if (headMeshRef.current) headMeshRef.current.visible = p < 0.15

    if (particleMatRef.current) {
      particleMatRef.current.uTime = t
      particleMatRef.current.uScrollProgress = p
      // ─── Optimization: use cached DPR — never changes at runtime
      particleMatRef.current.uPixelRatio = dprRef.current
    }

    if (lightRef.current) {
      const lightIntensity = 5 + (p * p) * 100.0
      const fadeOut = 1.0 - THREE.MathUtils.smoothstep(p, 0.17, 0.20)
      lightRef.current.intensity = lightIntensity * fadeOut
    }
  })

  // Initial Setup
  useEffect(() => {
    scene.rotation.set(0, 0, 0)
  }, [scene])

  if (allMeshes.length === 0) return null

  return (
    <group ref={groupRef}>
      <group scale={scaleFactor} position={[-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor]}>
        
        {/* THE HEAD MESH */}
        {allMeshes.map((mesh, i) => (
          <mesh 
            key={i} 
            geometry={mesh.geometry} 
            ref={i === 0 ? headMeshRef : null}
            // Optimization: helps with transparency sorting
            renderOrder={10} 
          >
             <MeshTransmissionMaterial {...PREMIUM_GLASS_CONFIG} />
          </mesh>
        ))}

        {/* LIGHTING - Crucial for the glow */}
        <pointLight 
            ref={lightRef}
            position={[center.x, center.y + 0.1, center.z]} 
            color="#ffccaa" 
            intensity={10} 
            distance={2}
        />

        {/* THE PARTICLES */}
        {particleGeo && (
            <points 
                geometry={particleGeo} 
                position={center} 
                scale={0.95} 
            >
                {/* @ts-ignore */}
                <particleMaterial 
                    ref={particleMatRef}
                    transparent={true}
                    depthWrite={false} 
                    depthTest={true} // Set to true so they sit INSIDE the glass
                    uColor={WHITE_COLOR} 
                    uMap={glowTexture}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        )}
      </group>

      {/* THE SECRET SAUCE: Environment Map */}
      {/* This provides the subtle gold/blue reflections seen in Image 1 */}
      <Environment preset="city" environmentIntensity={2} />
    </group>
  )
}