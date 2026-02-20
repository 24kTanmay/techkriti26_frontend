import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ParticleMaterial: A custom ShaderMaterial for the neural particles.
 * 
 * This material handles:
 * 1. The three-stage motion: Initial -> Scatter (Explosion) -> Singularity (Implosion).
 * 2. High-frequency "neural" jitter/noise.
 * 3. Perspective-aware point sizing with a clamp/limit.
 * 4. Fragment-level roundness to prevent boxy artifacts.
 */
const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,                   // Elapsed time for animations (jitter/twinkle)
    uColor: new THREE.Color('#ffffff'),
    uScrollProgress: 0,          // Normalized scroll value (0 to 1) from page.tsx
    uPixelRatio: 1,             // Screen pixel ratio for size consistency
    uMap: null,                 // Radial glow texture generated in Head.tsx
  },
  /* glsl vertex shader */ `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uPixelRatio;

    // Attributes passed from the BufferGeometry in Head.tsx
    attribute vec3 aRandom;     // Unique random values per particle
    attribute vec3 aStartPos;   // Initial brain-shaped position
    attribute vec3 aSpreadPos;  // Target explosion position
    attribute vec3 aEndPos;     // Target singularity position (center)
    attribute vec3 color;       // Unique color from palette

    varying float vAlpha;       // Pass transparency to fragment shader
    varying vec3 vColor;        // Pass color to fragment shader
    varying float vP2;          // Pass contraction progress for dynamic brightness

    void main() {
      // --- PHASE 1: SCATTER (Explosion) ---
      float scatterStart = 0.1; 
      float scatterEnd = 0.15;   
      float p1 = clamp((uScrollProgress - scatterStart) / (scatterEnd - scatterStart), 0.0, 1.0);

      // --- PHASE 2: SINGULARITY (Implosion) ---
      float concStart = 0.16;   
      float concEnd = 0.20;      
      float p2 = clamp((uScrollProgress - concStart) / (concEnd - concStart), 0.0, 1.0);
      vP2 = p2; // Pass to fragment shader

      // Apply easing to the scatter phase so it feels organic
      float smoothP1 = smoothstep(0.0, 1.0, p1);
      
      vec3 pos;
      if (uScrollProgress < concStart) {
        pos = mix(aStartPos, aSpreadPos, smoothP1);
      } else {
        pos = mix(aSpreadPos, aEndPos, p2);
      }

      // --- NEURAL JITTER ---
      float jitterFreq = 4.0; 
      float jitterAmp = 0.02 * (1.0 - uScrollProgress); 

      vec3 jitterDir = vec3(
          sin(uTime * jitterFreq + aRandom.x * 10.0),
          cos(uTime * jitterFreq + aRandom.y * 10.0),
          sin(uTime * jitterFreq + aRandom.z * 10.0)
      );
      pos += normalize(jitterDir) * jitterAmp; 

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // --- PARTICLE SIZING ---
      float randomSize = 1.0 + aRandom.x * 2.0; 
      // Aggressively reduced end size from 1.5 to 0.2
      // This will make the individual particles almost invisible at the center point
      float sizeFactor = mix(8.0, 0.2, p2) * randomSize; 
      
      gl_PointSize = sizeFactor * uPixelRatio;
      gl_PointSize *= (1.0 / -mvPosition.z);

      // --- TWINKLE & FADE ---
      float baseAlpha = 0.8 + 0.2 * sin(uTime * 3.0 + aRandom.y * 10.0);
      float fadeOut = 1.0 - step(0.17, uScrollProgress); // Hard cut at 0.17
      
      vAlpha = baseAlpha * fadeOut;
      vColor = color;
    }
  `,
  /* glsl fragment shader */ `
    uniform vec3 uColor;
    uniform sampler2D uMap;
    varying float vAlpha;
    varying vec3 vColor;
    varying float vP2;

    void main() {
      // --- ROUNDNESS FIX ---
      vec2 uv = gl_PointCoord - vec2(0.5); 
      float dist = length(uv);             
      
      if (dist > 0.5) discard; 

      // --- SOFT FALLOFF ---
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      
      vec4 texColor = texture2D(uMap, gl_PointCoord);
      
      // --- DYNAMIC BRIGHTNESS ---
      // At scatter (p2=0), brightness is 4.0 (normal).
      // At singularity end (p2=1), brightness ramps up to 10.0.
      // Kept moderate so bloom doesn't inflate the circle size.
      float brightnessBoost = 4.0 + (vP2 * 6.0);

      vec3 finalColor = vColor * brightnessBoost * strength; 

      gl_FragColor = vec4(finalColor, strength * texColor.a * vAlpha);
    }
  `
)

// Register the custom element so it can be used as <particleMaterial /> in JSX
extend({ ParticleMaterial })

export { ParticleMaterial }