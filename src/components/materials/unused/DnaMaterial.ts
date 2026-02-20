import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * DnaMaterial: A custom ShaderMaterial for the full particle lifecycle.
 * 
 * 4 Phases controlled by uScrollProgress:
 * 1. Brain Shape (initial) → Scatter (explosion)
 * 2. Scatter → Singularity (implosion to tiny orb)
 * 3. Singularity → DNA Helix (structured evolution)
 * 4. Fade-out after DNA is fully formed
 * 
 * Features:
 * - Dynamic color morphing (warm fire → cool tech palette)
 * - Per-phase brightness control
 * - Jitter damping as DNA forms (organic chaos → geometric precision)
 * - Smooth size transitions between phases
 */
const DnaMaterial = shaderMaterial(
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

    // Per-particle attributes
    attribute vec3 aRandom;
    attribute vec3 aStartPos;    // Brain shape
    attribute vec3 aSpreadPos;   // Explosion sphere
    attribute vec3 aEndPos;      // Singularity center
    attribute vec3 aDnaPos;      // DNA helix target
    attribute vec3 color;        // Original fire palette color
    attribute vec3 aDnaColor;    // Tech palette color for DNA

    varying float vAlpha;
    varying vec3 vColor;
    varying float vPhase;        // Which phase are we in (for fragment shader)

    void main() {
      // ============================================
      // PHASE 1: SCATTER (Brain → Explosion)
      // Scroll: 0.10 → 0.15
      // ============================================
      float scatterStart = 0.1; 
      float scatterEnd = 0.15;   
      float p1 = clamp((uScrollProgress - scatterStart) / (scatterEnd - scatterStart), 0.0, 1.0);

      // ============================================
      // PHASE 2: SINGULARITY (Explosion → Tiny Orb)
      // Scroll: 0.15 → 0.17
      // ============================================
      float concStart = 0.15;   
      float concEnd = 0.17;      
      float p2 = clamp((uScrollProgress - concStart) / (concEnd - concStart), 0.0, 1.0);

      // ============================================
      // PHASE 3: DNA EVOLUTION (Singularity → Helix)
      // Scroll: 0.20 → 0.35
      // ============================================
      float dnaStart = 0.20;
      float dnaEnd = 0.35;
      float p3 = clamp((uScrollProgress - dnaStart) / (dnaEnd - dnaStart), 0.0, 1.0);
      float smoothP3 = smoothstep(0.0, 1.0, p3);

      // Track phase for fragment shader
      vPhase = p3;

      // Apply easing to the scatter phase
      float smoothP1 = smoothstep(0.0, 1.0, p1);
      
      // ============================================
      // POSITION INTERPOLATION
      // ============================================
      vec3 pos;
      if (uScrollProgress < concStart) {
        // Phase 1: Brain → Explosion
        pos = mix(aStartPos, aSpreadPos, smoothP1);
      } else if (uScrollProgress < dnaStart) {
        // Phase 2: Explosion → Singularity
        pos = mix(aSpreadPos, aEndPos, p2);
      } else {
        // Phase 3: Singularity → DNA Helix
        pos = mix(aEndPos, aDnaPos, smoothP3);
      }

      // ============================================
      // NEURAL JITTER (Dampens as DNA forms)
      // ============================================
      float jitterFreq = 4.0; 
      // Jitter is full during brain/scatter, reduces during singularity,
      // and becomes near-zero during DNA (structural precision)
      float jitterDampen = 1.0 - smoothP3 * 0.95; // 95% reduction at full DNA
      float jitterAmp = 0.02 * (1.0 - p2 * 0.5) * jitterDampen;

      vec3 jitterDir = vec3(
          sin(uTime * jitterFreq + aRandom.x * 10.0),
          cos(uTime * jitterFreq + aRandom.y * 10.0),
          sin(uTime * jitterFreq + aRandom.z * 10.0)
      );
      pos += normalize(jitterDir) * jitterAmp; 

      // Add a gentle slow rotation to the DNA once formed
      if (uScrollProgress > dnaStart) {
        float rotSpeed = 0.3;
        float rotAngle = uTime * rotSpeed * smoothP3;
        float cosR = cos(rotAngle);
        float sinR = sin(rotAngle);
        vec3 rotated = vec3(
          pos.x * cosR - pos.z * sinR,
          pos.y,
          pos.x * sinR + pos.z * cosR
        );
        pos = mix(pos, rotated, smoothP3);
      }

      // Project to screen
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // ============================================
      // PARTICLE SIZING
      // ============================================
      float randomSize = 1.0 + aRandom.x * 2.0; 
      
      // Size transitions:
      // - Brain/Scatter: base 8.0
      // - Singularity: shrinks to 0.2
      // - DNA: grows back to 5.0 (structured beads)
      float scatterSize = 8.0;
      float singularitySize = mix(scatterSize, 0.2, p2);
      float dnaSize = mix(singularitySize, 5.0, smoothP3);
      float sizeFactor = dnaSize * randomSize;
      
      gl_PointSize = sizeFactor * uPixelRatio;
      gl_PointSize *= (1.0 / -mvPosition.z);

      // ============================================
      // COLOR MORPHING (Fire → Tech)
      // ============================================
      // During phases 1-2: Use original fire palette (color attribute)
      // During phase 3: Transition to DNA tech palette (aDnaColor attribute)
      vColor = mix(color, aDnaColor, smoothP3);

      // ============================================
      // ALPHA / FADE
      // ============================================
      float baseAlpha = 0.8 + 0.2 * sin(uTime * 3.0 + aRandom.y * 10.0);
      
      // Singularity brightness boost (p2 active, p3 not yet)
      float singularityBrightness = (uScrollProgress < dnaStart) ? p2 : 0.0;
      
      // Fade-out: Particles vanish after DNA is fully formed
      // DNA fully formed at 0.35, fade out by 0.45
      float fadeOut = 1.0 - smoothstep(0.40, 0.50, uScrollProgress);
      
      vAlpha = baseAlpha * fadeOut;
    }
  `,
  /* glsl fragment shader */ `
    uniform vec3 uColor;
    uniform sampler2D uMap;
    varying float vAlpha;
    varying vec3 vColor;
    varying float vPhase;

    void main() {
      // Roundness fix — mask square sprites into circles
      vec2 uv = gl_PointCoord - vec2(0.5); 
      float dist = length(uv);             
      if (dist > 0.5) discard; 

      // Soft radial falloff
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Sample glow texture
      vec4 texColor = texture2D(uMap, gl_PointCoord);
      
      // Dynamic brightness:
      // - Base phases: 4.0 (normal glow)
      // - DNA phase: ramps up to 6.0 (the tech beads should "pop")
      float brightnessBoost = mix(4.0, 6.0, vPhase);

      vec3 finalColor = vColor * brightnessBoost * strength; 

      gl_FragColor = vec4(finalColor, strength * texColor.a * vAlpha);
    }
  `
)

extend({ DnaMaterial })

export { DnaMaterial }
