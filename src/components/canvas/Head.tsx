'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../materials/ParticleMaterial' 

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ✅ FIXED CONFIG: CLEAN, THIN CRYSTAL
const GLASS_CONFIG = {
  color: '#ffffff',       // Pure white base to let particles color the scene
  roughness: 0.0,         // Perfectly smooth
  metalness: 0.0,         // NO metal (fixes the dark/grey look)
  transmission: 1.0,      // 100% See-through
  thickness: 0.0,         // ✅ CRITICAL FIX: 0 thickness prevents dark absorption
  ior: 1.1,               // ✅ CRITICAL FIX: Low refraction prevents "Bug Eyes"
  iridescence: 0.4,       // Subtle rainbow
  envMapIntensity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0,
}

function createGlowTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  // Increase resolution for crisper circles
  canvas.width = 128 
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  // Center gradient
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  // Core is solid white
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  // Mid is soft
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)')
  // Edge is transparent
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const PARTICLE_COUNT = 6000

export function Head() {
  const { scene } = useGLTF('/models/human-head.glb')
  const glowTexture = useMemo(() => createGlowTexture(), [])

  const allMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh)
      }
    })
    return meshes
  }, [scene])

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

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      ...GLASS_CONFIG,
      color: new THREE.Color(GLASS_CONFIG.color),
      transparent: true,
      // ✅ FIX: FrontSide hides the internal eyeballs/teeth geometry
      side: THREE.FrontSide, 
    })
  }, [])

  const groupRef = useRef<THREE.Group>(null!)
  const scrollProgress = useRef(0)
  const particleMatRef = useRef<any>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

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

    // Tuning the brain shape
    const brainW = 0.03
    const brainH = 0.03
    const brainD = 0.03
    // Adjust this if particles are too high/low
    const brainYOffset = 0.1 

    const tempColor = new THREE.Color()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        // 1. ELEGANT SPHERICAL DISTRIBUTION (Mathematical Symmetry)
        const theta = Math.random() * Math.PI * 2      // Horizontal angle
        const phi = Math.acos(2 * Math.random() - 1)   // Vertical angle
        const r = Math.cbrt(Math.random())             // Cubic root for uniform volume

        // Convert to Cartesian
        const sinPhi = Math.sin(phi)
        const vx = r * sinPhi * Math.cos(theta)
        const vy = r * sinPhi * Math.sin(theta)
        const vz = r * Math.cos(phi)

        randoms[i3] = Math.random()
        randoms[i3+1] = Math.random()
        randoms[i3+2] = Math.random()

        // 2. Head Shape (Tiny Ellipsoid)
        startPos[i3] = vx * brainW
        startPos[i3+1] = (vy * brainH) + brainYOffset
        startPos[i3+2] = vz * brainD

        // 3. SCATTER SHAPE (Perfect Sphere)
        const scatterRadius = 0.5;
        spreadPos[i3] = vx * scatterRadius
        spreadPos[i3+1] = vy * scatterRadius + (brainYOffset * 0.5)
        spreadPos[i3+2] = vz * scatterRadius

        // 4. CORE SHAPE (Perfect Sphere)
        const coreRadius = 0.005;
        endPos[i3] = vx * coreRadius
        endPos[i3+1] = vy * coreRadius + brainYOffset
        endPos[i3+2] = vz * coreRadius

        const colorIndex = Math.floor(r * (colorPalette.length - 1))
        const c1 = colorPalette[colorIndex]
        const c2 = colorPalette[colorIndex + 1] || c1
        tempColor.copy(c1).lerp(c2, r % 1)
        
        colors[i3] = tempColor.r
        colors[i3+1] = tempColor.g
        colors[i3+2] = tempColor.b
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

  useEffect(() => {
    if (typeof window === 'undefined') return
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
    const p = scrollProgress.current
    const t = state.clock.elapsedTime

    // --- 🛠️ MANUAL TIMING CONTROLS (0 to 1) ---
    const zoomEndAt = 0.15;      // Increase to slow down zoom, Decrease to speed up
    const rotationEndAt = 0.1;  // Increase to slow down turn, Decrease to speed up
    const headVanishAt = 0.15;   // Point where the glass head disappears
    // ------------------------------------------

    // Calculate independent progress for each animation
    const zoomP = Math.min(p / zoomEndAt, 1);
    const rotationP = Math.min(p / rotationEndAt, 1);

    if (groupRef.current) {
        const baseScale = scaleFactor
        
        // 1. ZOOM: Now uses zoomP instead of p
        const zoom = 0.8 + zoomP * 2.5 
        groupRef.current.scale.setScalar(baseScale * zoom)
        
        // 2. ROTATION: Now uses rotationP
        const startRotation = (22 * Math.PI) / 180
        groupRef.current.rotation.y = startRotation * (1 - rotationP)
        
        // 3. POSITION: Stays synced with zoomP
        groupRef.current.position.x = -center.x * baseScale * zoom 
        groupRef.current.position.y = -center.y * baseScale * zoom - (zoomP * 2) - 0.2
        groupRef.current.position.z = -center.z * baseScale * zoom 
    }

    // 4. VISIBILITY: Uses headVanishAt
    scene.visible = p < headVanishAt

    if (particleMatRef.current) {
        particleMatRef.current.uTime = t
        particleMatRef.current.uScrollProgress = p
        particleMatRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2)
    }

    if (lightRef.current) {
        // --- PEAK & FADE Logic ---
        // Light intensifies as particles implode, then fades out completely by 20%
        const lightIntensity = 5 + (p * p) * 100.0
        const fadeOut = 1.0 - THREE.MathUtils.smoothstep(p, 0.17, 0.20)
        lightRef.current.intensity = lightIntensity * fadeOut
    }
  })

  useEffect(() => {
    scene.rotation.set(0, 0, 0)
    // Apply material to all meshes
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) {
        mesh.material = glassMaterial
        // Ensure standard rendering to avoid sorting artifacts
        mesh.renderOrder = 2
      }
    })
  }, [scene, glassMaterial])

  if (allMeshes.length === 0) return null

  return (
    <group ref={groupRef}>
      <group>
        {/* Glass Head */}
        <primitive object={scene} />
        
        {/* Internal Light */}
        <pointLight 
            ref={lightRef}
            position={[center.x, center.y + 0.25, center.z]} 
            color="#ffaa88" 
            intensity={5} 
            distance={4}
            decay={2}
        />

        {/* Particles */}
        {particleGeo && (
            <points 
                geometry={particleGeo} 
                position={center} 
                scale={0.95} 
                // ✅ RENDER ORDER FIX:
                // Particles at 1, Glass at 2.
                // This ensures glass draws ON TOP of particles, but transparency lets us see them.
                renderOrder={1} 
            >
                {/* @ts-ignore */}
                <particleMaterial 
                    ref={particleMatRef}
                    transparent={true}
                    depthWrite={false} // Important for transparency overlap
                    depthTest={false}  // "Hologram" feel
                    uColor={new THREE.Color('#ffffff')} 
                    uMap={glowTexture}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        )}
      </group>
    </group>
  )
}