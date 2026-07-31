"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { anbieter } from "@/lib/legal";

/* Kontakt-Overlay hinter den CTA-Knöpfen.
   Vorher setzte handleSubmit nur `sent = true` — die Anfrage wurde nie
   verschickt, der Besucher bekam trotzdem „Danke!“ zu sehen. Jetzt läuft
   sie über dieselbe Route wie das Formular im Seitenfuß (/api/kontakt).

   Barrierefreiheit: role="dialog" mit aria-modal, Fokus springt beim
   Öffnen ins Feld, Escape schließt, Beschriftungen sichtbar statt nur als
   Platzhalter. */

type Status =
  | { art: "leer" }
  | { art: "sendet" }
  | { art: "erfolg" }
  | { art: "fehler"; text: string }
  | { art: "mailto" };

const feldKlasse =
  "rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-ink focus:border-accent";
const labelKlasse = "text-xs font-semibold uppercase tracking-wider text-muted";

export default function ContactFormReveal({
  origin,
  onClose,
  heading = "Kostenloses Analysegespräch",
  subject,
}: {
  origin: { x: number; y: number } | null;
  onClose: () => void;
  heading?: string;
  subject?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ art: "leer" });
  const ersteEingabeRef = useRef<HTMLInputElement>(null);

  const ox = origin?.x ?? window.innerWidth / 2;
  const oy = origin?.y ?? window.innerHeight / 2;
  const circle = (radius: string) => `circle(${radius} at ${ox}px ${oy}px)`;

  useEffect(() => {
    ersteEingabeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formular = event.currentTarget;
    const daten = new FormData(formular);

    // Der Anlass (welcher Knopf geklickt wurde) gehört in die Nachricht,
    // sonst geht die Information beim Versand verloren.
    const nachricht = [
      subject ? `Anlass: ${subject}` : null,
      String(daten.get("nachricht") ?? ""),
    ]
      .filter(Boolean)
      .join("\n\n");

    setStatus({ art: "sendet" });

    try {
      const antwort = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: daten.get("name"),
          email: daten.get("email"),
          telefon: daten.get("telefon"),
          nachricht,
          einwilligung: daten.get("einwilligung") === "on",
          website: daten.get("website"),
        }),
      });

      const ergebnis = (await antwort.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (antwort.ok && ergebnis.ok) {
        setStatus({ art: "erfolg" });
        return;
      }
      if (ergebnis.error === "SMTP_NICHT_KONFIGURIERT") {
        setStatus({ art: "mailto" });
        return;
      }
      setStatus({
        art: "fehler",
        text: ergebnis.error ?? "Die Nachricht konnte nicht gesendet werden.",
      });
    } catch {
      setStatus({
        art: "fehler",
        text: "Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.",
      });
    }
  }

  return (
    <motion.div
      initial={{ clipPath: circle("0%") }}
      animate={{ clipPath: circle("150%") }}
      exit={{ clipPath: circle("0%") }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-6 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titel`}
        className="glass-panel relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Dialog schließen"
          className="absolute right-5 top-5 text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <h2 id={`${id}-titel`} className="pr-8 text-xl">
          {heading}
        </h2>

        {status.art === "erfolg" ? (
          <p role="status" className="mt-6 text-base text-ink">
            Danke! Deine Anfrage ist angekommen — wir melden uns innerhalb eines Werktags.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-name`} className={labelKlasse}>
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                ref={ersteEingabeRef}
                id={`${id}-name`}
                name="name"
                required
                aria-required="true"
                autoComplete="name"
                className={feldKlasse}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-email`} className={labelKlasse}>
                E-Mail <span aria-hidden="true">*</span>
              </label>
              <input
                id={`${id}-email`}
                type="email"
                name="email"
                required
                aria-required="true"
                autoComplete="email"
                className={feldKlasse}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-telefon`} className={labelKlasse}>
                Telefon
              </label>
              <input
                id={`${id}-telefon`}
                type="tel"
                name="telefon"
                autoComplete="tel"
                className={feldKlasse}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-nachricht`} className={labelKlasse}>
                Worum geht’s? <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={`${id}-nachricht`}
                name="nachricht"
                rows={3}
                required
                aria-required="true"
                className={feldKlasse}
              />
            </div>

            {/* Honigtopf — vor Blick und Hilfsmitteln verborgen. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${id}-website`}>Website (bitte frei lassen)</label>
              <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex items-start gap-3">
              <input
                id={`${id}-einwilligung`}
                name="einwilligung"
                type="checkbox"
                required
                aria-required="true"
                className="mt-1 h-4 w-4 shrink-0 accent-accent"
              />
              <label htmlFor={`${id}-einwilligung`} className="text-xs leading-relaxed text-body">
                Ich habe die{" "}
                <Link href="/datenschutz" className="text-accent underline underline-offset-2">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen und bin mit der Verarbeitung meiner Angaben einverstanden.{" "}
                <span aria-hidden="true">*</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status.art === "sendet"}
              className="mt-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.art === "sendet" ? "Wird gesendet …" : "Anfrage senden"}
            </button>

            <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm leading-relaxed">
              {status.art === "fehler" && (
                <span className="text-[color:var(--color-magenta-soft)]">{status.text}</span>
              )}
              {status.art === "mailto" && (
                <span className="text-[color:var(--color-magenta-soft)]">
                  Der Versand ist gerade nicht verfügbar. Schreib uns bitte direkt an{" "}
                  <a href={`mailto:${anbieter.email}`} className="text-accent underline">
                    {anbieter.email}
                  </a>
                  .
                </span>
              )}
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
}
