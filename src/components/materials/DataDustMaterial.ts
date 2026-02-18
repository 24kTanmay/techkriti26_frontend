import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const DataDustMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#cc99ff'),
        uScrollProgress: 0,
        uPixelRatio: 1,
    },
    // Vertex Shader
    `
    uniform float uTime;
    uniform float uScrollProgress;
    uniform float uPixelRatio;

    attribute vec3 aRandom;

    varying float vAlpha;

    void main() {
      vec3 pos = position;
      
      // Shedding effect: particles drift away based on scroll and time
      // They move away from the axis (XZ) and drift down/up (Y)
      float t = uTime * 0.2 + aRandom.x * 10.0;
      pos.x += sin(t) * aRandom.y * uScrollProgress * 5.0;
      pos.z += cos(t) * aRandom.z * uScrollProgress * 5.0;
      pos.y += (aRandom.x - 0.5) * uScrollProgress * 10.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = 10.0 * uPixelRatio * (1.0 / -mvPosition.z);
      
      // Fade out based on distance and scroll
      vAlpha = smoothstep(0.1, 0.5, 1.0 - uScrollProgress * aRandom.x);
    }
  `,
    // Fragment Shader
    `
    varying float vAlpha;
    uniform vec3 uColor;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      // Grainy digital look
      float grain = fract(sin(dot(gl_PointCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      
      gl_FragColor = vec4(uColor, vAlpha * grain);
    }
  `
)

extend({ DataDustMaterial })

export { DataDustMaterial }
