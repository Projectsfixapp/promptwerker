import * as THREE from "three";
import { EffectComposer } from "./vendor/three/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./vendor/three/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./vendor/three/jsm/postprocessing/UnrealBloomPass.js";
import { gsap } from "./vendor/gsap/gsap.js";
import { ScrollTrigger } from "./vendor/gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector(".hero");
const canvas = document.getElementById("hero-scene");
if (!hero || !canvas) {
  // Hero markup missing - nothing to mount.
} else {
  initHeroScene(hero, canvas);
}

function initHeroScene(hero, canvas) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  let gl;
  try {
    gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  } catch (e) {
    gl = null;
  }
  if (!gl) {
    // No WebGL: leave the CSS radial-gradient fallback on .hero as the visual.
    return;
  }

  const COLOR_PULSE = 0x38d9ff; // --color-pulse
  const COLOR_TRACE = 0x468cff; // --color-trace-dim
  const BG_COLOR = 0x060b18; // --color-bg

  const NODE_COUNT = isMobile ? 60 : 130;
  const NEIGHBORS_PER_NODE = 3;
  const PULSE_COUNT = isMobile ? 18 : 50;
  const SPHERE_RADIUS = 5.5;

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

  // ---- Procedural node/edge network -------------------------------------
  const nodePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    // Bias points toward the center for a denser core, like the old grid's mid-page density.
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

  const edges = [];
  const edgeKeys = new Set();
  for (let i = 0; i < NODE_COUNT; i++) {
    const distances = [];
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

  function makeGlowTexture(coreStop, edgeAlpha) {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
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

  // Nodes - dim circuit junctions, not light sources themselves
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

  // Edges
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

  // Traveling light pulses along edges
  const pulses = [];
  for (let i = 0; i < PULSE_COUNT; i++) {
    pulses.push({
      edge: edges[Math.floor(Math.random() * edges.length)],
      t: Math.random(),
      speed: 0.12 + Math.random() * 0.22,
    });
  }
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

  function updatePulses(delta) {
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

  // ---- Post-processing (bloom) -------------------------------------------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.65, 0.4, 0.42);
  composer.addPass(bloomPass);

  // ---- Sizing -------------------------------------------------------------
  function resize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
  }
  resize();
  window.addEventListener("resize", resize);

  // ---- Scroll-scrubbed camera move through the network -------------------
  if (!reducedMotion) {
    gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
      .to(camera.position, { z: 4.5, x: 1.4, y: 0.8, ease: "none" }, 0)
      .to(networkGroup.rotation, { y: 1.4, x: 0.35, ease: "none" }, 0)
      .to(canvas, { opacity: 0, ease: "none" }, 0.55);
  }

  // ---- Render loop, paused outside viewport / reduced-motion -------------
  const clock = new THREE.Clock();
  let running = false;

  function renderFrame() {
    const delta = clock.getDelta();
    if (!reducedMotion) {
      networkGroup.rotation.y += delta * 0.04;
      updatePulses(delta);
    }
    composer.render();
  }

  function loop() {
    if (!running) return;
    renderFrame();
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    clock.start();
    loop();
  }
  function stop() {
    running = false;
  }

  if (reducedMotion) {
    renderFrame();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      },
      { threshold: 0 }
    );
    observer.observe(hero);
  }
}
