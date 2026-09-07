"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/* Scroll-Zusammenbau für die alternative Startseite (/start-b).

   Dieselbe Idee wie in ScrollWebsiteScene (Teile fliegen aus verstreuten
   Positionen an ihren Platz), aber DOM-basiert: der Inhalt bleibt echtes,
   serverseitig gerendertes HTML. Der Fortschritt hängt rein an der
   Scrollposition des Elements — rückwärts scrollen spielt die Bewegung
   rückwärts, ganz ohne eigenen Zustand.

   Die Streuung ist deterministisch aus dem Index abgeleitet (kein
   Math.random()), damit jedes Element bei jedem Laden aus derselben
   Richtung einfliegt und benachbarte Elemente versetzt starten. */

/** Deterministischer Streuwert — gleiche Funktion wie in ScrollWebsiteScene. */
function streu(i: number, kanal: number): number {
  const n = Math.sin(i * 127.1 + kanal * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export default function ScrollAssemblyItem({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  /** Position in der Reihenfolge — steuert Richtung und Versatz der Streuung. */
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* Erster Renderlauf liefert null (SSR-sicher, kein Hydration-Sprung);
     nach dem Mount true bei prefers-reduced-motion — dann bleiben die
     Transformationen einfach aus und der Inhalt steht ruhig an Ort. */
  const wenigerBewegung = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Von "Oberkante erreicht den unteren Viewport-Rand" bis "Oberkante
    // steht bei 45% der Viewport-Höhe" — das Teil ist angedockt, bevor
    // man es lesen will.
    offset: ["start end", "start 0.45"],
  });

  // Verstreute Startlage: Richtung wechselt mit dem Index, Weite und
  // Drehung streuen deterministisch — kein Teil fliegt wie das andere.
  const richtung = index % 2 === 0 ? -1 : 1;
  const startX = richtung * (80 + streu(index, 1) * 90);
  const startY = 60 + streu(index, 2) * 70;
  const startDrehung = richtung * (4 + streu(index, 3) * 6);

  const x = useTransform(scrollYProgress, [0, 1], [startX, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [startY, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [startDrehung, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={wenigerBewegung ? undefined : { x, y, rotate, scale, opacity }}
    >
      {children}
    </motion.div>
  );
}
