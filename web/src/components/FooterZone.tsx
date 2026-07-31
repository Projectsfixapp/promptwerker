"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import LogoMarquee from "./LogoMarquee";

/* Nur noch der Übergang von der dunklen Startseite ins helle Laufband.
   Der Seitenfuß selbst hängt jetzt im Root-Layout und läuft dadurch auf
   allen Seiten — hier würde er sonst doppelt gerendert. */

export default function FooterZone() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: zoneRef,
    offset: ["start end", "end end"],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={zoneRef} className="relative">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent to-white"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative z-10">
        <LogoMarquee />
      </div>
    </div>
  );
}
