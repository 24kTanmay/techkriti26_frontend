'use client'

import React, { useMemo, useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GalaxyGeometry, GalaxyShader } from './'
import { useScrollProgress } from '../Scene'

// ─── Hoisted constants: computed once at module load, not every render ───
const ORBIT_CONFIG = {
  rotateSpeed: 0.005,
  dampingFactor: 0.05,
  inertiaDecay: 0.95,
  minPhi: 0.3,
  maxPhi: Math.PI - 0.3,
}

const NEBULA_PALETTE = [
  new THREE.Color(1.0, 0.9, 0.8),
  new THREE.Color(1.0, 0.6, 0.8),
  new THREE.Color(0.6, 0.4, 1.0),
  new THREE.Color(0.2, 0.3, 0.8)
]

const NEBULA_CONFIG = {
  spiralCount: 5,
  turnsPerSpiral: 0.8,
  totalStars: 12000,
  pointSize: 2.8,
  blackHoleRadius: 0.25,
  colorMode: 1,
  colorPalette: NEBULA_PALETTE,
  colorIntensity: 1.1,
  appearanceStart: 0.45,
  appearanceEnd: 0.50,
  vanishStart: 0.90,
  vanishEnd: 0.99
}

export const Nebula = () => {
  const { size, gl } = useThree()
  const groupRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Points>(null!)
  const progressRef = useScrollProgress()
  
  // ─── Manual Orbit State (mimics OrbitControls behavior) ───
const orbitState = useRef({
  isDragging: false,

  theta: -0.2680,
  phi: 0.3762,

  targetTheta: -0.2680,
  targetPhi: 0.3762,

  prevX: 0,
  prevY: 0,

  velocityTheta: 0,
  velocityPhi: 0,
})

  const geometry = useMemo(() => new GalaxyGeometry(NEBULA_CONFIG.totalStars), [])
  
  const material = useMemo(() => new GalaxyShader({
    ...NEBULA_CONFIG,
    pointSize: 20,
    resolution: new THREE.Vector2(size.width, size.height),
    fadeNear: 0.1,
    fadeFar: 50.0
  }), [])

  // ─── Mouse Event Handlers ───
  const onPointerDown = useCallback((e: PointerEvent) => {
    // Only activate on left-click (button 0)
    if (e.button !== 0) return
    const state = orbitState.current
    state.isDragging = true
    state.prevX = e.clientX
    state.prevY = e.clientY
    state.velocityTheta = 0
    state.velocityPhi = 0
  }, [])

  const onPointerMove = useCallback((e: PointerEvent) => {
    const state = orbitState.current
    if (!state.isDragging) return

    const deltaX = e.clientX - state.prevX
    const deltaY = e.clientY - state.prevY

    // Update target angles (like OrbitControls does internally)
    state.targetTheta -= deltaX * ORBIT_CONFIG.rotateSpeed
    state.targetPhi -= deltaY * ORBIT_CONFIG.rotateSpeed

    // Clamp phi to prevent flipping
    state.targetPhi = Math.max(ORBIT_CONFIG.minPhi, Math.min(ORBIT_CONFIG.maxPhi, state.targetPhi))

    // Store velocity for inertia
    state.velocityTheta = -deltaX * ORBIT_CONFIG.rotateSpeed
    state.velocityPhi = -deltaY * ORBIT_CONFIG.rotateSpeed

    state.prevX = e.clientX
    state.prevY = e.clientY
  }, [])

  const onPointerUp = useCallback(() => {
    orbitState.current.isDragging = false
  }, [])

  // ─── Attach listeners to the Canvas DOM element ───
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl, onPointerDown, onPointerMove, onPointerUp])

  // ─── Render Loop ───
  useFrame((state) => {
    const p = progressRef.current;
    const os = orbitState.current;
    // const gp = groupRef.current
    (window as any).nebulaGroup = groupRef.current;
    (window as any).orbit = os;
    // --- Shader Updates ---
    if (material.uniforms) {
      material.uniforms.u_time.value = state.clock.getElapsedTime() * 0.05
      // ─── Optimization: resolution only set in useEffect on size change, not every frame
      
      // Combined opacity logic: Appearance (Fade In) then Vanish (Fade Out)
      const appearance = THREE.MathUtils.smoothstep(p, NEBULA_CONFIG.appearanceStart, NEBULA_CONFIG.appearanceEnd)
      const disappearance = 1.0 - THREE.MathUtils.smoothstep(p, NEBULA_CONFIG.vanishStart, NEBULA_CONFIG.vanishEnd)
      const nebulaOpacity = appearance * disappearance
      
      material.uniforms.u_colorIntensity.value = NEBULA_CONFIG.colorIntensity * nebulaOpacity
    }

    // --- Manual Orbit: Inertia (apply velocity when not dragging) ---
    if (!os.isDragging) {
      os.targetTheta += os.velocityTheta
      os.targetPhi += os.velocityPhi

      // Clamp phi
      os.targetPhi = Math.max(ORBIT_CONFIG.minPhi, Math.min(ORBIT_CONFIG.maxPhi, os.targetPhi))

      // Decay velocity (inertia slowdown)
      os.velocityTheta *= ORBIT_CONFIG.inertiaDecay
      os.velocityPhi *= ORBIT_CONFIG.inertiaDecay

      // Kill micro-velocity
      if (Math.abs(os.velocityTheta) < 0.00001) os.velocityTheta = 0
      if (Math.abs(os.velocityPhi) < 0.00001) os.velocityPhi = 0
    }

    // --- Manual Orbit: Damping (smooth interpolation toward target) ---
    os.theta += (os.targetTheta - os.theta) * ORBIT_CONFIG.dampingFactor
    os.phi += (os.targetPhi - os.phi) * ORBIT_CONFIG.dampingFactor

    // --- Apply Rotation to Group ---
    if (groupRef.current) {
      // Convert spherical angles to Euler rotation on the group
      // This mimics OrbitControls orbiting around the Nebula's center
      groupRef.current.rotation.y = os.theta
      groupRef.current.rotation.x = os.phi - Math.PI / 2 // Offset so phi=PI/2 means "equator" (no tilt)
    }

    // --- Subtle auto-rotation for ambient motion ---
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.0002
    }
  })

  useEffect(() => {
    if (material.uniforms) {
      material.uniforms.u_resolution.value.set(size.width, size.height)
    }
  }, [size])

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <points 
        ref={meshRef} 
        geometry={geometry} 
        material={material} 
        scale={[4.0, 4.0, 4.0]} 
      />
    </group>
  )
}
