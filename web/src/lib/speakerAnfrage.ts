/* Feste Auswahllisten der Speaker-Anfrage (/dennis-beichert).
   Eine Quelle für Formular UND Server: der Server nimmt nur Werte aus diesen
   Listen an, freie Eingaben in Auswahlfeldern werden verworfen. */

export const eventTypen = [
  "Konferenz / Kongress",
  "Firmenevent / Kick-off",
  "Verbands- oder Branchentagung",
  "Führungskräfte-Runde",
  "Messe / Fachforum",
  "Sonstiges",
] as const;

export const eventFormate = ["Vor Ort", "Online", "Hybrid"] as const;

export const publikumGroessen = ["bis 50", "50–150", "150–500", "über 500", "noch offen"] as const;

export type SpeakerFelder = {
  organisation: string;
  eventTyp: (typeof eventTypen)[number];
  format: (typeof eventFormate)[number];
  ort?: string;
  datum?: string;
  publikum?: (typeof publikumGroessen)[number];
  thema?: string;
};

const DATUM = /^\d{4}-\d{2}-\d{2}$/;

/** Muster UND echter Kalendertag (2026-02-30 fällt durch, wirft nie). */
function gueltigesDatum(wert: string): boolean {
  if (!DATUM.test(wert)) return false;
  const d = new Date(`${wert}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === wert;
}

function text(wert: unknown, max: number): string {
  return typeof wert === "string" ? wert.trim().slice(0, max) : "";
}

function ausListe<T extends readonly string[]>(liste: T, wert: unknown): T[number] | undefined {
  return typeof wert === "string" && (liste as readonly string[]).includes(wert)
    ? (wert as T[number])
    : undefined;
}

/** Prüft die Zusatzfelder. Liefert entweder die Felder oder eine Fehlermeldung. */
export function pruefeSpeakerFelder(
  daten: Record<string, unknown>,
  erlaubteThemen: readonly string[]
): { ok: true; felder: SpeakerFelder } | { ok: false; fehler: string } {
  const organisation = text(daten.organisation, 160);
  if (organisation.length < 2) {
    return { ok: false, fehler: "Bitte gib die Organisation oder Firma an." };
  }
  const eventTyp = ausListe(eventTypen, daten.eventTyp);
  if (!eventTyp) return { ok: false, fehler: "Bitte wähle die Art der Veranstaltung." };
  const format = ausListe(eventFormate, daten.format);
  if (!format) return { ok: false, fehler: "Bitte wähle vor Ort, online oder hybrid." };

  const datumRoh = text(daten.datum, 10);
  if (datumRoh && !gueltigesDatum(datumRoh)) {
    return { ok: false, fehler: "Das Datum ist ungültig." };
  }

  const themaRoh = text(daten.thema, 120);
  const thema = themaRoh && erlaubteThemen.includes(themaRoh) ? themaRoh : undefined;

  return {
    ok: true,
    felder: {
      organisation,
      eventTyp,
      format,
      ort: text(daten.ort, 120) || undefined,
      datum: datumRoh || undefined,
      publikum: ausListe(publikumGroessen, daten.publikum),
      thema,
    },
  };
}
