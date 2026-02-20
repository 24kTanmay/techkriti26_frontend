import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * DnaModelMaterial: Shader for the GLTF-based DNA particle effect.
 * 
 * 3-Stage Transition:
 * 1. Singularity Point (Matches Head's singularity)
 * 2. Scatter Sphere (Pops out briefly)
 * 3. DNA Helix (Final coalesced form)
 */
const DnaModelMaterial = shaderMaterial(
  {
    time: 0,
    uScrollProgress: 0,
    uWarmColor1: new THREE.Color('#ffffff'),
    uWarmColor2: new THREE.Color('#ffccaa'),
    uWarmColor3: new THREE.Color('#ff8866'),
    uColor1: new THREE.Color('#ffffff'),
    uColor2: new THREE.Color('#ffccaa'),
    uColor3: new THREE.Color('#ff8866'),
  },
  /* glsl vertex shader */
  `
    uniform float time;
    uniform float uScrollProgress;

    attribute float randoms;
    attribute vec3 aRandomVec; // For scatter direction
    attribute float colorRandoms;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vColorRandom;
    varying float vMorphProgress;

    void main() {
      vUv = uv;
      vColorRandom = colorRandoms;

      // ============================================
      // 3-STAGE MORPH TIMING
      // ============================================
      // Instantly visible at 0.35 handover
      // 1. Singularity Point -> Scatter Sphere (0.16 -> 0.17)
      float scatterP = smoothstep(0.16, 0.17, uScrollProgress);
      
      // 2. Scatter Sphere -> DNA Helix (0.25 -> 0.35)
      float dnaP = smoothstep(0.25, 0.30, uScrollProgress);
      
      vMorphProgress = dnaP;

      // Local Singularity Center (Matches Head's brainYOffset EXACTLY)
      vec3 singularityCenter = vec3(0.0, 3.7, 0.0);
      
      // Scatter state: A small sphere around the singularity
      float scatterRadius = 0.15; // Tightened from 0.2
      vec3 scatterPos = singularityCenter + aRandomVec * scatterRadius;

      // Interpolate stages
      vec3 pos;
      if (uScrollProgress < 0.25) {
        // Stage 1: Point to Scatter Cloud
        pos = mix(singularityCenter, scatterPos, scatterP);
      } else {
        // Stage 2: Scatter Cloud to DNA Helix
        pos = mix(scatterPos, position, dnaP);
      }

      vPosition = pos;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      // Point size logic (EXTREMELY small to match head system)
      float singularitySize = 2.5;
      float scatterSize = 2.5;
      float dnaSize = 2.0 * randoms + 0.5; 
      
      float finalSize;
      if (uScrollProgress < 0.25) {
        finalSize = mix(singularitySize, scatterSize, scatterP);
      } else {
        finalSize = mix(scatterSize, dnaSize, dnaP);
      }
      
      gl_PointSize = finalSize * (1.0 / -mvPosition.z);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl fragment shader */
  `
    uniform float time;
    uniform float uScrollProgress;
    uniform vec3 uWarmColor1;
    uniform vec3 uWarmColor2;
    uniform vec3 uWarmColor3;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vColorRandom;
    varying float vMorphProgress;

    void main() {
      float alpha = 1.0 - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5)));

      vec3 warmColor = uWarmColor1;
      if (vColorRandom > 0.33 && vColorRandom < 0.66) {
        warmColor = uWarmColor2;
      }
      if (vColorRandom > 0.66) {
        warmColor = uWarmColor3;
      }

      vec3 coolColor = uColor1;
      if (vColorRandom > 0.33 && vColorRandom < 0.66) {
        coolColor = uColor2;
      }
      if (vColorRandom > 0.66) {
        coolColor = uColor3;
      }

      vec3 finalColor = mix(warmColor, coolColor, vMorphProgress);

      // Brightness logic tuned for the new stages
      float scatterP = smoothstep(0.17, 0.25, uScrollProgress);
      float dnaP = smoothstep(0.25, 0.35, uScrollProgress);
      
      float brightness;
      if (uScrollProgress < 0.25) {
        brightness = mix(2.5, 1.5, scatterP);
      } else {
        brightness = mix(1.5, 0.4, dnaP);
      }
      finalColor *= brightness;

      float gradient = smoothstep(0.1, 0.9, vUv.y);
      gradient = mix(1.0, gradient, vMorphProgress);

      // Visibility thresholds (Visible from 0.17 onwards)
      float fadeIn = step(0.17, uScrollProgress);
      float fadeOut = 1.0 - smoothstep(0.25, 0.50, uScrollProgress);
      float scrollAlpha = fadeIn * fadeOut;

      gl_FragColor = vec4(finalColor, alpha * gradient * scrollAlpha);
    }
  `
)

extend({ DnaModelMaterial })

export { DnaModelMaterial }
