import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const HelixMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#9966dd'),
    uPulseColor: new THREE.Color('#cc99ff'),
    uScrollProgress: 0,
    uPulseIntensity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    uniform float uScrollProgress;
    uniform float uTime;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Vertical stretching based on scroll
      vec3 pos = position;
      pos.y *= (1.0 + uScrollProgress * 2.0);
      
      // "Untwisting" effect - slight rotation offset along y based on scroll
      float angle = uScrollProgress * position.y * 2.0;
      float c = cos(angle);
      float s = sin(angle);
      mat2 m = mat2(c, -s, s, c);
      pos.xz = m * pos.xz;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uPulseColor;
    uniform float uScrollProgress;
    uniform float uPulseIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel for glass look
      float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
      
      // Flowing data effect using UVs
      float flow = sin(vUv.y * 20.0 - uTime * 5.0) * 0.5 + 0.5;
      flow *= sin(vUv.x * 10.0 + uTime * 2.0) * 0.5 + 0.5;
      
      // Pulse effect
      float pulse = (sin(uTime * 2.0) * 0.5 + 0.5) * uPulseIntensity;
      
      // Mix base color with flow and pulse
      vec3 finalColor = mix(uColor, uPulseColor, flow * 0.5 + pulse * 0.5);
      
      // Opacity/Alpha
      float alpha = 0.7 + fresnel * 0.3;
      
      gl_FragColor = vec4(finalColor + fresnel * 0.8, alpha);
    }
  `
)

extend({ HelixMaterial })

export { HelixMaterial }
