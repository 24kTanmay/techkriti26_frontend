import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ffffff'),
    uScrollProgress: 0,
    uPixelRatio: 1,
    uMap: null,
  },
  /* glsl vertex shader */ `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uPixelRatio;

    attribute vec3 aRandom;
    attribute vec3 aStartPos;
    attribute vec3 aSpreadPos;
    attribute vec3 aEndPos;
    attribute vec3 color;

    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      float scatterStart = 0.1; // When it starts moving
      float scatterEnd = 0.15;   // When it reaches full scatter (Increase this to SLOW DOWN)
      float p1 = clamp((uScrollProgress - scatterStart) / (scatterEnd - scatterStart), 0.0, 1.0);

      // 2. CONCENTRATE SPEED (Singularity)
      float concStart = 0.15;   // When it starts sucking in
      float concEnd = 0.17;      // When it hits the center
  
      float p2 = clamp((uScrollProgress - concStart) / (concEnd - concStart), 0.0, 1.0);

      // Apply easing (makes it feel premium/smooth)
      float smoothP1 = smoothstep(0.0, 1.0, p1);
      
      vec3 pos;
      if (uScrollProgress < concStart) {
        pos = mix(aStartPos, aSpreadPos, smoothP1);
      } else {
        // Use pure p2 here to ensure they reach aEndPos (which is a sphere)
        pos = mix(aSpreadPos, aEndPos, p2);
      }

      // Add "Neural" noise - fast, high frequency vibration
      float jitterFreq = 4.0; 
      float jitterAmp = 0.02 * (1.0 - uScrollProgress); // Less jitter as they explode
      
      pos.x += sin(uTime * jitterFreq + aRandom.x * 10.0) * jitterAmp;
      pos.y += cos(uTime * jitterFreq + aRandom.y * 10.0) * jitterAmp;
      pos.z += sin(uTime * jitterFreq + aRandom.z * 10.0) * jitterAmp;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // --- KEY CHANGE: SIZE ---
      // Original was 25.0 -> 65.0 (Too big!)
      // New: 8.0 -> 30.0 (Much finer dust)
      
      // We vary size by aRandom.x to give depth (some small, some big)
      float randomSize = 1.0 + aRandom.x * 2.0; 
      
      float sizeFactor = mix(8.0, 3.0, p2) * randomSize; 
      
      gl_PointSize = sizeFactor * uPixelRatio;
      gl_PointSize *= (1.0 / -mvPosition.z);

      // --- FADE OUT Logic ---
      // Fade out between 17% and 20% so it's gone when DNA appears at 20%
      float fadeOut = 1.0 - smoothstep(0.17, 0.20, uScrollProgress);
      vAlpha = (0.8 + 0.2 * sin(uTime * 3.0 + aRandom.y * 10.0)) * fadeOut;
      vColor = color;
    }
  `,
  /* glsl fragment shader */ `
    uniform vec3 uColor;
    uniform sampler2D uMap;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      // ✅ 1. FORCE ROUNDNESS
      vec2 uv = gl_PointCoord - vec2(0.5);
      float dist = length(uv);
      
      // If the pixel is outside the circle, discard
      if (dist > 0.5) discard; 

      // 2. SOFT FALLOFF
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Use the radial texture map for the specific texture look
      vec4 texColor = texture2D(uMap, gl_PointCoord);

      // Combine color, texture, and round falloff
      vec3 finalColor = vColor * 4.0 * strength; // Slightly bright but controlled

      gl_FragColor = vec4(finalColor, strength * texColor.a * vAlpha);
    }
  `
)

extend({ ParticleMaterial })

export { ParticleMaterial }