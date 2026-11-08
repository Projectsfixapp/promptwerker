"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeUpStart, fadeUpUebergang, fadeUpZiel, viewportEinmal } from "@/lib/motion";

export default function RoadmapCard({
  onOpenContact,
  onOpenAppointment,
}: {
  onOpenContact: (meta?: { heading?: string; subject?: string }) => void;
  onOpenAppointment: () => void;
}) {
  const [auditDone, setAuditDone] = useState(false);

  function handleOneOnOne() {
    if (auditDone) {
      onOpenAppointment();
      return;
    }
    document.getElementById("audit-section")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <motion.div
      initial={fadeUpStart}
      whileInView={fadeUpZiel}
      viewport={viewportEinmal}
      transition={fadeUpUebergang}
      className="glass-panel rounded-3xl p-6 sm:p-8"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
        Fahrplan
      </span>
      <h3 className="mt-3 text-xl sm:text-2xl">
        Jetzt risikofrei deine klare Strategie als Roadmap erstellen
      </h3>
      <p className="mt-3 font-card-body text-sm leading-relaxed text-body sm:text-base">
        Mit Workshop im Selbststudium, als 1:1-Beratung in persönlicher Betreuung — oder direkt
        einen fertigen Flow oder Agenten kaufen.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/leistungen/workshop-roadmap"
          className="glass-button-liquid rounded-xl px-4 py-3 text-center text-sm font-semibold text-ink"
        >
          Workshop (99€)
        </Link>
        <button
          type="button"
          onClick={handleOneOnOne}
          className="glass-button-liquid rounded-xl px-4 py-3 text-center text-sm font-semibold text-ink"
        >
          1:1-Beratung
        </button>
        <Link
          href="/portal/login"
          className="glass-button-liquid rounded-xl px-4 py-3 text-center text-sm font-semibold text-ink"
        >
          Flow/Agent kaufen
        </Link>
      </div>

      <label className="mt-4 flex items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={auditDone}
          onChange={(e) => setAuditDone(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-white/30 bg-white/5 accent-accent"
        />
        Audit bereits gemacht — 1:1-Beratung führt direkt zur Terminbuchung
      </label>
    </motion.div>
  );
}
