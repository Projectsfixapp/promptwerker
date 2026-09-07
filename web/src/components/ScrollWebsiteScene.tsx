"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeGlowTexture } from "@/lib/sceneTextures";
import { SCROLL_BEATS as BEATS } from "@/lib/scrollShowcase";

/* Scroll-Showcase: aus verstreuten Bausteinen wird eine Website.

   Ablauf über die Scrollstrecke (Fortschritt p von 0 bis 1):
     p 0.00–0.28  Bausteine treiben verstreut im Raum, Kamera weit weg
     p 0.28–0.80  Kamera fährt heran, die Teile fliegen gestaffelt an ihre
                  Layout-Position — Navileiste, Hero, drei Karten, Footer
     p 0.80–1.00  Die fertige Seite dreht sich frontal zur Kamera und
                  leuchtet auf

   Rückwärts scrollen spielt alles rückwärts: sämtliche Werte sind reine
   Funktionen von p. Nur das leichte Wiegen der Gruppe und die Partikel-
   drift laufen zeitbasiert weiter, damit die Szene im Stillstand lebt.

   Bewusst ohne Video und ohne geladene 3D-Modelle — alles ist Geometrie,
   die der Browser selbst rechnet. Deshalb kein Ladebalken, kein Layout-
   Sprung und kein Materialkostenblock pro Kundenprojekt. */

type Baustein = {
  /** Breite/Höhe der Fläche in Weltmaß */
  b: number;
  h: number;
  /** Zielposition im Layout */
  x: number;
  y: number;
  z: number;
  /** true = Magenta-Akzent statt Cyan */
  akzent?: boolean;
};

/* Das Ziel-Layout: eine Seite in Seitenansicht. 6.4 breit, ~5.6 hoch —
   passt bei Kameraendstand z 9.6 mit Rand ins Bild. */
const BAUSTEINE: Baustein[] = [
  { b: 6.4, h: 0.5, x: 0, y: 2.6, z: 0 }, // Navileiste
  { b: 0.52, h: 0.26, x: -2.68, y: 2.6, z: 0.06, akzent: true }, // Logo
  { b: 3.2, h: 0.34, x: -1.55, y: 1.55, z: 0 }, // Überschrift
  { b: 2.6, h: 0.18, x: -1.85, y: 1.05, z: 0 }, // Fließtext
  { b: 1.3, h: 0.34, x: -2.5, y: 0.5, z: 0, akzent: true }, // Button
  { b: 2.2, h: 1.7, x: 2.2, y: 1.1, z: 0 }, // Hero-Bild
  { b: 2.0, h: 1.3, x: -2.2, y: -0.75, z: 0 }, // Karte 1
  { b: 2.0, h: 1.3, x: 0, y: -0.75, z: 0 }, // Karte 2
  { b: 2.0, h: 1.3, x: 2.2, y: -0.75, z: 0 }, // Karte 3
  { b: 6.4, h: 0.85, x: 0, y: -2.35, z: 0 }, // Footer
];

const PARTIKEL = 620;
const FARBE_CYAN = 0x38d9ff;
const FARBE_MAGENTA = 0xc026a0;

/** Weiche Interpolation mit Rampe an beiden Enden. */
function rampe(wert: number, von: number, bis: number): number {
  const t = THREE.MathUtils.clamp((wert - von) / (bis - von), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Deterministischer Streuwert — kein Math.random(), damit die Startlage
    der Bausteine bei jedem Laden identisch ist. */
function streu(i: number, kanal: number): number {
  const n = Math.sin(i * 127.1 + kanal * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Sichtbarkeit eines Textblocks: blendet an beiden Enden weich aus. */
function blende(p: number, von: number, bis: number): number {
  return rampe(p, von, von + 0.07) * (1 - rampe(p, bis - 0.07, bis));
}

/* WebGL einmal vorab prüfen, statt es erst im Effect zu merken: dadurch
   steht die Rückfallebene schon beim ersten Rendern fest und es braucht
   kein setState im Effect (react-hooks/set-state-in-effect). */
function webglVorhanden(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function ScrollWebsiteScene() {
  const sektionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const fortschrittRef = useRef<HTMLDivElement>(null);
  const [fehler, setFehler] = useState<string | null>(() =>
    webglVorhanden() ? null : "kein-webgl"
  );

  useEffect(() => {
    if (fehler) return;
    if (!canvasRef.current || !sektionRef.current) return;
    // Eigene Konstanten statt der Refs: die Funktionsdeklarationen weiter
    // unten werden hochgezogen, dort sähe TypeScript die Null-Prüfung sonst
    // nicht mehr.
    const canvas: HTMLCanvasElement = canvasRef.current;
    const sektion: HTMLElement = sektionRef.current;

    const wenigerBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schmal = window.matchMedia("(max-width: 900px)").matches;

    /* Der Kontext wurde oben schon erfolgreich geprüft. Scheitert er hier
       trotzdem (z.B. Kontextlimit des Browsers), wird die Textfassung erst
       im nächsten Frame nachgereicht — nicht synchron im Effect-Rumpf. */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !schmal, alpha: false });
      if (!renderer.getContext()) throw new Error("kein WebGL-Kontext");
    } catch (err) {
      console.error("[ScrollWebsiteScene] WebGL nicht verfügbar:", err);
      requestAnimationFrame(() => setFehler("kein-webgl"));
      return;
    }

    renderer.setClearColor(0x060b18, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, schmal ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const szene = new THREE.Scene();
    const kamera = new THREE.PerspectiveCamera(42, 1, 0.1, 160);

    const entsorgbar: Array<{ dispose: () => void }> = [];

    // ------------------------------------------------------------ Bausteine
    const seitenGruppe = new THREE.Group();
    /* Etwas unter der Bildmitte: darüber liegt die Textzeile der Szene, und
       die soll die fertige Seite nicht überschreiben. */
    seitenGruppe.position.y = -0.55;
    szene.add(seitenGruppe);

    type Teil = {
      gruppe: THREE.Group;
      flaeche: THREE.MeshBasicMaterial;
      kante: THREE.LineBasicMaterial;
      start: THREE.Vector3;
      ziel: THREE.Vector3;
      startDrehung: THREE.Euler;
      von: number;
      bis: number;
    };

    const teile: Teil[] = BAUSTEINE.map((baustein, i) => {
      const gruppe = new THREE.Group();

      const geometrie = new THREE.PlaneGeometry(baustein.b, baustein.h);
      const flaeche = new THREE.MeshBasicMaterial({
        color: baustein.akzent ? FARBE_MAGENTA : 0x0f2942,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      gruppe.add(new THREE.Mesh(geometrie, flaeche));

      const kantenGeometrie = new THREE.EdgesGeometry(geometrie);
      const kante = new THREE.LineBasicMaterial({
        color: baustein.akzent ? FARBE_MAGENTA : FARBE_CYAN,
        transparent: true,
        opacity: 0.9,
      });
      gruppe.add(new THREE.LineSegments(kantenGeometrie, kante));

      entsorgbar.push(geometrie, kantenGeometrie, flaeche, kante);

      /* Startlage: weit auseinandergezogen und verdreht. Golden-Angle-
         Verteilung statt Zufall, damit sich keine zwei Teile decken. */
      const winkel = i * 2.39996;
      const abstand = 7 + streu(i, 1) * 9;
      const start = new THREE.Vector3(
        Math.cos(winkel) * abstand,
        Math.sin(winkel) * abstand * 0.55 + (streu(i, 2) - 0.5) * 4,
        -16 + streu(i, 3) * 22
      );
      const ziel = new THREE.Vector3(baustein.x, baustein.y, baustein.z);

      gruppe.position.copy(start);
      const startDrehung = new THREE.Euler(
        (streu(i, 4) - 0.5) * 2.4,
        (streu(i, 5) - 0.5) * 2.8,
        (streu(i, 6) - 0.5) * 1.6
      );
      gruppe.rotation.copy(startDrehung);

      seitenGruppe.add(gruppe);

      // Gestaffelter Einflug: Teil i startet später und ist früher fertig
      // als sein Nachfolger — ergibt das „Zusammenschnappen" von oben nach
      // unten statt eines gleichzeitigen Sprungs.
      const von = 0.3 + i * 0.028;
      return { gruppe, flaeche, kante, start, ziel, startDrehung, von, bis: von + 0.26 };
    });

    // --------------------------------------------------------------- Schein
    const scheinTextur = makeGlowTexture(0.0, 0.5);
    const schein = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: scheinTextur,
        color: 0x2ea8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })
    );
    schein.position.set(0, 0, -1.4);
    schein.scale.setScalar(16);
    szene.add(schein);
    entsorgbar.push(scheinTextur, schein.material);

    // ------------------------------------------------------------- Partikel
    const punktPositionen = new Float32Array(PARTIKEL * 3);
    for (let i = 0; i < PARTIKEL; i++) {
      punktPositionen[i * 3] = (streu(i, 11) - 0.5) * 46;
      punktPositionen[i * 3 + 1] = (streu(i, 12) - 0.5) * 30;
      punktPositionen[i * 3 + 2] = -60 + streu(i, 13) * 68;
    }
    const punktGeometrie = new THREE.BufferGeometry();
    punktGeometrie.setAttribute("position", new THREE.BufferAttribute(punktPositionen, 3));
    const punktTextur = makeGlowTexture(0.0, 0.45);
    const punktMaterial = new THREE.PointsMaterial({
      map: punktTextur,
      color: 0x8fd4ff,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const punkte = new THREE.Points(punktGeometrie, punktMaterial);
    szene.add(punkte);
    entsorgbar.push(punktGeometrie, punktTextur, punktMaterial);

    // ------------------------------------------------------------- Zustand
    const zustand = { ziel: 0, weich: 0 };
    let laeuft = true;
    let animationsId = 0;

    function groesseAnpassen() {
      const breite = canvas.clientWidth || window.innerWidth;
      const hoehe = canvas.clientHeight || window.innerHeight;
      renderer.setSize(breite, hoehe, false);
      kamera.aspect = breite / hoehe;
      kamera.fov = kamera.aspect < 0.85 ? 58 : kamera.aspect < 1.3 ? 50 : 42;
      kamera.updateProjectionMatrix();

      /* Im Hochformat ist das Sichtfeld schmaler als die 6.4 Einheiten
         breite Seite — die Gruppe wird deshalb verkleinert statt die
         Kamera weiter zurückzuziehen (das würde die Teile im Nebel
         verschwinden lassen). */
      const massstab = kamera.aspect < 0.8 ? 0.45 : kamera.aspect < 1.3 ? 0.64 : 0.8;
      seitenGruppe.scale.setScalar(massstab);
    }

    function szeneAktualisieren(p: number, zeit: number) {
      // --- Kamera: fährt heran, hebt sich leicht auf Augenhöhe
      const anflug = rampe(p, 0.0, 0.82);
      kamera.position.set(
        // Seitliches Schwenken nur auf dem Weg — am Ende exakt mittig, sonst
        // steht die fertige Seite schief im Bild.
        Math.sin(p * Math.PI * 0.8) * 1.6 * (1 - anflug),
        THREE.MathUtils.lerp(2.4, 0.35, anflug),
        THREE.MathUtils.lerp(20.0, 9.6, anflug)
      );
      kamera.lookAt(0, THREE.MathUtils.lerp(0.9, 0.35, anflug), 0);

      // --- Bausteine: gestaffelt an die Layout-Position
      for (const teil of teile) {
        const t = rampe(p, teil.von, teil.bis);
        teil.gruppe.position.lerpVectors(teil.start, teil.ziel, t);
        teil.gruppe.rotation.set(
          teil.startDrehung.x * (1 - t),
          teil.startDrehung.y * (1 - t),
          teil.startDrehung.z * (1 - t)
        );
        teil.flaeche.opacity = THREE.MathUtils.lerp(0.16, 0.55, t);
        teil.kante.opacity = THREE.MathUtils.lerp(0.34, 0.95, t);
      }

      /* --- Gruppe: steht anfangs schräg im Raum und dreht sich zum Schluss
         frontal zur Kamera. Das leichte Wiegen läuft zeitbasiert weiter,
         damit die fertige Seite im Stillstand nicht tot wirkt. */
      const ausrichten = rampe(p, 0.62, 0.95);
      const wiegen = Math.sin(zeit * 0.5) * 0.035;
      seitenGruppe.rotation.y = THREE.MathUtils.lerp(-0.62, 0, ausrichten) + wiegen * ausrichten;
      seitenGruppe.rotation.x = THREE.MathUtils.lerp(0.34, 0.02, ausrichten);

      // --- Schein: wächst mit dem Zusammenbau
      const leuchten = rampe(p, 0.55, 1.0);
      (schein.material as THREE.SpriteMaterial).opacity = leuchten * 0.34;
      schein.scale.setScalar(THREE.MathUtils.lerp(10, 20, leuchten));

      // --- Partikel: driften zur Kamera und dünnen zum Schluss aus
      punkte.position.z = p * 16;
      punkte.rotation.z = zeit * 0.012;
      punktMaterial.opacity = 0.5 * (1 - rampe(p, 0.7, 1.0) * 0.65);

      // --- Textbeats und Fortschrittsbalken
      BEATS.forEach((beat, i) => {
        const knoten = beatRefs.current[i];
        if (knoten) knoten.style.opacity = String(blende(p, beat.von, beat.bis));
      });
      if (fortschrittRef.current) {
        fortschrittRef.current.style.transform = `scaleX(${p})`;
      }
    }

    function schleife() {
      if (!laeuft) return;
      animationsId = requestAnimationFrame(schleife);

      // Nachziehen statt hartes Setzen: entkoppelt die Darstellung vom
      // stotternden Scroll-Event und ergibt die weiche Kamerafahrt.
      zustand.weich += (zustand.ziel - zustand.weich) * 0.085;

      szeneAktualisieren(zustand.weich, performance.now() / 1000);
      renderer.render(szene, kamera);
    }

    groesseAnpassen();
    window.addEventListener("resize", groesseAnpassen);

    gsap.registerPlugin(ScrollTrigger);
    const ausloeser = ScrollTrigger.create({
      trigger: sektion,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        zustand.ziel = self.progress;
      },
    });

    if (wenigerBewegung) {
      // Endzustand einmal zeichnen, keine Schleife und kein Scroll-Scrub
      szeneAktualisieren(1, 0);
      renderer.render(szene, kamera);
    } else {
      schleife();
    }

    return () => {
      laeuft = false;
      cancelAnimationFrame(animationsId);
      ausloeser.kill();
      window.removeEventListener("resize", groesseAnpassen);
      for (const teil of entsorgbar) teil.dispose();
      renderer.dispose();
    };
  }, [fehler]);

  /* Ohne WebGL (alte Geräte, abgeschaltete Hardwarebeschleunigung) bleibt
     der Inhalt lesbar — die Beats stehen dann als normale Liste da. */
  if (fehler === "kein-webgl") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20" aria-labelledby="showcase-titel">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Showcase</p>
        <h2 id="showcase-titel" className="mt-3 text-2xl sm:text-3xl">
          Aus Einzelteilen wird eine Website
        </h2>
        <p className="mt-4 font-card-body text-sm leading-relaxed text-body">
          Dein Browser meldet kein WebGL — deshalb hier der Ablauf in Worten statt als
          Animation:
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {BEATS.map((beat) => (
            <li key={beat.id} className="glass-panel rounded-2xl p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {beat.eyebrow}
              </span>
              <p className="mt-2 font-card-body text-sm leading-relaxed text-body">{beat.text}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={sektionRef} aria-labelledby="showcase-titel" className="relative h-[380vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />

        <h2 id="showcase-titel" className="sr-only">
          Aus Einzelteilen wird eine Website
        </h2>

        {BEATS.map((beat, i) => (
          <div
            key={beat.id}
            ref={(knoten) => {
              beatRefs.current[i] = knoten;
            }}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 top-[8vh] px-6 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {beat.eyebrow}
            </p>
            <p className="font-heading mx-auto mt-3 max-w-2xl text-xl uppercase leading-tight sm:text-3xl">
              {beat.text}
            </p>
          </div>
        ))}

        {/* Fortschritt der Szene — zeigt, dass das Scrollen die Animation
            steuert und nicht ein Video im Hintergrund läuft. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10"
        >
          <div
            ref={fortschrittRef}
            className="h-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Die Textfassung des Ablaufs steht auf der Seite selbst (sie wird
          serverseitig gerendert, diese Szene wegen ssr:false nicht). */}
    </section>
  );
}
