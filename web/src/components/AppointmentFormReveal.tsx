"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "motion/react";

type Slot = { start: string; end: string };
type LoadState = "loading" | "ready" | "unavailable";
type SubmitState = "idle" | "submitting" | "success" | "error";

const dayLabelFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  weekday: "long",
  day: "2-digit",
  month: "long",
});
const timeLabelFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  hour: "2-digit",
  minute: "2-digit",
});

function groupByDay(slots: Slot[]): { dayKey: string; slots: Slot[] }[] {
  const groups = new Map<string, Slot[]>();
  for (const slot of slots) {
    const dayKey = dayLabelFormatter.format(new Date(slot.start));
    if (!groups.has(dayKey)) groups.set(dayKey, []);
    groups.get(dayKey)!.push(slot);
  }
  return Array.from(groups.entries()).map(([dayKey, daySlots]) => ({
    dayKey,
    slots: daySlots,
  }));
}

export default function AppointmentFormReveal({ onClose }: { onClose: () => void }) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/booking/slots")
      .then((res) => res.json())
      .then((data: { slots?: Slot[]; error?: string }) => {
        if (cancelled) return;
        if (!data.slots || data.slots.length === 0) {
          setLoadState("unavailable");
          return;
        }
        setSlots(data.slots);
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dayGroups = useMemo(() => groupByDay(slots), [slots]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");
    setSubmitError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: selected.start,
          end: selected.end,
          name: formData.get("name"),
          email: formData.get("email"),
          note: formData.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Termin konnte nicht gebucht werden.");
        setSubmitState("error");
        if (res.status === 409) {
          // Slot was taken in the meantime — drop it and let the customer pick another.
          setSlots((prev) => prev.filter((s) => s.start !== selected.start));
          setSelected(null);
        }
        return;
      }
      setMeetLink(data.meetLink ?? null);
      setSubmitState("success");
    } catch {
      setSubmitError("Verbindung fehlgeschlagen. Bitte versuch es gleich noch einmal.");
      setSubmitState("error");
    }
  }

  return (
    <motion.div
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-6 backdrop-blur-sm"
    >
      <div className="glass-panel relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-5 top-5 text-muted transition-colors hover:text-ink"
        >
          ✕
        </button>

        {submitState === "success" ? (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl">Termin gebucht</h3>
            <p className="text-sm leading-relaxed text-body">
              Du bekommst gleich eine Kalendereinladung mit Google-Meet-Link per E-Mail.
            </p>
            {meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex w-fit rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
              >
                Meet-Link öffnen
              </a>
            )}
          </div>
        ) : (
          <>
            <h3 className="text-xl">Kennenlernen buchen (30 Min., per Google Meet)</h3>

            {loadState === "loading" && (
              <p className="mt-4 text-sm text-muted">Verfügbare Termine werden geladen …</p>
            )}

            {loadState === "unavailable" && (
              <p className="mt-4 text-sm leading-relaxed text-body">
                Die Terminbuchung ist gerade nicht erreichbar. Schreib uns stattdessen kurz eine
                Nachricht an{" "}
                <a className="hover:underline" href="mailto:kontakt@promptwerker.de">
                  kontakt@promptwerker.de
                </a>
                , wir melden uns mit Terminvorschlägen.
              </p>
            )}

            {loadState === "ready" && !selected && (
              <div className="mt-4 flex flex-col gap-4">
                {dayGroups.map((group) => (
                  <div key={group.dayKey}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {group.dayKey}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.slots.map((slot) => (
                        <button
                          key={slot.start}
                          type="button"
                          onClick={() => setSelected(slot)}
                          className="rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-sm text-ink transition-colors hover:border-accent hover:bg-accent/15"
                        >
                          {timeLabelFormatter.format(new Date(slot.start))}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selected && (
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="w-fit text-xs font-semibold text-accent hover:underline"
                >
                  ← anderen Termin wählen
                </button>
                <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm text-ink">
                  {dayLabelFormatter.format(new Date(selected.start))},{" "}
                  {timeLabelFormatter.format(new Date(selected.start))} Uhr
                </p>

                <input
                  required
                  name="name"
                  placeholder="Name"
                  className="rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                  className="rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Worum geht's? (optional)"
                  className="rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                />

                {submitState === "error" && submitError && (
                  <p className="text-sm text-red-400">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="mt-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink disabled:opacity-60"
                >
                  {submitState === "submitting" ? "Wird gebucht …" : "Termin verbindlich buchen"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
