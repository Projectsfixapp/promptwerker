"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useScroll } from "motion/react";

export type NeuralBackgroundHandle = {
  highlightTopic: (topicId: string) => void;
  getCtaOrigin: () => { x: number; y: number } | null;
};

// Order defines which node in the network each topic gets highlighted on return.
// Must match the topic ids in src/lib/topics.ts.
const TOPIC_ORDER = [
  "voice-agenten",
  "workflow-automatisierung",
  "lead-sales-autopilot",
  "crm-anbindung",
];

const COLOR_PULSE = 0x38d9ff;
const COLOR_TRACE = 0x468cff;
const BG_COLOR = 0x060b18;
const SPHERE_RADIUS = 5.5;
const NEIGHBORS_PER_NODE = 3;
const HIGHLIGHT_DURATION_MS = 1600;

const NeuralBackground = forwardRef<NeuralBackgroundHandle>(function NeuralBackground(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightRef = useRef<{ nodeIndex: number; start: number } | null>(null);
  const nodeIndicesRef = useRef<number[]>([]);
  const getCtaOriginImplRef = useRef<() => { x: number; y: number } | null>(() => null);
  const { scrollYProgress } = useScroll();

  useImperativeHandle(ref, () => ({
    highlightTopic(topicId: string) {
      const order = TOPIC_ORDER.indexOf(topicId);
      const nodeIndex = nodeIndicesRef.current[order];
      if (nodeIndex === undefined) return;
      highlightRef.current = { nodeIndex, start: performance.now() };
    },
    getCtaOrigin() {
      return getCtaOriginImplRef.current();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    } catch {
      gl = null;
    }
    if (!gl) return;

    const NODE_COUNT = isMobile ? 60 : 130;
    const PULSE_COUNT = isMobile ? 18 : 50;

    nodeIndicesRef.current = TOPIC_ORDER.map((_, i) =>
      Math.floor((i + 0.5) * (NODE_COUNT / TOPIC_ORDER.length))
    );
    const ctaNodeIndex = Math.floor(NODE_COUNT * 0.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2));
    renderer.setClearColor(BG_COLOR, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 16);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = SPHERE_RADIUS * Math.pow(Math.random(), 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodePositions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    const edges: [number, number][] = [];
    const edgeKeys = new Set<string>();
    for (let i = 0; i < NODE_COUNT; i++) {
      const distances: [number, number][] = [];
      for (let j = 0; j < NODE_COUNT; j++) {
        if (i === j) continue;
        distances.push([j, nodePositions[i].distanceToSquared(nodePositions[j])]);
      }
      distances.sort((a, b) => a[1] - b[1]);
      for (let k = 0; k < NEIGHBORS_PER_NODE && k < distances.length; k++) {
        const j = distances[k][0];
        const key = i < j ? `${i}_${j}` : `${j}_${i}`;
        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push([i, j]);
        }
      }
    }

    function makeGlowTexture(coreStop: number, edgeAlpha: number) {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(coreStop, `rgba(56,217,255,${edgeAlpha})`);
      grad.addColorStop(1, "rgba(56,217,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }
    const nodeGlowTexture = makeGlowTexture(0.5, 0.45);
    const pulseGlowTexture = makeGlowTexture(0.35, 0.75);

    const nodeGeo = new THREE.BufferGeometry();
    const nodeArr = new Float32Array(NODE_COUNT * 3);
    nodePositions.forEach((p, i) => p.toArray(nodeArr, i * 3));
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodeArr, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.14,
      map: nodeGlowTexture,
      color: COLOR_TRACE,
      opacity: 0.7,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    networkGroup.add(new THREE.Points(nodeGeo, nodeMat));

    const edgeArr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      nodePositions[a].toArray(edgeArr, i * 6);
      nodePositions[b].toArray(edgeArr, i * 6 + 3);
    });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgeArr, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: COLOR_TRACE,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    networkGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    const pulses = Array.from({ length: PULSE_COUNT }, () => ({
      edge: edges[Math.floor(Math.random() * edges.length)],
      t: Math.random(),
      speed: 0.12 + Math.random() * 0.22,
    }));
    const pulseGeo = new THREE.BufferGeometry();
    const pulseArr = new Float32Array(PULSE_COUNT * 3);
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulseArr, 3));
    const pulseMat = new THREE.PointsMaterial({
      size: 0.32,
      map: pulseGlowTexture,
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    networkGroup.add(pulsePoints);

    function updatePulses(delta: number) {
      for (let i = 0; i < PULSE_COUNT; i++) {
        const p = pulses[i];
        p.t += p.speed * delta;
        if (p.t > 1) {
          p.t -= 1;
          p.edge = edges[Math.floor(Math.random() * edges.length)];
        }
        const a = nodePositions[p.edge[0]];
        const b = nodePositions[p.edge[1]];
        pulseArr[i * 3] = a.x + (b.x - a.x) * p.t;
        pulseArr[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
        pulseArr[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
      }
      pulseGeo.attributes.position.needsUpdate = true;
    }

    const highlightMarker = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: pulseGlowTexture,
        color: COLOR_PULSE,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    highlightMarker.scale.setScalar(0.6);
    networkGroup.add(highlightMarker);

    function updateHighlight() {
      const h = highlightRef.current;
      if (!h) {
        if (highlightMarker.material.opacity !== 0) highlightMarker.material.opacity = 0;
        return;
      }
      const elapsed = performance.now() - h.start;
      if (elapsed >= HIGHLIGHT_DURATION_MS) {
        highlightRef.current = null;
        highlightMarker.material.opacity = 0;
        return;
      }
      const t = elapsed / HIGHLIGHT_DURATION_MS;
      const intensity = Math.sin(Math.min(t, 1) * Math.PI);
      highlightMarker.position.copy(nodePositions[h.nodeIndex]);
      highlightMarker.material.opacity = intensity;
      highlightMarker.scale.setScalar(0.5 + intensity * 1.1);
    }

    getCtaOriginImplRef.current = () => {
      const node = nodePositions[ctaNodeIndex];
      if (!node) return null;
      networkGroup.updateMatrixWorld();
      const worldPos = node.clone().applyMatrix4(networkGroup.matrixWorld);
      const ndc = worldPos.project(camera);
      if (!Number.isFinite(ndc.x) || !Number.isFinite(ndc.y)) return null;
      return {
        x: (ndc.x * 0.5 + 0.5) * window.innerWidth,
        y: (1 - (ndc.y * 0.5 + 0.5)) * window.innerHeight,
      };
    };

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.65, 0.4, 0.42);
    composer.addPass(bloomPass);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    let scrollProgress = scrollYProgress.get();
    const unsubscribeScroll = scrollYProgress.on("change", (v) => {
      scrollProgress = v;
    });

    let autoSpin = 0;
    const timer = new THREE.Timer();
    timer.connect(document);
    let frameId = 0;

    function renderFrame() {
      timer.update();
      const delta = timer.getDelta();
      if (!reducedMotion) {
        const introT = Math.min(scrollProgress / 0.12, 1);
        const eased = 1 - Math.pow(1 - introT, 3);
        camera.position.z = THREE.MathUtils.lerp(16, 4.5, eased);
        camera.position.x = THREE.MathUtils.lerp(0, 1.4, eased);
        camera.position.y = THREE.MathUtils.lerp(0, 0.8, eased);
        autoSpin += delta * 0.04;
        networkGroup.rotation.y = autoSpin + scrollProgress * 2.4;
        networkGroup.rotation.x = scrollProgress * 0.6;
        updatePulses(delta);
      }
      updateHighlight();
      composer.render();
    }

    function loop() {
      frameId = requestAnimationFrame(loop);
      renderFrame();
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        timer.reset();
        loop();
      }
    }

    if (reducedMotion) {
      renderFrame();
    } else {
      loop();
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      unsubscribeScroll();
      getCtaOriginImplRef.current = () => null;
      timer.dispose();
      composer.dispose();
      renderer.dispose();
      nodeGeo.dispose();
      edgeGeo.dispose();
      pulseGeo.dispose();
      nodeMat.dispose();
      edgeMat.dispose();
      pulseMat.dispose();
      nodeGlowTexture.dispose();
      pulseGlowTexture.dispose();
    };
  }, [scrollYProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
});

export default NeuralBackground;
