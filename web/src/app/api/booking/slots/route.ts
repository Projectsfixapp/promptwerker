import { NextResponse } from "next/server";
import { generateCandidateSlots, filterAvailable, SLOT_MINUTES } from "@/lib/businessHours";
import { getBusyIntervals } from "@/lib/googleCalendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const candidates = generateCandidateSlots(new Date());
  if (candidates.length === 0) {
    return NextResponse.json({ slots: [], slotMinutes: SLOT_MINUTES });
  }

  try {
    const timeMin = candidates[0].start;
    const timeMax = candidates[candidates.length - 1].end;
    const busy = await getBusyIntervals(timeMin, timeMax);
    const available = filterAvailable(candidates, busy);
    return NextResponse.json({
      slots: available.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() })),
      slotMinutes: SLOT_MINUTES,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message, slots: [] }, { status: 503 });
  }
}
