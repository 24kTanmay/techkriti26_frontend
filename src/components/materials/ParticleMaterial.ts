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

    void main() {
      // --- PHASE 1: SCATTER (Explosion) ---
      // Particles move from brain shape to a wider sphere
      float scatterStart = 0.1; 
      float scatterEnd = 0.15;   
      // Normalize scroll to a 0-1 range for this specific window
      float p1 = clamp((uScrollProgress - scatterStart) / (scatterEnd - scatterStart), 0.0, 1.0);

      // --- PHASE 2: SINGULARITY (Implosion) ---
      // Particles suck into a tiny center point
      float concStart = 0.15;   
      float concEnd = 0.17;      
      float p2 = clamp((uScrollProgress - concStart) / (concEnd - concStart), 0.0, 1.0);

      // Apply easing to the scatter phase so it feels organic
      float smoothP1 = smoothstep(0.0, 1.0, p1);
      
      vec3 pos;
      if (uScrollProgress < concStart) {
        // Linearly interpolate between the head shape and the explosion burst
        pos = mix(aStartPos, aSpreadPos, smoothP1);
      } else {
        // Linearly interpolate between the explosion and the final orb
        // Use pure p2 to ensure perfect spherical symmetry during contraction
        pos = mix(aSpreadPos, aEndPos, p2);
      }

      // --- NEURAL JITTER ---
      // Adds a high-frequency vibration to make them feel like "alive" signals
      float jitterFreq = 4.0; 
      float jitterAmp = 0.02 * (1.0 - uScrollProgress); // Reduce jitter as they contract

      vec3 jitterDir = vec3(
          sin(uTime * jitterFreq + aRandom.x * 10.0),
          cos(uTime * jitterFreq + aRandom.y * 10.0),
          sin(uTime * jitterFreq + aRandom.z * 10.0)
      );
      pos += normalize(jitterDir) * jitterAmp; 

      // Project the 3D position to the 2D screen
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // --- PARTICLE SIZING ---
      // Give each particle a slightly different size for depth
      float randomSize = 1.0 + aRandom.x * 2.0; 
      // Shrink them slightly (from base 8 to 3) as they reach the singularity
      float sizeFactor = mix(8.0, 3.0, p2) * randomSize; 
      
      // gl_PointSize handles the diameter of the point sprite
      gl_PointSize = sizeFactor * uPixelRatio;
      // Perspective Scaling: Divide by depth (-mvPosition.z) so closer particles are bigger
      gl_PointSize *= (1.0 / -mvPosition.z);

      // --- TWINKLE & FADE ---
      // Base alpha with a slow twinkle sine wave
      float baseAlpha = 0.8 + 0.2 * sin(uTime * 3.0 + aRandom.y * 10.0);
      
      // FADE OUT Logic: Completely vanish between 17% and 20% scroll
      // This clears the screen exactly when the DNA starts appearing
      float fadeOut = 1.0 - smoothstep(0.17, 0.20, uScrollProgress);
      
      vAlpha = baseAlpha * fadeOut;
      vColor = color;
    }
  `,
  /* glsl fragment shader */ `
    uniform vec3 uColor;
    uniform sampler2D uMap;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      // --- ROUNDNESS FIX ---
      // WebGL points are naturally squares. We must "mask" them into circles.
      // gl_PointCoord goes from 0 to 1 across the point sprite.
      vec2 uv = gl_PointCoord - vec2(0.5); // Center the coordinates at 0,0
      float dist = length(uv);             // Distance from center
      
      // If the pixel is further than the radius (0.5), throw it away (transparency)
      if (dist > 0.5) discard; 

      // --- SOFT FALLOFF ---
      // Create a smooth radial gradient so the center is hot and the edge is soft
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Sample the radial glow texture generated in Head.tsx
      vec4 texColor = texture2D(uMap, gl_PointCoord);

      // Final Color composition
      // Multiply by 4.0 for a "Glow" effect that works well with Bloom
      vec3 finalColor = vColor * 4.0 * strength; 

      // Set the final pixel output
      // Combining falloff, texture alpha, and global fade-out alpha
      gl_FragColor = vec4(finalColor, strength * texColor.a * vAlpha);
    }
  `
)

// Register the custom element so it can be used as <particleMaterial /> in JSX
extend({ ParticleMaterial })

export { ParticleMaterial }