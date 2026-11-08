"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { buehnenBild } from "@/lib/speaker";
import { federEintritt, hoverAnheben, seitenEintrittVersatz, viewportEinmal } from "@/lib/motion";

/* Startseiten-Teaser zur Speaker-Seite. Bewusst in der Optik der Startseite
   (Glas, Cyan-CTA) und mit demselben Eintritt wie die Themenkarten
   (TopicCard), damit er sich in den Rhythmus einfügt statt als fremdes
   Banner aufzufallen. */
export default function SpeakerTeaser() {
  return (
    <motion.aside
      aria-labelledby="speaker-teaser-titel"
      initial={{ opacity: 0, x: -seitenEintrittVersatz }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={hoverAnheben}
      viewport={viewportEinmal}
      transition={federEintritt}
      className="glass-panel grid overflow-hidden rounded-2xl transition-[box-shadow,border-color] duration-300 hover:border-accent/60 hover:shadow-[0_0_55px_14px_rgba(56,217,255,0.32)] sm:grid-cols-5"
    >
      <div className="relative aspect-[4/3] sm:col-span-2 sm:aspect-auto">
        <Image
          src={buehnenBild}
          alt="Dennis Beichert auf der Bühne bei einem Vortrag über KI in Unternehmen"
          fill
          sizes="(min-width: 640px) 320px, 100vw"
          className="object-cover object-[52%_50%]"
        />
      </div>
      <div className="p-7 sm:col-span-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">Keynotes</span>
        <h3 id="speaker-teaser-titel" className="mt-2 text-xl">
          KI auf der Bühne. Direkt aus der Praxis.
        </h3>
        <p className="mt-3 font-card-body text-sm leading-relaxed text-body">
          Gründer Dennis Beichert spricht auf Konferenzen und Firmenevents über KI-Agenten, KI im
          Mittelstand und den eigenen Online-Shop, den er mit einem Team aus KI-Agenten führt.
        </p>
        <Link
          href="/dennis-beichert"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
        >
          Dennis als Speaker entdecken
        </Link>
      </div>
    </motion.aside>
  );
}
