"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toolLogos } from "@/lib/toolLogos";
import { makeBadgeTexture, makeGlowTexture, makeSmokeTexture } from "@/lib/sceneTextures";
import { FRAME_ANZAHL, ladeSequenz, waehleSequenz } from "@/lib/frameSequence";
import LogoCarousel3D from "./LogoCarousel3D";

/* Zauberring-Szene.

   Ablauf über die Scrollstrecke (Fortschritt p von 0 bis 1):
     p 0.00–0.18  Ring dreht sich ruhig, dichter Nebel, Strahler fast aus
     p 0.18–0.72  Kamera fährt hinein, Ring beschleunigt, Licht wächst,
                  Dennis dreht sich aus dem Nebel heraus
     p 0.72–1.00  Nebel verzogen, Ring wieder auf Normaldrehzahl,
                  Dennis steht frontal und lächelt in die Kamera

   Rückwärts scrollen spielt alles rückwärts, weil sämtliche Werte reine
   Funktionen von p sind — die einzige Ausnahme ist die Grunddrehung des
   Rings, die unabhängig von p weiterläuft.

   Ringwinkel = Zeit * GRUNDTEMPO + SPIN_GESAMT * p^1.8
   Die Ableitung nach der Zeit wächst dadurch sowohl mit der Scrollge-
   schwindigkeit als auch mit der Scrolltiefe — genau das geforderte
   "dreht beim Runterscrollen immer schneller". */

/* Radius, Neigung und Höhe sind aufeinander und auf den Kamera-Endstand
   abgestimmt: der vordere Ringbogen ist der Kamera am nächsten und wandert
   dadurch am weitesten nach unten. Mit Radius 4.7, Ringhöhe +0.45 und
   Endabstand ~10.4 bleibt er mit Rand im Bild — vorher schnitt ihn die
   Unterkante ab. */
const RING_RADIUS = 4.7;
const RING_NEIGUNG = 0.24;
const RING_HOEHE = 0.45;
const GRUNDTEMPO = 0.16; // Bogenmaß pro Sekunde im Ruhezustand
const SPIN_GESAMT = 26; // zusätzliche Umdrehung über die volle Scrollstrecke
const NEBEL_SCHWADEN = 18;
/* Der Ring liegt waagerecht in der XZ-Ebene auf Höhe RING_HOEHE. Die Figur
   muss deshalb MIT DEN FÜSSEN AUF DIESER EBENE stehen und in der Ringmitte
   (x 0, z 0) — sonst hängt sie unter dem Ring und sieht aus, als stünde sie
   davor. Der Mittelpunkt der Fläche liegt also eine halbe Figurhöhe über
   der Ringebene. */
const PERSON_HOEHE = 4.8;
const PERSON_FUSS_Y = 0.45; // = RING_HOEHE
const PERSON_MITTE_Y = PERSON_FUSS_Y + PERSON_HOEHE / 2;
const PERSON_SEITENVERHAELTNIS = 720 / 1259;

/** Weiche Interpolation mit Rampe an beiden Enden. */
function rampe(wert: number, von: number, bis: number): number {
  const t = THREE.MathUtils.clamp((wert - von) / (bis - von), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Deterministischer Streuwert — kein Math.random(), damit die Partikel
    bei jedem Laden identisch verteilt sind (gleiches Muster wie in
    ScrollWebsiteScene). */
function streu(i: number, kanal: number): number {
  const n = Math.sin(i * 127.1 + kanal * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Anzahl der Tiefen-Partikel im Raum hinter und um den Ring. */
const PARTIKEL = 420;

export default function MagicRingScene() {
  const sektionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titelRef = useRef<HTMLDivElement>(null);
  const [ladeAnteil, setLadeAnteil] = useState(0);
  const [bereit, setBereit] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !sektionRef.current) return;
    // Eigene Konstanten statt der Refs: Funktionsdeklarationen weiter unten
    // werden hochgezogen, wodurch TypeScript die Null-Prüfung dort sonst
    // nicht mehr sieht.
    const canvas: HTMLCanvasElement = canvasRef.current;
    const sektion: HTMLElement = sektionRef.current;

    const wenigerBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schmal = window.matchMedia("(max-width: 900px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !schmal, alpha: false });
    } catch {
      setFehler("kein-webgl");
      return;
    }
    if (!renderer.getContext()) {
      setFehler("kein-webgl");
      return;
    }

    renderer.setClearColor(0x060b18, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, schmal ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const szene = new THREE.Scene();
    const kamera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);

    // ---------------------------------------------------------------- Ring
    const ringGruppe = new THREE.Group();
    ringGruppe.rotation.x = RING_NEIGUNG;
    ringGruppe.position.y = RING_HOEHE;
    szene.add(ringGruppe);

    const badges: THREE.Sprite[] = [];
    const entsorgbar: Array<{ dispose: () => void }> = [];

    toolLogos.forEach((tool, i) => {
      const material = new THREE.SpriteMaterial({
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });
      const sprite = new THREE.Sprite(material);
      const winkel = (i / toolLogos.length) * Math.PI * 2;
      sprite.position.set(Math.sin(winkel) * RING_RADIUS, 0, Math.cos(winkel) * RING_RADIUS);
      sprite.scale.setScalar(0.92);
      sprite.userData.winkel = winkel;
      ringGruppe.add(sprite);
      badges.push(sprite);
      entsorgbar.push(material);

      // Texturen asynchron nachreichen, damit der erste Frame nicht wartet
      void makeBadgeTexture(tool).then((textur) => {
        material.map = textur;
        material.needsUpdate = true;
        entsorgbar.push(textur);
      });
    });

    /* Tempo-Ring: eine dünne, additiv leuchtende Bahn auf der Badge-Kreis-
       linie. Sie liegt in der Ringgruppe (neigt und dreht sich also mit)
       und wird erst mit wachsender Drehzahl sichtbar — die Badges wirken
       dadurch, als zögen sie bei hoher Geschwindigkeit eine Lichtspur. */
    const streifenGeometrie = new THREE.TorusGeometry(RING_RADIUS, 0.025, 8, 120);
    const streifenMaterial = new THREE.MeshBasicMaterial({
      color: 0x66d9ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streifen = new THREE.Mesh(streifenGeometrie, streifenMaterial);
    streifen.rotation.x = Math.PI / 2; // Torus liegt sonst senkrecht
    ringGruppe.add(streifen);
    entsorgbar.push(streifenGeometrie, streifenMaterial);

    // -------------------------------------------------------------- Strahler
    const scheinTextur = makeGlowTexture(0.0, 0.5);
    entsorgbar.push(scheinTextur);

    const strahlerSchein = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: scheinTextur,
        color: 0xbfe4ff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      })
    );
    strahlerSchein.position.set(0, 0.6, -3.2);
    strahlerSchein.scale.setScalar(14);
    szene.add(strahlerSchein);
    entsorgbar.push(strahlerSchein.material);

    // Lichtkegel aus dem Hintergrund nach vorn — offener Konus, additiv
    const kegelGeometrie = new THREE.ConeGeometry(4.6, 13, 48, 1, true);
    const kegelMaterial = new THREE.MeshBasicMaterial({
      color: 0x9fd8ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const kegel = new THREE.Mesh(kegelGeometrie, kegelMaterial);
    kegel.rotation.x = -Math.PI / 2;
    kegel.position.set(0, 0.4, -5.4);
    szene.add(kegel);
    entsorgbar.push(kegelGeometrie, kegelMaterial);

    // ---------------------------------------------------------------- Nebel
    const rauchTexturen = [makeSmokeTexture(1), makeSmokeTexture(2), makeSmokeTexture(3)];
    entsorgbar.push(...rauchTexturen);

    const nebelGruppe = new THREE.Group();
    szene.add(nebelGruppe);

    const schwaden = Array.from({ length: NEBEL_SCHWADEN }, (_, i) => {
      const material = new THREE.SpriteMaterial({
        map: rauchTexturen[i % rauchTexturen.length],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      });
      const sprite = new THREE.Sprite(material);

      // Deterministisch verteilt statt zufällig: gleiche Szene bei jedem Laden
      const winkel = (i / NEBEL_SCHWADEN) * Math.PI * 2 * 1.618;
      const abstand = 1.2 + (i % 5) * 0.9;
      sprite.position.set(
        Math.cos(winkel) * abstand,
        -1.9 + ((i * 0.37) % 2.6),
        Math.sin(winkel) * abstand * 0.7 - 0.8
      );
      const groesse = 6 + (i % 4) * 2.2;
      sprite.scale.set(groesse, groesse * 0.72, 1);
      sprite.userData = { winkel, abstand, tempo: 0.06 + (i % 7) * 0.012, basisY: sprite.position.y };
      nebelGruppe.add(sprite);
      entsorgbar.push(material);
      return sprite;
    });

    // -------------------------------------------------------------- Person
    const personTextur = new THREE.Texture();
    personTextur.colorSpace = THREE.SRGBColorSpace;
    personTextur.generateMipmaps = false;
    personTextur.minFilter = THREE.LinearFilter;
    personTextur.magFilter = THREE.LinearFilter;

    const personMaterial = new THREE.MeshBasicMaterial({
      map: personTextur,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    });
    /* ImageBitmap-Texturen landen ungespiegelt im Speicher, und weder
       `texture.flipY` noch `createImageBitmap({imageOrientation})` haben das
       zuverlässig gedreht — die Figur stand auf dem Kopf. Deshalb die
       V-Achse einmalig in der Geometrie umkehren: das ist unabhängig davon,
       wie der Browser die Textur hochlädt, und kostet zur Laufzeit nichts. */
    const personGeometrie = new THREE.PlaneGeometry(
      PERSON_HOEHE * PERSON_SEITENVERHAELTNIS,
      PERSON_HOEHE
    );
    const uv = personGeometrie.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
    uv.needsUpdate = true;

    const person = new THREE.Mesh(personGeometrie, personMaterial);
    person.position.set(0, PERSON_MITTE_Y, 0);
    person.renderOrder = 2;
    szene.add(person);
    entsorgbar.push(personTextur, personMaterial, person.geometry);

    // Bodenreflex, damit die Figur nicht in der Luft zu schweben scheint
    const reflexTextur = makeGlowTexture(0.0, 0.42);
    const reflex = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: reflexTextur,
        color: 0x7fc8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
    );
    // Bodenschein direkt unter den Füßen, also auf der Ringebene
    reflex.position.set(0, PERSON_FUSS_Y - 0.08, 0.2);
    reflex.scale.set(5.5, 1.2, 1);
    szene.add(reflex);
    entsorgbar.push(reflexTextur, reflex.material);

    /* Warmes Gegenlicht hinter der Figur: hebt die Silhouette vom kühlen
       Strahler ab, sobald Dennis aus dem Nebel tritt — klassische
       Key/Rim-Lichtführung, nur als billiger additiver Sprite. */
    const gegenlicht = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: scheinTextur,
        color: 0xffc9a0,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
    );
    gegenlicht.position.set(0, PERSON_MITTE_Y + 0.4, -1.4);
    gegenlicht.scale.set(6, 8, 1);
    szene.add(gegenlicht);
    entsorgbar.push(gegenlicht.material);

    /* Tiefen-Partikel: schwach leuchtende Punkte im Raum hinter dem Ring.
       Sie geben der Kamerafahrt Parallaxe und damit echte Tiefenwirkung —
       ohne sie liest sich der schwarze Hintergrund als flache Fläche.
       Deterministisch verteilt, damit die Szene bei jedem Laden gleich ist. */
    const punktPositionen = new Float32Array(PARTIKEL * 3);
    for (let i = 0; i < PARTIKEL; i++) {
      punktPositionen[i * 3] = (streu(i, 11) - 0.5) * 52;
      punktPositionen[i * 3 + 1] = -3 + streu(i, 12) * 14;
      punktPositionen[i * 3 + 2] = -46 + streu(i, 13) * 50;
    }
    const punktGeometrie = new THREE.BufferGeometry();
    punktGeometrie.setAttribute("position", new THREE.BufferAttribute(punktPositionen, 3));
    const punktMaterial = new THREE.PointsMaterial({
      map: scheinTextur,
      color: 0x8fd4ff,
      size: 0.32,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const punkte = new THREE.Points(punktGeometrie, punktMaterial);
    szene.add(punkte);
    entsorgbar.push(punktGeometrie, punktMaterial);

    // ------------------------------------------------------------ Zustand
    const zustand = { ziel: 0, weich: 0 };
    /* Basis-Sichtfeld aus groesseAnpassen — szeneAktualisieren legt darauf
       einen leichten scrollabhängigen Tele-Zuschlag. */
    let basisFov = 42;
    let frames: ImageBitmap[] = [];
    let letzterFrameIndex = -1;
    let laeuft = true;
    let animationsId = 0;

    function groesseAnpassen() {
      const breite = canvas.clientWidth || window.innerWidth;
      const hoehe = canvas.clientHeight || window.innerHeight;
      renderer.setSize(breite, hoehe, false);
      kamera.aspect = breite / hoehe;

      // Hochformat: Sichtfeld weiten, sonst ragt der Ring aus dem Bild
      basisFov = kamera.aspect < 0.85 ? 58 : kamera.aspect < 1.3 ? 50 : 42;
      kamera.fov = basisFov;
      kamera.updateProjectionMatrix();
    }

    function szeneAktualisieren(p: number, zeit: number) {
      // --- Kamerafahrt: drei Stützpunkte, weich verblendet
      const anflug = rampe(p, 0.0, 0.62);
      const feinschnitt = rampe(p, 0.62, 1.0);
      /* Endstand (0, 2.2, 13.5) mit Blick auf (0, 1.8, 0) ist so gewählt,
         dass beides ins Bild passt: der vordere Ringbogen (y -0.67, z 4.56,
         also nur ~9 Einheiten entfernt und dadurch am schnellsten aus dem
         Bild laufend) und die erhobenen Hände bei y 5.25. */
      kamera.position.set(
        Math.sin(p * Math.PI * 0.6) * 0.7,
        /* Das leichte zeitbasierte Schweben (±0.05) nimmt der Fahrt die
           Starrheit einer Schiene; bei reduzierter Bewegung ist zeit 0 und
           der Anteil fällt weg. */
        THREE.MathUtils.lerp(3.0, 2.2, anflug) - feinschnitt * 0.05 + Math.sin(zeit * 0.4) * 0.05,
        THREE.MathUtils.lerp(20.0, 13.5, anflug) - feinschnitt * 0.4
      );
      kamera.lookAt(0, THREE.MathUtils.lerp(1.2, 1.8, anflug), 0);
      /* Tele-Zuschlag als Bogen, nicht als Rampe: er wächst auf der Fahrt
         auf -3.5° und geht bis p 0.95 wieder auf 0 zurück. Als reine Rampe
         blieb das Sichtfeld am Ende enger — dadurch schnitt die Oberkante
         die erhobenen Hände ab, gegen die der Endstand oben abgestimmt ist. */
      const teleBogen = rampe(p, 0.25, 0.62) * (1 - rampe(p, 0.72, 0.95));
      kamera.fov = basisFov - teleBogen * 3.5;
      kamera.updateProjectionMatrix();

      // --- Ring: Grunddrehung plus scrollabhängiger Zuschlag
      ringGruppe.rotation.y = zeit * GRUNDTEMPO + SPIN_GESAMT * Math.pow(p, 1.8);
      ringGruppe.rotation.x = RING_NEIGUNG + rampe(p, 0.2, 1.0) * 0.05;

      /* Badges am hinteren Ringbogen abdunkeln — mit Kontrastkurve statt
         linear: hinten fällt stärker zurück (dunkler + grauer Tint),
         vorn steht größer und ungetrübt. Das trennt die vordere, lesbare
         Reihe sauber vom hinteren Bogen und verstärkt die Tiefe. */
      for (const badge of badges) {
        const weltZ = Math.cos(badge.userData.winkel + ringGruppe.rotation.y);
        const material = badge.material as THREE.SpriteMaterial;
        const tiefe = Math.pow((weltZ + 1) / 2, 1.6);
        material.opacity = THREE.MathUtils.lerp(0.22, 1, tiefe);
        material.color.setScalar(THREE.MathUtils.lerp(0.6, 1, tiefe));
        badge.scale.setScalar(THREE.MathUtils.lerp(0.7, 1.06, tiefe));
      }

      // --- Tempo-Ring: Lichtspur wächst mit der Drehzahl (∝ p, wie der
      // Spin-Zuschlag) und bleibt am Ende als dezente Bahn stehen.
      streifenMaterial.opacity = rampe(p, 0.15, 0.85) * 0.3;

      // --- Nebel: dicht am Anfang, verzieht sich bis p 0.78
      const nebelStaerke = 1 - rampe(p, 0.28, 0.78);
      for (const schwade of schwaden) {
        const d = schwade.userData;
        const winkel = d.winkel + zeit * d.tempo;
        schwade.position.x = Math.cos(winkel) * d.abstand;
        schwade.position.z = Math.sin(winkel) * d.abstand * 0.7 - 0.8;
        schwade.position.y = d.basisY + Math.sin(zeit * 0.22 + d.winkel) * 0.35 + p * 1.6;
        (schwade.material as THREE.SpriteMaterial).opacity = nebelStaerke * 0.34;
      }

      // --- Strahler: wächst auf und bleibt dann stehen
      const licht = 0.12 + rampe(p, 0.1, 0.72) * 0.88;
      (strahlerSchein.material as THREE.SpriteMaterial).opacity = licht * 0.55;
      strahlerSchein.scale.setScalar(THREE.MathUtils.lerp(9, 17, licht));
      kegelMaterial.opacity = licht * 0.14;

      // --- Person: erscheint aus dem Nebel und dreht sich mit
      const sichtbar = rampe(p, 0.2, 0.46);
      personMaterial.opacity = sichtbar;
      // Endlage exakt im Ringmittelpunkt (z 0), Anfangslage weiter hinten
      // im Nebel — deshalb lerp auf 0 und nicht davor.
      person.position.z = THREE.MathUtils.lerp(-2.6, 0, sichtbar);
      person.position.y = PERSON_MITTE_Y + (1 - sichtbar) * 0.5;
      const massstab = THREE.MathUtils.lerp(0.86, 1, sichtbar);
      person.scale.setScalar(massstab);
      (reflex.material as THREE.SpriteMaterial).opacity = sichtbar * licht * 0.32;
      // Warmes Gegenlicht folgt der Sichtbarkeit der Figur
      (gegenlicht.material as THREE.SpriteMaterial).opacity = sichtbar * licht * 0.22;

      // --- Tiefen-Partikel: langsame Eigenrotation plus Parallaxe zur
      // Kamerafahrt; sie hellen mit dem Strahler leicht auf.
      punkte.rotation.y = zeit * 0.008 + p * 0.3;
      punkte.position.z = p * 3;
      punktMaterial.opacity = 0.14 + licht * 0.14;

      // Überschrift verabschiedet sich, bevor die Figur den Platz einnimmt —
      // sonst liegt die Zeile mitten in Dennis' Gesicht.
      if (titelRef.current) {
        titelRef.current.style.opacity = String(1 - rampe(p, 0.08, 0.34));
      }

      if (frames.length === FRAME_ANZAHL) {
        const lauf = THREE.MathUtils.clamp((p - 0.18) / (0.92 - 0.18), 0, 1);
        const index = Math.min(FRAME_ANZAHL - 1, Math.round(lauf * (FRAME_ANZAHL - 1)));
        if (index !== letzterFrameIndex) {
          letzterFrameIndex = index;
          personTextur.image = frames[index];
          personTextur.needsUpdate = true;
        }
      }
    }

    function schleife() {
      if (!laeuft) return;
      animationsId = requestAnimationFrame(schleife);

      /* Nachziehen statt hartes Setzen: entkoppelt die Darstellung vom
         stotternden Scroll-Event und ergibt die weiche Kamerafahrt.
         0.065 statt 0.085: die Fahrt schleppt etwas länger nach und wirkt
         dadurch schwerer/filmischer, ohne spürbar zu verzögern. */
      zustand.weich += (zustand.ziel - zustand.weich) * 0.065;

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

    // Bei reduzierter Bewegung: Endzustand einmal zeichnen, keine Schleife
    if (wenigerBewegung) {
      zustand.weich = 1;
      zustand.ziel = 1;
    } else {
      schleife();
    }

    const abbruch = new AbortController();
    const { pfad } = waehleSequenz();

    ladeSequenz(pfad, setLadeAnteil, abbruch.signal)
      .then((geladen) => {
        frames = geladen;
        setBereit(true);
        if (wenigerBewegung) {
          szeneAktualisieren(1, 0);
          renderer.render(szene, kamera);
        }
      })
      .catch((err: unknown) => {
        if ((err as Error)?.name === "AbortError") return;
        console.error("[MagicRingScene] Sequenz nicht ladbar:", err);
        setFehler("sequenz");
      });

    return () => {
      laeuft = false;
      cancelAnimationFrame(animationsId);
      abbruch.abort();
      ausloeser.kill();
      window.removeEventListener("resize", groesseAnpassen);
      for (const teil of entsorgbar) teil.dispose();
      for (const bitmap of frames) bitmap.close();
      renderer.dispose();
    };
  }, []);

  // Ohne WebGL (alte Geräte, abgeschaltete Hardwarebeschleunigung) bleibt
  // das bisherige CSS-Karussell — besser als eine leere schwarze Fläche.
  if (fehler === "kein-webgl") {
    return (
      <section className="py-24" aria-labelledby="zauberring-titel">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Integrationen
          </p>
          <h2 id="zauberring-titel" className="mt-3 text-2xl sm:text-3xl">
            Wir binden die Tools an, die du schon nutzt
          </h2>
        </div>
        <LogoCarousel3D />
      </section>
    );
  }

  return (
    <section
      ref={sektionRef}
      aria-labelledby="zauberring-titel"
      className="relative h-[340vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="block h-full w-full"
        />

        <div
          ref={titelRef}
          className="pointer-events-none absolute inset-x-0 top-[14vh] px-6 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Integrationen
          </p>
          <h2 id="zauberring-titel" className="mx-auto mt-3 max-w-2xl text-2xl sm:text-3xl">
            Wir binden die Tools an, die du schon nutzt
          </h2>
        </div>

        {/* Ladeanzeige nur solange die Sequenz fehlt — der Ring dreht sich
            schon vorher, die Szene ist also nie leer. */}
        {!bereit && !fehler && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[12vh] px-6 text-center">
            <p className="text-xs uppercase tracking-wider text-muted">
              Bühne wird aufgebaut … {Math.round(ladeAnteil * 100)} %
            </p>
          </div>
        )}
      </div>

      {/* Für Screenreader und ohne WebGL: die Logos als echte Liste. */}
      <div className="sr-only">
        <p>In der Animation drehen sich die Logos folgender Werkzeuge, die wir anbinden:</p>
        <ul>
          {toolLogos.map((tool) => (
            <li key={tool.name}>{tool.name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
