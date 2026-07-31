import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns — promptwerker",
  description:
    "promptwerker baut KI-Systeme, die im Alltag von kleinen und mittelständischen Unternehmen wirklich laufen — keine Theorie, sondern fertige Systeme.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: {
    title: "Über uns — promptwerker",
    description:
      "Wer hinter promptwerker steht und nach welchen Grundsätzen KI-Systeme für den Mittelstand gebaut werden.",
    url: "https://promptwerker.de/ueber-uns",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns — promptwerker",
    description: "Wer hinter promptwerker steht und wie hier gearbeitet wird.",
  },
};

const principles = [
  {
    title: "Echte Integrationen statt Verkettungen",
    text: "Wir bauen direkte API-Anbindungen zwischen deinen Systemen — keine No-Code-Ketten, die beim nächsten Drittanbieter-Update reißen.",
  },
  {
    title: "An deinem Betrieb gebaut",
    text: "Jeder Workflow, jeder Agent wird an einem echten Fall aus deinem Alltag entwickelt und getestet, bevor er live geht — keine Konzeptfolien.",
  },
  {
    title: "DSGVO- und AI-Act-bewusst",
    text: "Datenschutz und die Anforderungen des EU AI Act denken wir von Anfang an mit, nicht als nachträgliche Compliance-Übung.",
  },
  {
    title: "Transparent bleiben",
    text: "Klarer Fahrplan statt Buzzword-Bingo — du weißt jederzeit, was gebaut wird, warum, und was es bringt.",
  },
];

export default function UeberUnsPage() {
  return (
    <main id="inhalt" className="relative">
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-36 text-center sm:pt-44">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Über uns
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Wer hinter promptwerker steht</h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-body">
          promptwerker baut KI-Systeme, die im Alltag wirklich laufen — für Unternehmen, die keine
          Zeit für Pilotprojekte ohne Ergebnis haben.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Warum promptwerker
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Weniger Theorie, mehr fertiges System</h2>
        <div className="mt-8 flex flex-col gap-5">
          <p className="font-card-body text-base leading-relaxed text-body">
            Viele KI-Projekte im Mittelstand bleiben Pilot: eine Demo, eine Präsentation, dann
            Stille. promptwerker ist entstanden, weil dieser Weg zu oft in der Schublade endet.
          </p>
          <p className="font-card-body text-base leading-relaxed text-body">
            Statt Strategiefolien liefern wir Systeme, die am Telefon klingeln, Formulare
            verarbeiten und Leads sortieren — angebunden an die Tools, die du bereits jeden Tag
            nutzt.
          </p>
          <p className="font-card-body text-base leading-relaxed text-body">
            Voice-Agenten, Workflow-Automatisierung, Lead-Scoring, CRM-Anbindung: jedes System
            wird an einem echten Fall aus deinem Betrieb gebaut, getestet und erst dann
            übergeben.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Arbeitsweise
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Wie wir arbeiten</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="glass-panel rounded-2xl p-6">
              <h3 className="text-base">{p.title}</h3>
              <p className="mt-2 font-card-body text-sm leading-relaxed text-body">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Ansprechpartner
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Dein direkter Kontakt</h2>
        <div className="glass-panel mt-8 flex flex-col items-center gap-4 rounded-2xl p-8 text-center sm:flex-row sm:text-left">
          <div className="font-heading flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-accent-ink">
            D
          </div>
          <div>
            <h3 className="text-lg">Dennis</h3>
            <p className="text-sm text-muted">Gründer, promptwerker</p>
            <p className="mt-2 font-card-body text-sm leading-relaxed text-body">
              Du sprichst direkt mit der Person, die dein Projekt auch umsetzt — kein Wechsel
              durch mehrere Ansprechpartner.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl">Lust auf ein System, das wirklich läuft?</h2>
          <p className="mx-auto mt-4 max-w-xl font-card-body text-sm leading-relaxed text-body sm:text-base">
            Im kostenlosen Analysegespräch schauen wir uns deinen Fall an und sagen dir ehrlich,
            was sich lohnt.
          </p>
          <Link
            href="/?kontakt=1"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            Kostenloses Analysegespräch buchen
          </Link>
        </div>
      </section>
    </main>
  );
}
