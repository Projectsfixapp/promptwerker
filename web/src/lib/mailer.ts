import nodemailer, { type Transporter } from "nodemailer";
import { anbieter } from "./legal";
import type { SpeakerFelder } from "./speakerAnfrage";

/* SMTP-Versand für das Kontaktformular im Seitenfuß.
   Bewusst ohne Datenbank: die Anfrage geht direkt ins Postfach
   kontakt@promptwerker.de. Das hält die Datenschutzerklärung kurz (keine
   Speicherung auf unserer Seite) und spart eine Datenbank, die es hier
   sonst nirgends braucht.

   Fehlen die SMTP-Zugangsdaten, wirft dieses Modul einen klar benannten
   Fehler — die Route fängt ihn ab und liefert dem Formular einen
   mailto-Fallback, statt die Anfrage stillschweigend zu verschlucken.
   Gleiches Muster wie beim Kalender (googleCalendar.ts). */

export class SmtpNichtKonfiguriertError extends Error {
  constructor() {
    super("SMTP ist nicht konfiguriert (SMTP_HOST / SMTP_USER / SMTP_PASS fehlen).");
    this.name = "SmtpNichtKonfiguriertError";
  }
}

export function istSmtpKonfiguriert(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!istSmtpKonfiguriert()) throw new SmtpNichtKonfiguriertError();
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT ?? 587);

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 = implizites TLS, 587 = STARTTLS. Ohne diese Unterscheidung
    // schlägt der Handshake bei united-domains auf 465 fehl.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });

  return transporter;
}

export type KontaktAnfrage = {
  name: string;
  email: string;
  unternehmen?: string;
  telefon?: string;
  nachricht: string;
  /** Gesetzt bei Speaker-/Keynote-Anfragen von /dennis-beichert. */
  speaker?: SpeakerFelder;
};

function escapeHtml(wert: string): string {
  return wert
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Header-Injection: Werte, die in Betreff oder Adressfelder wandern, dürfen
   keine Zeilenumbrüche enthalten. */
function einzeilig(wert: string): string {
  return wert.replace(/[\r\n]+/g, " ").trim();
}

export async function sendeKontaktAnfrage(anfrage: KontaktAnfrage): Promise<void> {
  const mailer = getTransporter();

  const absender = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? anbieter.email;
  const empfaenger = process.env.KONTAKT_EMPFAENGER ?? anbieter.email;

  const name = einzeilig(anfrage.name);
  const sp = anfrage.speaker;
  const speakerZeilen: [string, string][] = sp
    ? ([
        ["Anfrage-Typ", "Speaker / Keynote"],
        ["Organisation", sp.organisation],
        ["Veranstaltung", sp.eventTyp],
        ["Format", sp.format],
        ["Ort", sp.ort ?? ""],
        ["Datum", sp.datum ?? ""],
        ["Publikum", sp.publikum ?? ""],
        ["Wunschthema", sp.thema ?? ""],
      ].filter(([, wert]) => wert) as [string, string][]).map(([k, w]) => [k, einzeilig(w)])
    : [];
  const zeilen = [
    ...speakerZeilen.map(([k, w]) => `${k}: ${w}`),
    `Name: ${name}`,
    `E-Mail: ${einzeilig(anfrage.email)}`,
    anfrage.unternehmen ? `Unternehmen: ${einzeilig(anfrage.unternehmen)}` : null,
    anfrage.telefon ? `Telefon: ${einzeilig(anfrage.telefon)}` : null,
    "",
    anfrage.nachricht,
  ].filter((zeile): zeile is string => zeile !== null);

  await mailer.sendMail({
    from: `"promptwerker Website" <${absender}>`,
    to: empfaenger,
    // Antworten landen direkt beim Absender statt im eigenen Postfach.
    // Als Objekt: nodemailer quotet den Namen selbst, ein Komma im Namen
    // erzeugt so keine zweite Adresse.
    replyTo: { name, address: einzeilig(anfrage.email) },
    subject: sp
      ? `Speaker-/Keynote-Anfrage über promptwerker.de — ${name} (${einzeilig(sp.organisation)})`
      : `Kontaktanfrage über promptwerker.de — ${name}`,
    text: zeilen.join("\n"),
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#15121b">
  <p style="margin:0 0 16px"><strong>${sp ? "Neue Speaker-/Keynote-Anfrage über promptwerker.de/dennis-beichert" : "Neue Kontaktanfrage über promptwerker.de"}</strong></p>
  <table style="border-collapse:collapse">
    ${speakerZeilen.map(([k, w]) => `<tr><td style="padding:2px 12px 2px 0;color:#55506a">${escapeHtml(k)}</td><td style="padding:2px 0">${escapeHtml(w)}</td></tr>`).join("")}
    <tr><td style="padding:2px 12px 2px 0;color:#55506a">Name</td><td style="padding:2px 0">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#55506a">E-Mail</td><td style="padding:2px 0">${escapeHtml(anfrage.email)}</td></tr>
    ${anfrage.unternehmen ? `<tr><td style="padding:2px 12px 2px 0;color:#55506a">Unternehmen</td><td style="padding:2px 0">${escapeHtml(anfrage.unternehmen)}</td></tr>` : ""}
    ${anfrage.telefon ? `<tr><td style="padding:2px 12px 2px 0;color:#55506a">Telefon</td><td style="padding:2px 0">${escapeHtml(anfrage.telefon)}</td></tr>` : ""}
  </table>
  <p style="margin:16px 0 0;white-space:pre-wrap">${escapeHtml(anfrage.nachricht)}</p>
</div>`,
  });
}
