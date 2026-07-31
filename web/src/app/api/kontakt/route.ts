import { NextResponse } from "next/server";
import { SmtpNichtKonfiguriertError, sendeKontaktAnfrage } from "@/lib/mailer";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Einfache Mengenbegrenzung je IP im Arbeitsspeicher.
   Bewusst kein Redis: die Seite läuft auf einer Instanz, und der einzige
   Zweck ist, Formular-Spam auszubremsen. Bei mehreren Instanzen greift die
   Grenze je Instanz — für diesen Zweck ausreichend.
   Die Datenschutzerklärung (Ziffer 5) beschreibt genau dieses Verhalten:
   IP nur flüchtig, maximal eine Stunde. */
const FENSTER_MS = 60 * 60 * 1000;
const MAX_PRO_FENSTER = 5;
const zaehler = new Map<string, { anzahl: number; bis: number }>();

function rateLimitUeberschritten(ip: string): boolean {
  const jetzt = Date.now();

  // Abgelaufene Einträge aufräumen, damit die Map nicht unbegrenzt wächst.
  for (const [key, wert] of zaehler) {
    if (wert.bis <= jetzt) zaehler.delete(key);
  }

  const eintrag = zaehler.get(ip);
  if (!eintrag) {
    zaehler.set(ip, { anzahl: 1, bis: jetzt + FENSTER_MS });
    return false;
  }
  eintrag.anzahl += 1;
  return eintrag.anzahl > MAX_PRO_FENSTER;
}

function ermittleIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unbekannt";
}

function text(wert: unknown, maxLaenge: number): string {
  return typeof wert === "string" ? wert.trim().slice(0, maxLaenge) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const daten = (body ?? {}) as Record<string, unknown>;

  // Honigtopf: für Menschen unsichtbares Feld. Ausgefüllt = Bot.
  // Antwort bewusst 200, damit der Bot keinen Fehler zum Nachjustieren bekommt.
  if (text(daten.website, 200).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = text(daten.name, 120);
  const email = text(daten.email, 200);
  const unternehmen = text(daten.unternehmen, 160);
  const telefon = text(daten.telefon, 60);
  const nachricht = text(daten.nachricht, 5000);
  const einwilligung = daten.einwilligung === true;

  if (name.length < 2) {
    return NextResponse.json({ error: "Bitte gib deinen Namen an." }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Die E-Mail-Adresse ist ungültig." }, { status: 400 });
  }
  if (nachricht.length < 10) {
    return NextResponse.json(
      { error: "Bitte beschreibe dein Anliegen in mindestens 10 Zeichen." },
      { status: 400 }
    );
  }
  if (!einwilligung) {
    return NextResponse.json(
      { error: "Bitte bestätige die Kenntnisnahme der Datenschutzerklärung." },
      { status: 400 }
    );
  }

  if (rateLimitUeberschritten(ermittleIp(request))) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  try {
    await sendeKontaktAnfrage({
      name,
      email,
      unternehmen: unternehmen || undefined,
      telefon: telefon || undefined,
      nachricht,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SmtpNichtKonfiguriertError) {
      // Kein 500: das Formular soll dem Besucher den mailto-Weg anbieten,
      // statt einen technischen Fehler anzuzeigen.
      return NextResponse.json({ error: "SMTP_NICHT_KONFIGURIERT" }, { status: 503 });
    }
    console.error("[kontakt] Versand fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Die Nachricht konnte nicht gesendet werden. Bitte schreib uns direkt per E-Mail." },
      { status: 502 }
    );
  }
}
