import Link from "next/link";
import { rechtsstand } from "@/lib/legal";

/* Gemeinsames Gerüst aller Rechtstexte (Impressum, Datenschutz, AGB, AVV,
   Barrierefreiheit, KI-Transparenz). Zweck: ein Ort für Typografie, Abstände
   und Farben, damit die sechs Seiten nicht auseinanderdriften.

   Farblich bewusst der promptwerker-Look (dunkler Grund, Cyan-Akzent,
   Glas-Panel) statt der beigen Frau-Schmidt-Optik, aus der die Texte
   stammen. */

export function LegalSection({
  titel,
  id,
  children,
}: {
  titel: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-28 first:mt-0">
      <h2 className="text-xl text-ink sm:text-2xl">{titel}</h2>
      <div className="mt-4 flex flex-col gap-4 font-card-body text-base leading-relaxed text-body">
        {children}
      </div>
    </section>
  );
}

export function LegalSubSection({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="text-base font-semibold text-ink">{titel}</h3>
      <div className="mt-2 flex flex-col gap-3 font-card-body text-base leading-relaxed text-body">
        {children}
      </div>
    </section>
  );
}

/** Hervorgehobener Einleitungshinweis über einem Textteil. */
export function LegalNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-accent/25 bg-accent/5 px-5 py-4 font-card-body text-sm leading-relaxed text-body">
      {children}
    </p>
  );
}

export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const extern = href.startsWith("http") || href.startsWith("mailto:");
  const className =
    "rounded-sm text-accent underline underline-offset-2 transition-colors hover:text-ink";

  if (extern) {
    return (
      <a
        href={href}
        className={className}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function LegalPage({
  eyebrow = "Rechtliches",
  titel,
  intro,
  stand = rechtsstand,
  children,
}: {
  eyebrow?: string;
  titel: string;
  intro?: React.ReactNode;
  /** Abweichendes Fassungsdatum; null blendet die Zeile aus. */
  stand?: string | null;
  children: React.ReactNode;
}) {
  return (
    <main id="inhalt" className="relative">
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:pt-44">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-sm text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-accent"
        >
          <span aria-hidden="true">←</span> Zur Startseite
        </Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{titel}</h1>
        {intro ? (
          <div className="mt-5 font-card-body text-lg leading-relaxed text-body">{intro}</div>
        ) : null}

        <div className="glass-panel mt-12 rounded-3xl p-7 sm:p-10">{children}</div>

        {stand ? (
          <p className="mt-6 text-sm text-muted">Fassung: {stand}</p>
        ) : null}
      </section>
    </main>
  );
}
