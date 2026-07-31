"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { anbieter } from "@/lib/legal";

/* Kontaktformular im Seitenfuß.
   Barrierefreiheit: sichtbare Labels statt Platzhalter-Beschriftung,
   Fehler- und Erfolgsmeldung in einer aria-live-Region, Pflichtfelder mit
   aria-required, Fokus-Ringe über die globale focus-visible-Regel.

   Der Honigtopf „website“ ist per CSS und aria-hidden aus dem Weg geräumt,
   bleibt aber im DOM — Bots füllen ihn aus, Screenreader lesen ihn nicht. */

type Status =
  | { art: "leer" }
  | { art: "sendet" }
  | { art: "erfolg" }
  | { art: "fehler"; text: string }
  | { art: "mailto" };

const feldKlasse =
  "w-full rounded-xl border border-[color:var(--color-paper-ink)]/15 bg-white/70 px-4 py-2.5 font-card-body text-sm text-[color:var(--color-paper-ink)] placeholder:text-[color:var(--color-paper-body)]/60 focus:border-[color:var(--color-accent-deep)] focus:outline-none";

const labelKlasse =
  "font-card-body text-xs font-semibold uppercase tracking-wider text-[color:var(--color-paper-body)]";

export default function FooterContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ art: "leer" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formular = event.currentTarget;
    const daten = new FormData(formular);

    setStatus({ art: "sendet" });

    try {
      const antwort = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: daten.get("name"),
          email: daten.get("email"),
          unternehmen: daten.get("unternehmen"),
          telefon: daten.get("telefon"),
          nachricht: daten.get("nachricht"),
          einwilligung: daten.get("einwilligung") === "on",
          website: daten.get("website"),
        }),
      });

      const ergebnis = (await antwort.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (antwort.ok && ergebnis.ok) {
        formular.reset();
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
    <section aria-labelledby={`${id}-titel`} className="w-full max-w-md">
      <h2
        id={`${id}-titel`}
        className="text-lg text-[color:var(--color-paper-ink)]"
      >
        Schreib uns
      </h2>
      <p className="mt-2 font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)]">
        Kurz beschreiben, worum es geht — wir melden uns innerhalb eines Werktags.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate={false}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className={labelKlasse}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
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
            name="email"
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            className={feldKlasse}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-unternehmen`} className={labelKlasse}>
              Unternehmen
            </label>
            <input
              id={`${id}-unternehmen`}
              name="unternehmen"
              type="text"
              autoComplete="organization"
              className={feldKlasse}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-telefon`} className={labelKlasse}>
              Telefon
            </label>
            <input
              id={`${id}-telefon`}
              name="telefon"
              type="tel"
              autoComplete="tel"
              className={feldKlasse}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-nachricht`} className={labelKlasse}>
            Nachricht <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${id}-nachricht`}
            name="nachricht"
            rows={4}
            required
            aria-required="true"
            className={feldKlasse}
          />
        </div>

        {/* Honigtopf — nicht befüllen. Vor Hilfsmitteln und Blick verborgen. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website (bitte frei lassen)</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex items-start gap-3">
          <input
            id={`${id}-einwilligung`}
            name="einwilligung"
            type="checkbox"
            required
            aria-required="true"
            className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--color-accent-deep)]"
          />
          <label
            htmlFor={`${id}-einwilligung`}
            className="font-card-body text-xs leading-relaxed text-[color:var(--color-paper-body)]"
          >
            Ich habe die{" "}
            <Link
              href="/datenschutz"
              className="text-[color:var(--color-accent-deep)] underline underline-offset-2"
            >
              Datenschutzerklärung
            </Link>{" "}
            gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage
            einverstanden. <span aria-hidden="true">*</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status.art === "sendet"}
          className="mt-1 self-start rounded-full bg-[color:var(--color-accent-deep)] px-6 py-3 font-card-body text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.art === "sendet" ? "Wird gesendet …" : "Anfrage senden"}
        </button>

        <p
          role="status"
          aria-live="polite"
          className="min-h-[1.25rem] font-card-body text-sm leading-relaxed"
        >
          {status.art === "erfolg" && (
            <span className="text-[color:var(--color-accent-deep)]">
              Danke! Deine Nachricht ist raus — wir melden uns innerhalb eines Werktags.
            </span>
          )}
          {status.art === "fehler" && (
            <span className="text-[color:var(--color-magenta)]">{status.text}</span>
          )}
          {status.art === "mailto" && (
            <span className="text-[color:var(--color-magenta)]">
              Der Versand ist gerade nicht verfügbar. Schreib uns bitte direkt an{" "}
              <a
                href={`mailto:${anbieter.email}`}
                className="text-[color:var(--color-accent-deep)] underline underline-offset-2"
              >
                {anbieter.email}
              </a>
              .
            </span>
          )}
        </p>
      </form>
    </section>
  );
}
