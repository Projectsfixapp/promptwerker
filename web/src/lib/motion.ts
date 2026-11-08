import type { Transition, Variants } from "motion/react";

/* Gemeinsame Bewegungs-DNA von promptwerker.de.

   Diese Werte standen vorher wörtlich in TopicCard, RoadmapCard, DetailView
   und den Overlay-Formularen (ContactFormReveal, AppointmentFormReveal).
   Sie sind hierher gezogen, damit die Startseite und die Speaker-Seite
   /dennis-beichert denselben Quelltext benutzen statt zweier Kopien, die
   auseinanderlaufen. Werte nicht ändern, ohne beide Seiten neben-
   einander im Browser zu prüfen — Abgleich steht in docs/speaker/MOTION_AUDIT.md. */

/** Kurven-Easing aller großen Bewegungen (Slide-Panel, Kreis-Reveal, Fade-up). */
export const easeWerk = [0.22, 1, 0.36, 1] as const;

/** Auslöser für Scroll-Eintritte: einmalig, sobald 40 % sichtbar sind. */
export const viewportEinmal = { once: true, amount: 0.4 } as const;

/** TopicCard: seitlicher Feder-Eintritt (±48 px), Hover-Anheben. */
export const seitenEintrittVersatz = 48;
export const federEintritt: Transition = { type: "spring", stiffness: 90, damping: 18 };
export const hoverAnheben = {
  y: -4,
  scale: 1.015,
  transition: { duration: 0.25, ease: "easeOut" },
} as const;

/** RoadmapCard: Fade-up um 24 px in 0,6 s. */
export const fadeUpStart = { opacity: 0, y: 24 } as const;
export const fadeUpZiel = { opacity: 1, y: 0 } as const;
export const fadeUpUebergang: Transition = { duration: 0.6, ease: easeWerk };

/** DetailView: gestaffelter Inhalt nach dem Slide (0,22 s + 0,06 s je Element). */
export const inhaltStaffel: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.22 + i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

/** DetailView: Slide-Panel von der Seite in 1,2 s. */
export const panelUebergang: Transition = { duration: 1.2, ease: easeWerk };

/** Kontakt- und Termin-Overlay: Kreis-Reveal in 1,4 s. */
export const kreisRevealUebergang: Transition = { duration: 1.4, ease: easeWerk };
export function kreis(radius: string, ursprung = "50% 50%"): string {
  return `circle(${radius} at ${ursprung})`;
}
