import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { HeroFallback } from './HeroFallback';

interface HeroCanvasProps {
  replayToken?: number;
  onProgressUpdate?: (percent: number, phase: 'integrating' | 'converged') => void;
}

interface DisposableResource {
  dispose: () => void;
}

const ATTRACTOR_STEPS = 6800;
const ATTRACTOR_DT = 0.0115;

function aizawaDerivative(x: number, y: number, z: number): [number, number, number] {
  const a = 0.95;
  const b = 0.7;
  const c = 0.6;
  const d = 3.5;
  const e = 0.25;
  const f = 0.1;

  return [
    (z - b) * x - d * y,
    d * x + (z - b) * y,
    c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x,
  ];
}

function integrateAizawaTrajectory(
  seed: [number, number, number],
  steps: number,
  dt: number,
  scale: number,
): Float32Array {
  const points = new Float32Array(steps * 3);
  let [x, y, z] = seed;

  for (let i = 0; i < steps; i += 1) {
    const k1 = aizawaDerivative(x, y, z);
    const k2 = aizawaDerivative(
      x + 0.5 * dt * k1[0],
      y + 0.5 * dt * k1[1],
      z + 0.5 * dt * k1[2],
    );
    const k3 = aizawaDerivative(
      x + 0.5 * dt * k2[0],
      y + 0.5 * dt * k2[1],
      z + 0.5 * dt * k2[2],
    );
    const k4 = aizawaDerivative(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2]);

    x += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    y += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    z += (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);

    // Map (x, z - avgZ, y) so the vortex axis tilts naturally across 3D space
    points[i * 3] = x * scale;
    points[i * 3 + 1] = (z - 0.718) * scale;
    points[i * 3 + 2] = y * scale;
  }

  return points;
}

const HALO_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HALO_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - vec2(0.5)) * vec2(1.0, 1.35);
    float dist = length(centered);
    float wash = exp(-dist * dist * 4.5);
    float pulse = 0.92 + 0.08 * sin(uTime * 0.45);

    vec3 slateWash = vec3(0.085, 0.135, 0.122);
    vec3 limeHint = vec3(0.718, 0.941, 0.349);
    vec3 col = slateWash * wash + limeHint * exp(-dist * dist * 12.0) * 0.11;
    float alpha = clamp(wash * 0.58 * pulse, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

const TERRAIN_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vFade;
  varying float vCrest;

  void main() {
    vec3 pos = position;
    float distCenter = length(pos.xy * vec2(0.78, 1.0));
    float waveA = sin(pos.x * 0.52 + uTime * 0.45) * cos(pos.y * 0.46 - uTime * 0.32);
    float waveB = sin((pos.x - pos.y * 0.8) * 0.34 - uTime * 0.26) * 0.55;
    float pointerWarp = exp(-distCenter * 0.16) * (uPointer.x * 0.14 + uPointer.y * 0.14);

    pos.z += (waveA + waveB) * 0.34 + pointerWarp;
    vCrest = clamp((waveA + waveB) * 0.5 + 0.5, 0.0, 1.0);
    vFade = smoothstep(9.0, 2.2, distCenter);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const TERRAIN_FRAGMENT_SHADER = /* glsl */ `
  varying float vFade;
  varying float vCrest;

  void main() {
    vec3 baseCol = vec3(0.42, 0.48, 0.46);
    vec3 crestCol = vec3(0.718, 0.941, 0.349);
    vec3 col = mix(baseCol, crestCol, smoothstep(0.66, 0.98, vCrest) * 0.52);
    gl_FragColor = vec4(col, vFade * 0.2);
  }
`;

const TRAJECTORY_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  attribute float aProgress;
  attribute float aSignalMix;

  varying float vProgress;
  varying float vSignalMix;
  varying float vDepth;

  void main() {
    vProgress = aProgress;
    vSignalMix = aSignalMix;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = smoothstep(-13.5, -3.5, mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const TRAJECTORY_FRAGMENT_SHADER = /* glsl */ `
  uniform float uCompletion;
  uniform float uTime;
  uniform float uGhostOpacity;

  varying float vProgress;
  varying float vSignalMix;
  varying float vDepth;

  void main() {
    float solvedMask = 1.0 - smoothstep(uCompletion - 0.008, uCompletion + 0.002, vProgress);

    // Highlight active solver front & traveling harmonic pulse along completed curve
    float headWindow = smoothstep(uCompletion - 0.075, uCompletion, vProgress) * solvedMask;
    float harmonicPulse = pow(max(sin((vProgress - uTime * 0.085) * 18.0), 0.0), 6.0) * solvedMask;

    vec3 titanium = vec3(0.84, 0.89, 0.87);
    vec3 acidLime = vec3(0.718, 0.941, 0.349);

    vec3 baseCol = mix(titanium, acidLime, clamp(vSignalMix * 0.72 + headWindow * 0.95 + harmonicPulse * 0.65, 0.0, 1.0));
    float solvedAlpha = (0.68 + headWindow * 0.32 + harmonicPulse * 0.32) * solvedMask;
    float latentAlpha = uGhostOpacity * (1.0 - solvedMask);

    float alpha = clamp((solvedAlpha + latentAlpha) * vDepth, 0.0, 1.0);
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(baseCol, alpha);
  }
`;

const MANIFOLD_PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uCompletion;
  uniform float uPixelRatio;

  attribute float aProgress;
  attribute float aPhase;
  attribute float aSignal;
  attribute float aScale;

  varying float vSignal;
  varying float vAlpha;

  void main() {
    vSignal = aSignal;

    vec3 pos = position;
    // Subtle micro-oscillation tangent to phase manifold
    pos.x += sin(uTime * 0.9 + aPhase) * 0.035;
    pos.y += cos(uTime * 0.8 + aPhase * 1.4) * 0.035;
    pos.z += sin(uTime * 0.7 - aPhase) * 0.035;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float revealed = 1.0 - smoothstep(uCompletion - 0.015, uCompletion + 0.005, aProgress);
    float headBoost = smoothstep(uCompletion - 0.08, uCompletion, aProgress) * revealed;

    float depthScale = clamp(6.4 / max(-mvPosition.z, 1.8), 0.65, 2.8);
    gl_PointSize = aScale * uPixelRatio * depthScale * (1.15 + headBoost * 0.85);

    float depthFade = smoothstep(-13.5, -2.5, mvPosition.z);
    vAlpha = revealed * depthFade * (0.72 + aSignal * 0.28 + headBoost * 0.4);
  }
`;

const MANIFOLD_PARTICLE_FRAGMENT = /* glsl */ `
  varying float vSignal;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d2 = dot(uv, uv);
    if (d2 > 0.25) discard;

    float glow = exp(-d2 * 14.0);
    vec3 silverTone = vec3(0.84, 0.88, 0.86);
    vec3 signalTone = vec3(0.718, 0.941, 0.349);
    vec3 color = mix(silverTone, signalTone, vSignal);

    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  replayToken = 0,
  onProgressUpdate,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const progressCallbackRef = useRef(onProgressUpdate);
  useEffect(() => {
    progressCallbackRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  const resetSolverRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (replayToken > 0) {
      resetSolverRef.current?.();
    }
  }, [replayToken]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) {
      return;
    }

    container.replaceChildren();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const disposables: DisposableResource[] = [];
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = 'hero-canvas__webgl';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, 0.064);

    const camera = new THREE.PerspectiveCamera(42, width / Math.max(height, 1), 0.1, 45);
    camera.position.set(0, 0.12, 7.8);

    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    const applyResponsiveLayout = (viewportWidth: number) => {
      if (viewportWidth >= 1080) {
        rigGroup.position.set(0, 0.06, -0.35);
        rigGroup.scale.setScalar(1.06);
      } else if (viewportWidth >= 768) {
        rigGroup.position.set(0, 0.08, -0.5);
        rigGroup.scale.setScalar(0.92);
      } else {
        rigGroup.position.set(0, 0.14, -0.9);
        rigGroup.scale.setScalar(0.76);
      }
    };
    applyResponsiveLayout(width);

    // 1. Wide diffused atmospheric backdrop wash
    const haloGeom = new THREE.PlaneGeometry(16, 10);
    const haloUniforms = { uTime: { value: 0 } };
    const haloMat = new THREE.ShaderMaterial({
      uniforms: haloUniforms,
      vertexShader: HALO_VERTEX_SHADER,
      fragmentShader: HALO_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const haloPlane = new THREE.Mesh(haloGeom, haloMat);
    haloPlane.position.set(0, 0.1, -3.4);
    rigGroup.add(haloPlane);
    disposables.push(haloGeom, haloMat);

    // 2. Integrate Primary & Secondary Aizawa Nonlinear ODE Trajectories via RK4
    const primaryPoints = integrateAizawaTrajectory([0.1, 0, 0], ATTRACTOR_STEPS, ATTRACTOR_DT, 1.88);
    const secondaryPoints = integrateAizawaTrajectory(
      [0.1, 0.035, 0.02],
      ATTRACTOR_STEPS,
      ATTRACTOR_DT,
      1.84,
    );

    const progressArray = new Float32Array(ATTRACTOR_STEPS);
    const signalMixPrimary = new Float32Array(ATTRACTOR_STEPS);
    const signalMixSecondary = new Float32Array(ATTRACTOR_STEPS);
    for (let i = 0; i < ATTRACTOR_STEPS; i += 1) {
      const p = i / (ATTRACTOR_STEPS - 1);
      progressArray[i] = p;
      // Highlight polar jet climbs & outer asymmetric lobes
      signalMixPrimary[i] = Math.abs(Math.sin(p * Math.PI * 10)) > 0.65 ? 0.85 : 0.12;
      signalMixSecondary[i] = Math.abs(Math.cos(p * Math.PI * 8)) > 0.55 ? 0.95 : 0.25;
    }

    const attractorGroup = new THREE.Group();
    attractorGroup.rotation.set(0.26, -0.35, -0.14);
    rigGroup.add(attractorGroup);

    const primaryGeom = new THREE.BufferGeometry();
    primaryGeom.setAttribute('position', new THREE.BufferAttribute(primaryPoints, 3));
    primaryGeom.setAttribute('aProgress', new THREE.BufferAttribute(progressArray, 1));
    primaryGeom.setAttribute('aSignalMix', new THREE.BufferAttribute(signalMixPrimary, 1));

    const primaryUniforms = {
      uCompletion: { value: reducedMotion ? 1.0 : 0.18 },
      uTime: { value: 0 },
      uGhostOpacity: { value: 0.045 },
    };

    const primaryMat = new THREE.ShaderMaterial({
      uniforms: primaryUniforms,
      vertexShader: TRAJECTORY_VERTEX_SHADER,
      fragmentShader: TRAJECTORY_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const primaryLine = new THREE.Line(primaryGeom, primaryMat);
    attractorGroup.add(primaryLine);
    disposables.push(primaryGeom, primaryMat);

    // Secondary coupled manifold stream (creates intricate double-helix filaments)
    const secondaryGeom = new THREE.BufferGeometry();
    secondaryGeom.setAttribute('position', new THREE.BufferAttribute(secondaryPoints, 3));
    secondaryGeom.setAttribute('aProgress', new THREE.BufferAttribute(progressArray, 1));
    secondaryGeom.setAttribute('aSignalMix', new THREE.BufferAttribute(signalMixSecondary, 1));

    const secondaryUniforms = {
      uCompletion: { value: reducedMotion ? 1.0 : 0.12 },
      uTime: { value: 0 },
      uGhostOpacity: { value: 0.025 },
    };

    const secondaryMat = new THREE.ShaderMaterial({
      uniforms: secondaryUniforms,
      vertexShader: TRAJECTORY_VERTEX_SHADER,
      fragmentShader: TRAJECTORY_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const secondaryLine = new THREE.Line(secondaryGeom, secondaryMat);
    attractorGroup.add(secondaryLine);
    disposables.push(secondaryGeom, secondaryMat);

    // 3. Glowing Circular Integrator Head Beacon at the active frontier of the ODE solver
    const headGeom = new THREE.BufferGeometry();
    const headPos = new Float32Array(6); // primary tip + secondary tip
    headGeom.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
    const headUniforms = {
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: 0.98 },
    };
    const headMat = new THREE.ShaderMaterial({
      uniforms: headUniforms,
      vertexShader: /* glsl */ `
        uniform float uPixelRatio;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = 22.0 * uPixelRatio * clamp(5.5 / max(-mvPosition.z, 2.0), 0.7, 1.6);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d2 = dot(uv, uv);
          if (d2 > 0.25) discard;
          float core = exp(-d2 * 28.0);
          float halo = exp(-d2 * 8.5) * 0.65;
          vec3 col = mix(vec3(0.718, 0.941, 0.349), vec3(0.98, 1.0, 0.96), core);
          gl_FragColor = vec4(col, clamp((core + halo) * uOpacity, 0.0, 1.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const headBeacon = new THREE.Points(headGeom, headMat);
    attractorGroup.add(headBeacon);
    disposables.push(headGeom, headMat);

    // 4. Condensed Particle Field sampled directly along the Aizawa attractor trajectory
    const sampleStride = 3;
    const sampleCount = Math.floor(ATTRACTOR_STEPS / sampleStride);
    const pPositions = new Float32Array(sampleCount * 3);
    const pProgress = new Float32Array(sampleCount);
    const pPhases = new Float32Array(sampleCount);
    const pSignals = new Float32Array(sampleCount);
    const pScales = new Float32Array(sampleCount);

    for (let i = 0; i < sampleCount; i += 1) {
      const srcIdx = i * sampleStride;
      const jitter = Math.sin(i * 19.31) * 0.055;
      pPositions[i * 3] = primaryPoints[srcIdx * 3] + jitter;
      pPositions[i * 3 + 1] = primaryPoints[srcIdx * 3 + 1] - jitter * 0.7;
      pPositions[i * 3 + 2] = primaryPoints[srcIdx * 3 + 2] + Math.cos(i * 7.13) * 0.055;

      pProgress[i] = srcIdx / (ATTRACTOR_STEPS - 1);
      pPhases[i] = (i * 0.6180339) % (Math.PI * 2);
      pSignals[i] = i % 5 === 0 ? 1.0 : 0.0;
      pScales[i] = i % 5 === 0 ? 3.2 : 1.7 + ((i * 13) % 10) * 0.14;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeom.setAttribute('aProgress', new THREE.BufferAttribute(pProgress, 1));
    particleGeom.setAttribute('aPhase', new THREE.BufferAttribute(pPhases, 1));
    particleGeom.setAttribute('aSignal', new THREE.BufferAttribute(pSignals, 1));
    particleGeom.setAttribute('aScale', new THREE.BufferAttribute(pScales, 1));

    const particleUniforms = {
      uTime: { value: 0 },
      uCompletion: { value: reducedMotion ? 1.0 : 0.18 },
      uPixelRatio: { value: pixelRatio },
    };

    const particleMat = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: MANIFOLD_PARTICLE_VERTEX,
      fragmentShader: MANIFOLD_PARTICLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    attractorGroup.add(particles);
    disposables.push(particleGeom, particleMat);

    // 5. Receding 3D Coordinate Wave Horizon Plane
    const terrainGeom = new THREE.PlaneGeometry(18, 12, 48, 34);
    const terrainUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };
    const terrainMat = new THREE.ShaderMaterial({
      uniforms: terrainUniforms,
      vertexShader: TERRAIN_VERTEX_SHADER,
      fragmentShader: TERRAIN_FRAGMENT_SHADER,
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.position.set(0, -2.55, -1.8);
    terrainMesh.rotation.set(-Math.PI / 2.25, 0, 0);
    scene.add(terrainMesh);
    disposables.push(terrainGeom, terrainMat);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    const targetPointer = new THREE.Vector2(0, 0);
    const currentPointer = new THREE.Vector2(0, 0);
    let scrollFactor = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reducedMotion) {
        return;
      }
      targetPointer.x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      targetPointer.y = -((event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
    };

    const handleScroll = () => {
      scrollFactor = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);
    };

    const handleResize = () => {
      const nextWidth = container.clientWidth || window.innerWidth;
      const nextHeight = container.clientHeight || window.innerHeight;
      const nextRatio = Math.min(window.devicePixelRatio || 1, 2);

      camera.aspect = nextWidth / Math.max(nextHeight, 1);
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(nextRatio);
      renderer.setSize(nextWidth, nextHeight, false);
      particleUniforms.uPixelRatio.value = nextRatio;
      headUniforms.uPixelRatio.value = nextRatio;
      applyResponsiveLayout(nextWidth);

      if (reducedMotion) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    if (reducedMotion) {
      progressCallbackRef.current?.(100, 'converged');
      headPos[0] = primaryPoints[(ATTRACTOR_STEPS - 1) * 3];
      headPos[1] = primaryPoints[(ATTRACTOR_STEPS - 1) * 3 + 1];
      headPos[2] = primaryPoints[(ATTRACTOR_STEPS - 1) * 3 + 2];
      headPos[3] = secondaryPoints[(ATTRACTOR_STEPS - 1) * 3];
      headPos[4] = secondaryPoints[(ATTRACTOR_STEPS - 1) * 3 + 1];
      headPos[5] = secondaryPoints[(ATTRACTOR_STEPS - 1) * 3 + 2];
      headGeom.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        for (const item of disposables) {
          item.dispose();
        }
        renderer.dispose();
        container.replaceChildren();
      };
    }

    // Progressive solver timing: solves 0.14 -> 1.0 over 14s, holds full structure 6s, gently loops
    let animationFrameId = 0;
    let isInViewport = true;
    let isTabVisible = document.visibilityState === 'visible';
    let lastTimestamp = performance.now();
    let elapsedTime = 0;
    let solverTime = 0;
    let lastReportedPct = -1;

    resetSolverRef.current = () => {
      solverTime = 0;
      lastReportedPct = -1;
    };

    const tick = (now: number) => {
      animationFrameId = 0;
      if (!isInViewport || !isTabVisible) {
        return;
      }

      const delta = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;
      elapsedTime += delta;
      solverTime += delta;

      const cycleDuration = 22.0; // 14s integration build + 8s converged contemplation
      const integrateDuration = 14.0;
      const cyclePos = solverTime % cycleDuration;
      const rawProgress = Math.min(cyclePos / integrateDuration, 1.0);
      // Smooth asymptotic ease so initial trajectory bursts briskly then weaves detail
      const completion = 0.14 + 0.86 * (1 - Math.pow(1 - rawProgress, 1.45));
      const secondaryCompletion = Math.max(0.06, completion - 0.05);

      const pct = Math.min(Math.round(completion * 100), 100);
      if (pct !== lastReportedPct) {
        lastReportedPct = pct;
        progressCallbackRef.current?.(pct, pct >= 100 ? 'converged' : 'integrating');
      }

      currentPointer.lerp(targetPointer, 0.045);

      haloUniforms.uTime.value = elapsedTime;
      terrainUniforms.uTime.value = elapsedTime;
      terrainUniforms.uPointer.value.copy(currentPointer);

      primaryUniforms.uTime.value = elapsedTime;
      primaryUniforms.uCompletion.value = completion;
      secondaryUniforms.uTime.value = elapsedTime;
      secondaryUniforms.uCompletion.value = secondaryCompletion;

      particleUniforms.uTime.value = elapsedTime;
      particleUniforms.uCompletion.value = completion;

      // Update glowing integrator head points
      const pIdx = Math.min(Math.floor(completion * (ATTRACTOR_STEPS - 1)), ATTRACTOR_STEPS - 1);
      const sIdx = Math.min(
        Math.floor(secondaryCompletion * (ATTRACTOR_STEPS - 1)),
        ATTRACTOR_STEPS - 1,
      );
      headPos[0] = primaryPoints[pIdx * 3];
      headPos[1] = primaryPoints[pIdx * 3 + 1];
      headPos[2] = primaryPoints[pIdx * 3 + 2];
      headPos[3] = secondaryPoints[sIdx * 3];
      headPos[4] = secondaryPoints[sIdx * 3 + 1];
      headPos[5] = secondaryPoints[sIdx * 3 + 2];
      headGeom.attributes.position.needsUpdate = true;
      headUniforms.uOpacity.value = rawProgress >= 0.995 ? 0.35 : 0.98;

      // Smooth architectural 3D rotation & mouse parallax
      attractorGroup.rotation.y = -0.35 + elapsedTime * 0.085 + currentPointer.x * 0.32;
      attractorGroup.rotation.x = 0.26 + currentPointer.y * 0.2 + scrollFactor * 0.2;

      camera.position.x = currentPointer.x * 0.24;
      camera.position.y = 0.12 + currentPointer.y * 0.18 - scrollFactor * 0.22;
      camera.position.z = 7.8 - scrollFactor * 0.55;
      camera.lookAt(0, 0.04, -0.35);

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (animationFrameId === 0 && isInViewport && isTabVisible) {
        lastTimestamp = performance.now();
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              isInViewport = Boolean(entry?.isIntersecting);
              if (isInViewport) {
                startLoop();
              } else {
                stopLoop();
              }
            },
            { threshold: 0.01 },
          )
        : null;

    if (observer) {
      observer.observe(container);
    }

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isTabVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startLoop();

    return () => {
      resetSolverRef.current = null;
      stopLoop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
      container.replaceChildren();
    };
  }, [reducedMotion]);

  if (webglUnavailable) {
    return <HeroFallback reason="fallback" />;
  }

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
};
