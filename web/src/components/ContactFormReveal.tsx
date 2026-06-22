"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";

export default function ContactFormReveal({
  origin,
  onClose,
}: {
  origin: { x: number; y: number } | null;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const ox = origin?.x ?? window.innerWidth / 2;
  const oy = origin?.y ?? window.innerHeight / 2;
  const circle = (radius: string) => `circle(${radius} at ${ox}px ${oy}px)`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <motion.div
      initial={{ clipPath: circle("0%") }}
      animate={{ clipPath: circle("150%") }}
      exit={{ clipPath: circle("0%") }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-6 backdrop-blur-sm"
    >
      <div className="glass-panel relative w-full max-w-md rounded-2xl p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-5 top-5 text-muted transition-colors hover:text-ink"
        >
          ✕
        </button>

        {sent ? (
          <p className="text-base text-ink">Danke! Wir melden uns zeitnah bei Ihnen.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="text-xl">Kostenloses Analysegespräch</h3>
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
              placeholder="Worum geht's?"
              className="rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="mt-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
            >
              Anfrage senden
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
