'use client'

import React, { Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Head } from './Head/Head'
import { Dna } from './Dna/Dna'
import { Nebula } from './nebula/Nebula'

import {
  ScrollProgressProvider,
  useScrollProgress
} from '@/context/ScrollProgressContext'

import { PHASES, phaseProgress } from '@/config/scrollPhases'


gsap.registerPlugin(ScrollTrigger)



/* ----------------- CAMERA CONTROLLER ----------------- */
/*
 *  Phase 1  Head circular orbit   (PHASES.HEAD_CAMERA_ORBIT)
 *  Phase 2  Head Z-axis close-in  (PHASES.HEAD_CAMERA_ZOOM)
 *  Phase 3  Return to default     (PHASES.HEAD_CAMERA_RETURN)
 */

function CameraController() {

  const progressRef = useScrollProgress()


  useFrame(({ camera }) => {

    const p = progressRef.current

    // Phase 4: fully release camera
    if (p > PHASES.HEAD_CAMERA_RETURN.end) return


    /* ---- Constants for Head Section ---- */

    const headLookAt  = new THREE.Vector3(-0.09, 0.8, 0)
    const defaultLookAt = new THREE.Vector3(-0.09, 0.8, 0)
    
    // Initial Orbit Params (matches your [-4, 0.3, 4] start)
    const orbitRadius = Math.sqrt(4 * 4 + (-4) * (-4)) // ~5.65
    const startAngle = Math.atan2(-4, 4) // -PI/4
    const endOrbitAngle = 0 // Ending point of orbit (straight ahead)
    
    const startY = 0.3
    const zoomEndY = 0.8
    const zoomEndZ = 0.8
    const zoomEndX = -0.5


    /* ---- State variables for lerping between phases ---- */
    let currentX, currentY, currentZ


    if (p <= PHASES.HEAD_CAMERA_ORBIT.end) {
      /* ---- Phase 1: Circular Orbit ---- */
      const orbitP = phaseProgress(p, PHASES.HEAD_CAMERA_ORBIT)
      const angle = THREE.MathUtils.lerp(startAngle, endOrbitAngle, orbitP)
      
      currentX = Math.sin(angle) * orbitRadius
      currentY = startY
      currentZ = Math.cos(angle) * orbitRadius

    } else if (p <= PHASES.HEAD_CAMERA_ZOOM.end) {
      /* ---- Phase 2: Z-Axis Closing ---- */
      const zoomP = phaseProgress(p, PHASES.HEAD_CAMERA_ZOOM)
      
      // Starting from orbit end position
      const orbitEndX = Math.sin(endOrbitAngle) * orbitRadius
      const orbitEndZ = Math.cos(endOrbitAngle) * orbitRadius
      
      currentX = THREE.MathUtils.lerp(orbitEndX, zoomEndX, zoomP)
      currentY = THREE.MathUtils.lerp(startY, zoomEndY, zoomP)
      currentZ = THREE.MathUtils.lerp(orbitEndZ, zoomEndZ, zoomP)

    } else {
      /* ---- Phase 3: Return to Default ---- */
      const returnP = phaseProgress(p, PHASES.HEAD_CAMERA_RETURN)
      
      const defaultX = 0, defaultY = 0, defaultZ = 5
      const actualDefaultLookAt = new THREE.Vector3(0, 0, 0) // DNA focus

      currentX = THREE.MathUtils.lerp(zoomEndX, defaultX, returnP)
      currentY = THREE.MathUtils.lerp(zoomEndY, defaultY, returnP)
      currentZ = THREE.MathUtils.lerp(zoomEndZ, defaultZ, returnP)
      
      const look = headLookAt.clone().lerp(actualDefaultLookAt, returnP)
      camera.lookAt(look)
      
      camera.position.set(currentX, currentY, currentZ)
      return
    }

    camera.position.set(currentX, currentY, currentZ)
    camera.lookAt(headLookAt)

  })


  return null

}




/* ----------------- SCENE ----------------- */

function SceneContent() {

  const progressRef = useScrollProgress()

  const [mounted, setMounted] = React.useState(false)



  useEffect(() => {

    setMounted(true)

  }, [])



  useEffect(() => {

    if (!mounted) return


    const ctx = gsap.context(() => {

      ScrollTrigger.create({

        trigger: '#scroll-trigger',

        start: 'top top',

        end: 'bottom bottom',

        scrub: 2.5,

        onUpdate: self => {

          progressRef.current =
            self.progress

        }

      })

    })


    return () => ctx.revert()

  }, [mounted])



  if (!mounted) return null



  return (

    <Canvas

      camera={{

        position: [-3, 0.5, 3.32],

        fov: 25,

        near: 0.1,

        far: 1000

      }}


      onCreated={({ camera }) =>
        camera.lookAt(0, 1, 0)
      }


      gl={{

        antialias: false,

        toneMapping:
          THREE.ACESFilmicToneMapping,

        powerPreference:
          'high-performance',

        alpha: true

      }}


      dpr={[1, 1.5]}

      style={{ background: '#050505' }}

    >


      <color
        attach="background"
        args={['#050505']}
      />


      <CameraController />


      <ambientLight intensity={0.4} />


      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
      />


      <pointLight
        position={[-3, 2, 4]}
        intensity={1}
        color="#aa77ee"
      />


      <pointLight
        position={[0, 0, -4]}
        intensity={0.8}
        color="#cc99ff"
      />



      <Suspense fallback={null}>

        <Head />

        <Dna />


        <Nebula />


        <Environment
          preset="city"
          background={false}
        />


        <EffectComposer>

          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.3}
            intensity={0.25}
          />

        </EffectComposer>


      </Suspense>


      <Preload all />


    </Canvas>

  )

}




/* ----------------- EXPORT ----------------- */

export default function Scene() {

  return (

    <ScrollProgressProvider>

      <SceneContent />

    </ScrollProgressProvider>

  )

}