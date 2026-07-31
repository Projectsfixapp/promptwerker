import { NextResponse } from "next/server";
import { createBookingEvent, getBusyIntervals } from "@/lib/googleCalendar";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { start, end, name, email, note } = (body ?? {}) as Record<string, unknown>;

  if (typeof start !== "string" || typeof end !== "string") {
    return NextResponse.json({ error: "Termin fehlt." }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Bitte gib deinen Namen an." }, { status: 400 });
  }
  const emailStr = typeof email === "string" ? email.trim() : "";
  if (!EMAIL_PATTERN.test(emailStr)) {
    return NextResponse.json({ error: "Die E-Mail-Adresse ist ungültig." }, { status: 400 });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate >= endDate) {
    return NextResponse.json({ error: "Der Termin ist ungültig." }, { status: 400 });
  }
  if (startDate.getTime() < Date.now()) {
    return NextResponse.json({ error: "Dieser Termin liegt in der Vergangenheit." }, { status: 409 });
  }

  try {
    // Re-check right before booking to close the gap between "slots loaded" and
    // "submit" — narrows, doesn't eliminate, the double-booking race.
    const stillBusy = await getBusyIntervals(startDate, endDate);
    const conflict = stillBusy.some((b) => startDate < b.end && endDate > b.start);
    if (conflict) {
      return NextResponse.json(
        { error: "Dieser Termin wurde gerade eben vergeben. Bitte einen anderen wählen." },
        { status: 409 }
      );
    }

    const result = await createBookingEvent({
      start: startDate,
      end: endDate,
      name: name.trim(),
      email: emailStr,
      note: typeof note === "string" ? note.trim().slice(0, 1000) : undefined,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
