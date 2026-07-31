"use client";

import { useState } from "react";
import Link from "next/link";
import ContactFormReveal from "@/components/ContactFormReveal";
import { AnimatePresence } from "motion/react";

export default function WorkshopRoadmapPage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <main
      id="inhalt"
      className="min-h-screen bg-[color:var(--color-paper)] text-[color:var(--color-paper-ink)]"
    >
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-36 sm:pt-44">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-paper-body)] transition-colors hover:text-[color:var(--color-magenta)]"
        >
          ← Zur Startseite
        </Link>

        <span className="mt-8 block text-xs font-semibold uppercase tracking-wider text-[color:var(--color-magenta)]">
          Video-Workshop · 99€
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Deine Roadmap im Selbststudium</h1>
        <p className="mt-5 max-w-xl font-card-body text-lg leading-relaxed text-[color:var(--color-paper-body)]">
          Ein geführter Video-Workshop, der dich Schritt für Schritt zu deiner eigenen
          KI-Roadmap bringt — ohne Termin, in deinem Tempo.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="glass-panel-light overflow-hidden rounded-3xl">
          <video controls className="aspect-video w-full bg-black/5">
            <source src="/videos/workshop-roadmap-placeholder.mp4" type="video/mp4" />
            Dein Browser unterstützt das Video-Element nicht.
          </video>
        </div>
        <p className="mt-3 font-card-body text-xs text-[color:var(--color-paper-body)]">
          Platzhalter — das echte Workshop-Video wird noch ergänzt.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="text-2xl sm:text-3xl">Was der Workshop dir bringt</h2>
        <ul className="mt-8 flex flex-col gap-4">
          {[
            "Eine ehrliche Standortbestimmung: wo dein Unternehmen bei KI wirklich steht.",
            "Priorisierte Schritte statt Buzzword-Bingo — was sich für dich zuerst lohnt.",
            "Vorlagen, die du direkt für deine eigene Roadmap übernehmen kannst.",
          ].map((point, i) => (
            <li
              key={i}
              className="glass-panel-light flex items-start gap-4 rounded-2xl p-5"
            >
              <span className="mt-0.5 shrink-0 text-[color:var(--color-magenta)]">✓</span>
              <span className="font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)] sm:text-base">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="glass-panel-light rounded-3xl p-10">
          <h2 className="text-2xl sm:text-3xl">Jetzt für 99€ sichern</h2>
          <p className="mx-auto mt-4 max-w-xl font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)] sm:text-base">
            Einmalig 99€, lebenslanger Zugriff. Zahlung folgt in Kürze per Link — bis dahin
            merken wir deine Anfrage direkt vor.
          </p>
          <button
            type="button"
            onClick={() => setShowContact(true)}
            className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--color-magenta)" }}
          >
            Jetzt für 99€ kaufen
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showContact && (
          <ContactFormReveal
            origin={null}
            onClose={() => setShowContact(false)}
            heading="Workshop-Kauf (99€)"
            subject="Workshop-Kauf (99€)"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
