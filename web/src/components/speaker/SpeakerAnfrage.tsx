"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { anbieter } from "@/lib/legal";
import { talkTitel } from "@/lib/speaker";
import { eventFormate, eventTypen, publikumGroessen } from "@/lib/speakerAnfrage";

/* Speaker-/Keynote-Anfrage. Schickt an dieselbe Route wie die übrigen
   Formulare (/api/kontakt) mit anfrageTyp "speaker" — gleicher Honigtopf,
   gleiche Mengenbegrenzung, gleicher SMTP-Weg und gleicher mailto-Ersatz,
   wenn SMTP fehlt. Kein Erfolg wird angezeigt, ohne dass der Server ok meldet.

   Keynote-Karten verlinken mit data-thema="<Titel>" auf #anfrage; der
   Klick-Lauscher unten setzt das Wunschthema vor. */

type Status =
  | { art: "leer" }
  | { art: "sendet" }
  | { art: "erfolg" }
  | { art: "fehler"; text: string }
  | { art: "mailto" };

const labelKlasse = "sp-label text-[color:var(--sp-muted)]";

export default function SpeakerAnfrage() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ art: "leer" });
  const [thema, setThema] = useState("");

  useEffect(() => {
    function onKlick(event: MouseEvent) {
      const link = (event.target as HTMLElement).closest<HTMLElement>("[data-thema]");
      const wert = link?.dataset.thema;
      if (wert && talkTitel.includes(wert)) setThema(wert);
    }
    document.addEventListener("click", onKlick);
    return () => document.removeEventListener("click", onKlick);
  }, []);

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
          anfrageTyp: "speaker",
          name: daten.get("name"),
          email: daten.get("email"),
          telefon: daten.get("telefon"),
          organisation: daten.get("organisation"),
          eventTyp: daten.get("eventTyp"),
          format: daten.get("format"),
          ort: daten.get("ort"),
          datum: daten.get("datum"),
          publikum: daten.get("publikum"),
          thema: daten.get("thema"),
          nachricht: daten.get("nachricht"),
          einwilligung: daten.get("einwilligung") === "on",
          website: daten.get("website"),
        }),
      });
      const ergebnis = (await antwort.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (antwort.ok && ergebnis.ok) {
        formular.reset();
        setThema("");
        setStatus({ art: "erfolg" });
        return;
      }
      if (ergebnis.error === "SMTP_NICHT_KONFIGURIERT") {
        setStatus({ art: "mailto" });
        return;
      }
      setStatus({ art: "fehler", text: ergebnis.error ?? "Die Anfrage konnte nicht gesendet werden." });
    } catch {
      setStatus({ art: "fehler", text: "Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung." });
    }
  }

  const pflicht = <span aria-hidden="true" className="text-[color:var(--sp-lime)]"> *</span>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-describedby={`${id}-hinweis`}>
      <p id={`${id}-hinweis`} className="font-card-body text-sm text-[color:var(--sp-muted)]">
        Felder mit <span className="text-[color:var(--sp-lime)]">*</span> sind Pflicht. Alles andere hilft,
        ist aber kein Muss.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className={labelKlasse}>Name{pflicht}</label>
          <input id={`${id}-name`} name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" className="sp-feld" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-organisation`} className={labelKlasse}>Organisation / Firma{pflicht}</label>
          <input id={`${id}-organisation`} name="organisation" type="text" required minLength={2} maxLength={160} autoComplete="organization" className="sp-feld" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-email`} className={labelKlasse}>E-Mail{pflicht}</label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="sp-feld" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-telefon`} className={labelKlasse}>Telefon (für Rückfragen)</label>
          <input id={`${id}-telefon`} name="telefon" type="tel" autoComplete="tel" className="sp-feld" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-eventTyp`} className={labelKlasse}>Art der Veranstaltung{pflicht}</label>
          <select id={`${id}-eventTyp`} name="eventTyp" required defaultValue="" className="sp-feld">
            <option value="" disabled>Bitte wählen</option>
            {eventTypen.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className={`${labelKlasse} mb-2`}>Format{pflicht}</legend>
          <div className="flex flex-wrap gap-2">
            {eventFormate.map((f, i) => (
              <label key={f} className="flex min-h-[48px] cursor-pointer items-center gap-2 border-[1.5px] border-[color:var(--sp-stroke)] bg-[color:var(--sp-bg-raised)] px-4 font-card-body text-sm has-[:checked]:border-[color:var(--sp-lime)]">
                <input type="radio" name="format" value={f} required defaultChecked={i === 0} className="h-4 w-4 accent-[#b8ff35]" />
                {f}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-ort`} className={labelKlasse}>Ort</label>
          <input id={`${id}-ort`} name="ort" type="text" maxLength={120} placeholder="z. B. Frankfurt am Main" className="sp-feld placeholder:text-[color:var(--sp-muted)]/60" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-datum`} className={labelKlasse}>Datum (wenn schon bekannt)</label>
          <input id={`${id}-datum`} name="datum" type="date" className="sp-feld" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-publikum`} className={labelKlasse}>Erwartetes Publikum</label>
          <select id={`${id}-publikum`} name="publikum" defaultValue="" className="sp-feld">
            <option value="">Keine Angabe</option>
            {publikumGroessen.map((p) => <option key={p} value={p}>{p} Personen</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-thema`} className={labelKlasse}>Wunschthema</label>
          <select
            id={`${id}-thema`}
            name="thema"
            value={thema}
            onChange={(e) => setThema(e.target.value)}
            className="sp-feld"
          >
            <option value="">Keine Angabe</option>
            {talkTitel.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-nachricht`} className={labelKlasse}>Worum geht es bei eurer Veranstaltung?{pflicht}</label>
        <textarea id={`${id}-nachricht`} name="nachricht" rows={5} required minLength={10} maxLength={5000} className="sp-feld" />
      </div>

      {/* Honigtopf — nicht befüllen. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website (bitte frei lassen)</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start gap-3">
        <input id={`${id}-einwilligung`} name="einwilligung" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-[#b8ff35]" />
        <label htmlFor={`${id}-einwilligung`} className="font-card-body text-sm leading-relaxed text-[color:var(--sp-muted)]">
          Ich habe die{" "}
          <Link href="/datenschutz" className="text-[color:var(--sp-text)] underline decoration-[color:var(--sp-lime)] underline-offset-4">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage einverstanden.{pflicht}
        </label>
      </div>

      <div>
        <button type="submit" disabled={status.art === "sendet"} className="sp-btn-primary transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60">
          <span className="sp-btn-text">{status.art === "sendet" ? "Wird gesendet …" : "Keynote anfragen"}</span>
          <span className="sp-btn-zelle" aria-hidden="true">→</span>
        </button>
      </div>

      <p role="status" aria-live="polite" className="min-h-[1.5rem] font-card-body text-sm leading-relaxed">
        {status.art === "erfolg" && (
          <span className="text-[color:var(--sp-lime)]">
            Danke, deine Anfrage ist angekommen. Dennis meldet sich persönlich mit Rückfragen zum Briefing.
          </span>
        )}
        {status.art === "fehler" && <span role="alert" className="text-[#ff9b9b]">{status.text}</span>}
        {status.art === "mailto" && (
          <span role="alert" className="text-[color:var(--sp-text)]">
            Der Versand ist gerade nicht verfügbar. Schreib bitte direkt an{" "}
            <a href={`mailto:${anbieter.email}?subject=Speaker-Anfrage`} className="text-[color:var(--sp-text)] underline">
              {anbieter.email}
            </a>{" "}
            oder ruf an: <a href={`tel:${anbieter.telefonHref}`} className="text-[color:var(--sp-text)] underline">{anbieter.telefon}</a>.
          </span>
        )}
      </p>
    </form>
  );
}
