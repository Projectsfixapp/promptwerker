export const TIME_ZONE = "Europe/Berlin";
export const SLOT_MINUTES = 30;

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
const LOOKAHEAD_DAYS = 14;
const MIN_NOTICE_HOURS = 2;

export type Slot = { start: Date; end: Date };

// Standard "no external tz library" trick: compare how the same instant renders
// as a naive string in UTC vs. the target zone to recover the zone's offset —
// works for any IANA zone, including DST transitions, via the platform's own
// Intl/ICU data.
function getTimezoneOffsetMinutes(date: Date, timeZone: string): number {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const probe = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMin = getTimezoneOffsetMinutes(probe, timeZone);
  return new Date(probe.getTime() - offsetMin * 60000);
}

function getZonedDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: map.weekday,
  };
}

/** Candidate 30-min slots for the next LOOKAHEAD_DAYS business days, before checking calendar conflicts. */
export function generateCandidateSlots(now: Date): Slot[] {
  const slots: Slot[] = [];
  const earliestAllowed = new Date(now.getTime() + MIN_NOTICE_HOURS * 3600_000);

  for (let dayOffset = 0; dayOffset < LOOKAHEAD_DAYS; dayOffset++) {
    const probeInstant = new Date(now.getTime() + dayOffset * 86_400_000);
    const { year, month, day, weekday } = getZonedDateParts(probeInstant, TIME_ZONE);
    if (weekday === "Sat" || weekday === "Sun") continue;

    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
        const start = zonedWallTimeToUtc(year, month, day, hour, minute, TIME_ZONE);
        if (start < earliestAllowed) continue;
        const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
        slots.push({ start, end });
      }
    }
  }
  return slots;
}

export function filterAvailable(slots: Slot[], busy: Slot[]): Slot[] {
  return slots.filter((slot) => !busy.some((b) => slot.start < b.end && slot.end > b.start));
}
