"use client"

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

function StarField() {
  const starsRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    starsRef.current.rotation.y += 0.0005
    starsRef.current.rotation.x += 0.0002
  })

  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

function FloatingCore() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.z = t * 0.1
    meshRef.current.rotation.y = t * 0.05
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 15]} />
        <meshStandardMaterial 
          color="#00ffff" 
          wireframe 
          emissive="#00ffff" 
          emissiveIntensity={2} 
          transparent 
          opacity={0.3} 
        />
      </mesh>
      <pointLight color="#00ffff" intensity={2} distance={10} />
    </Float>
  )
}

export default function Custom_space() {
  return (
    <div className="w-full h-full bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <StarField />
        <FloatingCore />
        
        <Text
          position={[0, -2, 0]}
          fontSize={0.2}
          color="white"
          font="https://fonts.gstatic.com/s/orbitron/v11/yMJRMIPrAK9A6pqXbHjk7RE29p7Ogw.woff"
          maxWidth={2}
          textAlign="center"
        >
          COSMIC ORDER IS ESTABLISHED
        </Text>
      </Canvas>
    </div>
  )
}
