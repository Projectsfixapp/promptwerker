import Link from "next/link";
import FooterContactForm from "./FooterContactForm";
import { anbieter } from "@/lib/legal";
import { topics } from "@/lib/topics";
import { bottomCards } from "@/lib/bottomCards";

/* Seitenfuß mit vollem Footermenü und Kontaktformular.
   Läuft seit der Umstellung über das Root-Layout auf JEDER Seite — vorher
   hing er in MainView und war damit nur auf der Startseite zu sehen, was
   die Rechtslinks auf allen Unterseiten unerreichbar machte (§ 5 DDG
   verlangt leichte Erreichbarkeit von jeder Seite aus). */

const rechtliches = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/avv", label: "Auftragsverarbeitung" },
  { href: "/barrierefreiheit", label: "Barrierefreiheit" },
  { href: "/ki-transparenz", label: "KI-Transparenz" },
];

const unternehmen = [
  { href: "/", label: "Start" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/leistungen/workshop-roadmap", label: "Workshop: Roadmap" },
  { href: "/?kontakt=1", label: "Analysegespräch buchen" },
];

const linkKlasse =
  "rounded-sm font-card-body text-sm text-[color:var(--color-paper-ink)] hover:underline";

const spaltenTitelKlasse =
  "text-xs font-semibold uppercase tracking-wider text-[color:var(--color-magenta)]";

export default function Footer() {
  const year = new Date().getFullYear();
  const leistungen = [
    ...topics.filter((t) => t.enabled).map((t) => ({ href: `/leistungen/${t.id}`, label: t.title })),
    ...bottomCards
      .filter((c) => c.enabled && c.hasPage)
      .map((c) => ({ href: `/leistungen/${c.id}`, label: c.title })),
  ];

  return (
    <footer className="glass-panel-light relative mx-4 mb-6 overflow-hidden rounded-3xl px-6 py-12 sm:mx-8 sm:px-10">
      <h2 className="sr-only">Seitenfuß</h2>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-10 lg:max-w-2xl">
          <div className="max-w-sm">
            <span className="font-heading text-lg tracking-wide text-[color:var(--color-paper-ink)]">
              promptwerker
            </span>
            <p className="mt-3 font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)]">
              KI-Systeme für den Mittelstand — Voice-Agenten, Workflow-Automatisierung und
              Lead-Autopilot, die wirklich laufen.
            </p>
            <address className="mt-4 font-card-body text-sm not-italic leading-relaxed text-[color:var(--color-paper-body)]">
              {anbieter.firma}
              <br />
              {anbieter.strasse}, {anbieter.plz} {anbieter.ort}
              <br />
              <a href={`tel:${anbieter.telefonHref}`} className={linkKlasse}>
                {anbieter.telefon}
              </a>
              <br />
              <a href={`mailto:${anbieter.email}`} className={linkKlasse}>
                {anbieter.email}
              </a>
            </address>
          </div>

          <nav aria-label="Seitenfuß" className="flex flex-wrap gap-x-12 gap-y-8">
            <div className="flex flex-col gap-2.5">
              <h3 className={spaltenTitelKlasse}>Leistungen</h3>
              {leistungen.map((eintrag) => (
                <Link key={eintrag.href} href={eintrag.href} className={linkKlasse}>
                  {eintrag.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <h3 className={spaltenTitelKlasse}>Unternehmen</h3>
              {unternehmen.map((eintrag) => (
                <Link key={eintrag.href} href={eintrag.href} className={linkKlasse}>
                  {eintrag.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <h3 className={spaltenTitelKlasse}>Rechtliches</h3>
              {rechtliches.map((eintrag) => (
                <Link key={eintrag.href} href={eintrag.href} className={linkKlasse}>
                  {eintrag.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <FooterContactForm />
      </div>

      <div className="relative z-10 mx-auto mt-12 max-w-6xl border-t border-[color:var(--color-paper-ink)]/10 pt-6 font-card-body text-xs text-[color:var(--color-paper-body)]">
        © {year} {anbieter.firma} — promptwerker. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
