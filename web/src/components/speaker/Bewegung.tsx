"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  fadeUpStart,
  fadeUpUebergang,
  fadeUpZiel,
  federEintritt,
  hoverAnheben,
  kreis,
  kreisRevealUebergang,
  seitenEintrittVersatz,
  viewportEinmal,
} from "@/lib/motion";

/* Bewegungs-Bausteine der Speaker-Seite. Alle Werte kommen aus lib/motion.ts,
   also aus demselben Quelltext wie TopicCard, RoadmapCard, DetailView und
   die Kontakt-Overlays der Startseite. Zuordnung: docs/speaker/MOTION_AUDIT.md. */

/** Rahmen: respektiert „Bewegung reduzieren“ (Transformationen aus, Deckkraft bleibt). */
export function BewegungsRahmen({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** = RoadmapCard: Fade-up 24 px, 0,6 s, einmalig bei 40 % Sichtbarkeit. */
export function Auftritt({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={fadeUpStart}
      whileInView={fadeUpZiel}
      viewport={viewportEinmal}
      transition={fadeUpUebergang}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** = TopicCard: Feder-Eintritt von der Seite (±48 px), optional Hover-Anheben. */
export function SeitenEintritt({
  children,
  seite,
  anheben = false,
  className,
}: {
  children: ReactNode;
  seite: "links" | "rechts";
  anheben?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: seite === "rechts" ? seitenEintrittVersatz : -seitenEintrittVersatz }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={anheben ? hoverAnheben : undefined}
      viewport={viewportEinmal}
      transition={federEintritt}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Abgeleitet vom Kontakt-Overlay: gleicher Kreis-Reveal (1,4 s, gleiche Kurve),
    aber beim Hineinscrollen statt beim Klick ausgelöst. Kein exaktes Gegenstück
    auf der Startseite, deshalb im Motion-Audit als Ableitung geführt. */
export function KreisReveal({
  children,
  className,
  panelClassName,
}: {
  children: ReactNode;
  /** Layout (z. B. Grid-Spalte) für den Außenrahmen. */
  className?: string;
  /** Optik der aufgedeckten Fläche. */
  panelClassName?: string;
}) {
  /* Zwei Ebenen, nicht eine: Chromium rechnet den eigenen clip-path des
     beobachteten Elements in die IntersectionObserver-Sichtbarkeit ein. Ein
     Element mit circle(0%) gilt dadurch als nie sichtbar, whileInView feuert
     nie und das Formular bliebe dauerhaft unsichtbar (gemessen 08.11.2026).
     Deshalb beobachtet der ungeclippte Außenrahmen, der Clip sitzt innen.
     clip-path ist keine Transformation, MotionConfig schaltet ihn nicht ab —
     bei „Bewegung reduzieren“ deshalb Dauer 0 statt bedingtem Rendern
     (bedingtes Rendern ergäbe einen Hydration-Mismatch). */
  const wenigerBewegung = useReducedMotion();
  return (
    <motion.div initial="zu" whileInView="auf" viewport={{ once: true, amount: 0.2 }} className={className}>
      <motion.div
        variants={{ zu: { clipPath: kreis("0%") }, auf: { clipPath: kreis("150%") } }}
        transition={wenigerBewegung ? { duration: 0 } : kreisRevealUebergang}
        className={panelClassName}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
