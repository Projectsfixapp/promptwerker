"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function PortalLoginPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main
      id="inhalt"
      className="flex min-h-screen items-center justify-center bg-[color:var(--color-paper)] px-6 py-32 text-[color:var(--color-paper-ink)]"
    >
      <div className="glass-panel-light w-full max-w-md rounded-3xl p-8 sm:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-paper-body)] transition-colors hover:text-[color:var(--color-magenta)]"
        >
          ← Zur Startseite
        </Link>

        <span className="mt-8 block text-xs font-semibold uppercase tracking-wider text-[color:var(--color-magenta)]">
          Portal
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl">Fertige Flows &amp; Agenten</h1>
        <p className="mt-4 font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)]">
          Bald kannst du dich hier einloggen und direkt fertige Automatisierungen und
          KI-Agenten für dein Unternehmen kaufen und einrichten.
        </p>

        {submitted ? (
          <p className="mt-8 font-card-body text-sm text-[color:var(--color-paper-ink)]">
            Portal ist in Vorbereitung — wir melden uns, sobald du startklar bist.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              required
              type="email"
              name="email"
              placeholder="E-Mail"
              className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-[color:var(--color-paper-ink)] placeholder:text-[color:var(--color-paper-body)] focus:border-[color:var(--color-magenta)] focus:outline-none"
            />
            <input
              required
              type="password"
              name="password"
              placeholder="Passwort"
              className="rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-[color:var(--color-paper-ink)] placeholder:text-[color:var(--color-paper-body)] focus:border-[color:var(--color-magenta)] focus:outline-none"
            />
            <button
              type="submit"
              className="mt-1 rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ background: "var(--color-magenta)" }}
            >
              Einloggen
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
