'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../materials/DnaMaterial'

/**
 * HumanDna Component: The complete particle lifecycle scene.
 * 
 * Visual Narrative:
 * 1. Particles start as a "Brain" shape inside a glass head
 * 2. They explode outward (Scatter)
 * 3. They implode into a tiny bright Singularity
 * 4. The Singularity unfurls into a structured DNA double helix
 * 5. The DNA slowly rotates and then fades out
 * 
 * This replaces the Head component's particles with an extended lifecycle
 * that adds the DNA formation phase.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Glass head material config (same as Head.tsx)
const GLASS_CONFIG = {
  color: '#ffffff',
  roughness: 0.0,
  metalness: 0.0,
  transmission: 1.0,
  thickness: 0.0,
  ior: 1.1,
  iridescence: 0.4,
  envMapIntensity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0,
}

/**
 * Generates soft radial glow texture for particle sprites.
 */
function createGlowTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const PARTICLE_COUNT = 6000

export function HumanDna() {
  const { scene } = useGLTF('/models/human-head.glb')
  const glowTexture = useMemo(() => createGlowTexture(), [])

  // Extract meshes from GLTF
  const allMeshes = useMemo(() => {
    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh)
      }
    })
    return meshes
  }, [scene])

  // Calculate center & scale of the head model
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
      side: THREE.FrontSide,
    })
  }, [])

  const groupRef = useRef<THREE.Group>(null!)
  const scrollProgress = useRef(0)
  const particleMatRef = useRef<any>(null!)
  const warmLightRef = useRef<THREE.PointLight>(null!)
  const coolLightRef = useRef<THREE.PointLight>(null!)

  /**
   * Particle Geometry: 4 position stages + 2 color sets
   * 
   * Positions:
   *   aStartPos  — Brain shape (compressed sphere inside head)
   *   aSpreadPos — Explosion (expanded sphere)
   *   aEndPos    — Singularity (tiny point at center)
   *   aDnaPos    — DNA double helix formation
   * 
   * Colors:
   *   color      — Original warm fire palette (white/orange/red)
   *   aDnaColor  — Cool tech palette (blue/teal/pink/white)
   */
  const particleGeo = useMemo(() => {
    const startPos = new Float32Array(PARTICLE_COUNT * 3)
    const spreadPos = new Float32Array(PARTICLE_COUNT * 3)
    const endPos = new Float32Array(PARTICLE_COUNT * 3)
    const dnaPos = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const dnaColors = new Float32Array(PARTICLE_COUNT * 3)
    const randoms = new Float32Array(PARTICLE_COUNT * 3)

    // Original fire palette (Phases 1-2)
    const firePalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffccaa'),
      new THREE.Color('#ff8866'),
    ]

    // Tech/DNA palette (Phase 3) — matches the reference image
    const dnaPalette = [
      new THREE.Color('#45b7d1'), // Tech Blue
      new THREE.Color('#4ecdc4'), // Teal/Green
      new THREE.Color('#ff8b94'), // Soft Pink
      new THREE.Color('#ffffff'), // Clinical White
    ]

    const brainW = 0.03; const brainH = 0.03; const brainD = 0.03
    const brainYOffset = 0.1

    const tempColor = new THREE.Color()

    // DNA Helix parameters
    const turns = 12         // Number of helix twists
    const helixRadius = 0.25 // Radius of each strand
    const helixHeight = 2.5  // Total height of the helix
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const pct = i / PARTICLE_COUNT

      // --- SPHERICAL DISTRIBUTION (for brain/scatter/singularity) ---
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.cbrt(Math.random())

      const sinPhi = Math.sin(phi)
      const vx = r * sinPhi * Math.cos(theta)
      const vy = r * sinPhi * Math.sin(theta)
      const vz = r * Math.cos(phi)

      randoms[i3] = Math.random()
      randoms[i3 + 1] = Math.random()
      randoms[i3 + 2] = Math.random()

      // ===== POSITION 1: Brain Shape =====
      startPos[i3] = vx * brainW
      startPos[i3 + 1] = (vy * brainH) + brainYOffset
      startPos[i3 + 2] = vz * brainD

      // ===== POSITION 2: Explosion (Scatter) =====
      const scatterRadius = 0.5
      spreadPos[i3] = vx * scatterRadius
      spreadPos[i3 + 1] = vy * scatterRadius + (brainYOffset * 0.5)
      spreadPos[i3 + 2] = vz * scatterRadius

      // ===== POSITION 3: Singularity =====
      const coreRadius = 0.0001
      endPos[i3] = vx * coreRadius
      endPos[i3 + 1] = vy * coreRadius + brainYOffset
      endPos[i3 + 2] = vz * coreRadius

      // ===== POSITION 4: DNA HELIX =====
      const angle = pct * Math.PI * 2 * turns
      const yPos = (pct * helixHeight) - (helixHeight / 2)

      if (i % 5 === 0) {
        // --- THE RUNGS (horizontal connecting bars, 20% of particles) ---
        const t = Math.random()
        const strandAngle = Math.floor(pct * turns * 2) * Math.PI
        dnaPos[i3] = Math.cos(strandAngle) * helixRadius * (t * 2 - 1)
        dnaPos[i3 + 1] = yPos
        dnaPos[i3 + 2] = Math.sin(strandAngle) * helixRadius * (t * 2 - 1)
      } else {
        // --- THE STRANDS (outer spirals, 80% of particles) ---
        const strandOffset = (i % 2 === 0) ? 0 : Math.PI // Offset for second strand
        dnaPos[i3] = Math.cos(angle + strandOffset) * helixRadius
        dnaPos[i3 + 1] = yPos
        dnaPos[i3 + 2] = Math.sin(angle + strandOffset) * helixRadius
      }

      // ===== FIRE COLORS (Phases 1-2) =====
      const colorIndex = Math.floor(r * (firePalette.length - 1))
      tempColor.copy(firePalette[colorIndex]).lerp(
        firePalette[colorIndex + 1] || firePalette[colorIndex], r % 1
      )
      colors[i3] = tempColor.r
      colors[i3 + 1] = tempColor.g
      colors[i3 + 2] = tempColor.b

      // ===== DNA COLORS (Phase 3) =====
      const dnaCol = dnaPalette[Math.floor(Math.random() * dnaPalette.length)]
      dnaColors[i3] = dnaCol.r
      dnaColors[i3 + 1] = dnaCol.g
      dnaColors[i3 + 2] = dnaCol.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(startPos.slice(), 3))
    geo.setAttribute('aStartPos', new THREE.BufferAttribute(startPos, 3))
    geo.setAttribute('aSpreadPos', new THREE.BufferAttribute(spreadPos, 3))
    geo.setAttribute('aEndPos', new THREE.BufferAttribute(endPos, 3))
    geo.setAttribute('aDnaPos', new THREE.BufferAttribute(dnaPos, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aDnaColor', new THREE.BufferAttribute(dnaColors, 3))

    return geo
  }, [])

  // GSAP Scroll Sync
  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#scroll-trigger',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => { scrollProgress.current = self.progress },
      })
    })
    return () => ctx.revert()
  }, [])

  // RENDER LOOP
  useFrame((state) => {
    const p = scrollProgress.current
    const t = state.clock.elapsedTime

    // Phase timing
    const zoomEndAt = 0.15
    const rotationEndAt = 0.1
    const headVanishAt = 0.15
    const dnaStartAt = 0.20
    const dnaFullAt = 0.35

    const zoomP = Math.min(p / zoomEndAt, 1)
    const rotationP = Math.min(p / rotationEndAt, 1)
    const dnaP = THREE.MathUtils.smoothstep(p, dnaStartAt, dnaFullAt)

    if (groupRef.current) {
      const baseScale = scaleFactor

      // ===== CAMERA WORK =====
      if (p < dnaStartAt) {
        // Phase 1-2: Head zoom + rotation (same as before)
        const zoom = 0.8 + zoomP * 2.5
        groupRef.current.scale.setScalar(baseScale * zoom)
        const startRotation = (22 * Math.PI) / 180
        groupRef.current.rotation.y = startRotation * (1 - rotationP)
        groupRef.current.rotation.z = 0
        groupRef.current.position.x = -center.x * baseScale * zoom
        groupRef.current.position.y = -center.y * baseScale * zoom - (zoomP * 2) - 0.2
        groupRef.current.position.z = -center.z * baseScale * zoom
      } else {
        // Phase 3: DNA Formation
        // Slow dolly-in (zoom closer to the DNA)
        const dnaZoom = 3.3 + dnaP * 0.5
        groupRef.current.scale.setScalar(baseScale * dnaZoom)

        // Tilt the DNA slightly — "floating in liquid" feel
        const tiltAngle = dnaP * (15 * Math.PI / 180) // 15 degrees tilt
        groupRef.current.rotation.z = tiltAngle
        groupRef.current.rotation.y = 0

        // Re-center for DNA view (particles are centered at origin in DNA space)
        groupRef.current.position.x = -center.x * baseScale * dnaZoom
        groupRef.current.position.y = -center.y * baseScale * dnaZoom - 2.2
        groupRef.current.position.z = -center.z * baseScale * dnaZoom
      }
    }

    // Glass head visibility (hides during/after scatter)
    scene.visible = p < headVanishAt

    // Pass uniforms to shader
    if (particleMatRef.current) {
      particleMatRef.current.uTime = t
      particleMatRef.current.uScrollProgress = p
      particleMatRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2)
    }

    // ===== LIGHTING SHIFT =====
    // Warm orange light: Full during Head phases, fades during DNA
    if (warmLightRef.current) {
      const warmIntensity = 5 + (p * p) * 100.0
      const warmFade = 1.0 - THREE.MathUtils.smoothstep(p, 0.17, 0.25)
      warmLightRef.current.intensity = warmIntensity * warmFade
    }

    // Cool blue light: Fades IN during DNA phase for med-tech aesthetic
    if (coolLightRef.current) {
      const coolFade = THREE.MathUtils.smoothstep(p, 0.18, 0.30)
      coolLightRef.current.intensity = coolFade * 3.0
    }
  })

  // Apply glass material to the head model
  useEffect(() => {
    scene.rotation.set(0, 0, 0)
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) {
        mesh.material = glassMaterial
        mesh.renderOrder = 2
      }
    })
  }, [scene, glassMaterial])

  if (allMeshes.length === 0) return null

  return (
    <group ref={groupRef}>
      <group>
        <primitive object={scene} />

        {/* Warm Orange Light (Head + Scatter phases) */}
        <pointLight
          ref={warmLightRef}
          position={[center.x, center.y + 0.25, center.z]}
          color="#ffaa88"
          intensity={5}
          distance={4}
          decay={2}
        />

        {/* Cool Blue Light (DNA phase — med-tech aesthetic) */}
        <pointLight
          ref={coolLightRef}
          position={[0, 0, 2]}
          color="#88ccff"
          intensity={0}
          distance={8}
          decay={1.5}
        />

        {particleGeo && (
          <points
            geometry={particleGeo}
            position={center}
            scale={0.95}
            renderOrder={1}
          >
            {/* @ts-ignore */}
            <dnaMaterial
              ref={particleMatRef}
              transparent={true}
              depthWrite={false}
              depthTest={false}
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
