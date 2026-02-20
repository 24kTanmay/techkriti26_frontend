
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const GlassMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#9966dd'),
        uFresnelBias: 0.1,
        uFresnelScale: 1.5,
        uFresnelPower: 3.0,
        uScrollProgress: 0,
    },
  // ─── Vertex Shader ───
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // ─── Fragment Shader ───
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uFresnelBias;
    uniform float uFresnelScale;
    uniform float uFresnelPower;
    uniform float uScrollProgress;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel – bright edges, transparent center
      float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - abs(dot(viewDir, normal)), uFresnelPower);
      fresnel = clamp(fresnel, 0.0, 1.0);

      // Subtle animated shimmer
      float shimmer = sin(vWorldPosition.y * 10.0 + uTime * 2.0) * 0.05 + 0.95;

      // Alpha dissolves as user scrolls
      float alpha = fresnel * shimmer * (1.0 - uScrollProgress * 1.2);
      alpha = clamp(alpha, 0.0, 1.0);

      // Slight blue-to-white gradient on edges
      vec3 col = mix(uColor, vec3(1.0), fresnel * 0.5);

      gl_FragColor = vec4(col, alpha);
    }
  `
)

extend({ GlassMaterial })

export { GlassMaterial }
