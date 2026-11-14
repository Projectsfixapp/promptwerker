import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archivo_Black } from "next/font/google";
import TypewriterHeading from "@/components/TypewriterHeading";
import SpeakerAnfrage from "@/components/speaker/SpeakerAnfrage";
import { Auftritt, BewegungsRahmen, KreisReveal, SeitenEintritt } from "@/components/speaker/Bewegung";
import { anbieter, baseUrl } from "@/lib/legal";
import { buch } from "@/lib/buch";
import { ablauf, buehnenBild, logbuch, projekte, publikumsnutzen, speakerFaq, speakerPfad, talks, workshopBild } from "@/lib/speaker";

/* Speaker-Seite Dennis Beichert — eigene Bühne innerhalb von promptwerker.de.
   Navigation, Logo, Footer und Rechtslinks kommen unverändert aus dem
   Root-Layout. Farbwelt: .sp-buehne in globals.css. Bewegung: lib/motion.ts.
   Inhalte: lib/speaker.ts (nur belegte Aussagen). */

// Display-Schrift nur auf dieser Route; next/font hostet sie selbst (SIL OFL 1.1).
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const titel = "Dennis Beichert — KI-Speaker aus der Praxis";
const beschreibung =
  "Keynotes zu KI-Agenten, KI im Mittelstand und E-Commerce mit KI: Dennis Beichert, Unternehmer und Gründer von promptwerker, zeigt auf der Bühne, was in echten Projekten funktioniert und was nicht.";
const url = `${baseUrl}${speakerPfad}`;

export const metadata: Metadata = {
  title: { absolute: titel },
  description: beschreibung,
  alternates: { canonical: speakerPfad },
  openGraph: {
    type: "profile",
    url,
    title: titel,
    description: beschreibung,
    images: [{ url: buehnenBild, width: 1536, height: 1024, alt: "Dennis Beichert auf der Bühne vor einer promptwerker-Präsentation" }],
  },
  twitter: { card: "summary_large_image", title: titel, description: beschreibung },
};

const strukturierteDaten = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${url}#seite`,
      url,
      name: titel,
      inLanguage: "de-DE",
      isPartOf: { "@id": `${baseUrl}/#website` },
      mainEntity: { "@id": `${url}#person` },
    },
    {
      "@type": "Person",
      "@id": `${url}#person`,
      name: anbieter.person,
      url,
      image: `${baseUrl}${buehnenBild}`,
      jobTitle: "Gründer von promptwerker, KI-Speaker",
      worksFor: { "@id": `${baseUrl}/#organisation` },
      knowsAbout: ["KI-Agenten", "Prozessautomatisierung", "E-Commerce", "Retrieval Augmented Generation", "Wissensgraphen", "KI-Telefonassistenz", "Datenschutz bei KI"],
    },
    {
      "@type": "Book",
      "@id": `${url}#buch`,
      name: buch.titel,
      alternativeHeadline: buch.untertitel,
      isbn: buch.isbn.replace(/-/g, ""),
      bookFormat: "https://schema.org/Paperback",
      numberOfPages: buch.seiten,
      inLanguage: "de-DE",
      image: `${baseUrl}${buch.cover}`,
      author: { "@id": `${url}#person` },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: speakerFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Dennis Beichert als Speaker", item: url },
      ],
    },
  ],
};

const statusFarbe: Record<string, string> = {
  Live: "border-[color:var(--sp-lime)] text-[color:var(--sp-lime)]",
  "Im täglichen Einsatz": "border-[color:var(--sp-blue)] text-[color:var(--sp-text)]",
  Prototyp: "border-[color:var(--sp-stroke)] text-[color:var(--sp-muted)]",
};

const unterNav = [
  { href: "#praxis", label: "Praxis" },
  { href: "#keynotes", label: "Keynotes" },
  { href: "#ueber-mich", label: "Über mich" },
  { href: "#buch", label: "Buch" },
  { href: "#anfrage", label: "Anfrage" },
];

function Abschnittskopf({ nummer, label, id, children }: { nummer: string; label: string; id: string; children: React.ReactNode }) {
  return (
    <Auftritt className="grid gap-4 lg:grid-cols-12">
      <p className="sp-label text-[color:var(--sp-lime)] lg:col-span-3 lg:pt-3">
        [{nummer}] {label}
      </p>
      <h2 id={id} className="sp-display text-4xl sm:text-6xl lg:col-span-9">
        {children}
      </h2>
    </Auftritt>
  );
}

export default function DennisBeichertPage() {
  const [signatur, ...weitereTalks] = talks;

  return (
    <BewegungsRahmen>
      <main id="inhalt" className={`sp-buehne relative ${archivoBlack.variable}`}>
        <script type="application/ld+json">{JSON.stringify(strukturierteDaten)}</script>
        {/* Ohne JavaScript bleiben die Startzustände der Animationen stehen
            (Deckkraft 0, Kreis zu). Dann alles sofort zeigen. */}
        <noscript>
          <style>{".sp-buehne [style*='opacity'],.sp-buehne [style*='clip-path']{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
        </noscript>

        {/* ===== Hero =====
            Bewusst ohne Eintrittsanimation, wie der Hero der Startseite: Text und
            Bild sind sofort da (LCP). Bewegung beginnt ab dem ersten Scroll. */}
        <section aria-labelledby="hero-titel" className="mx-auto max-w-7xl px-4 pb-16 pt-40 sm:px-8 sm:pt-44 lg:pb-24">
          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div>
                <p className="sp-label text-[color:var(--sp-muted)]">
                  Dennis Beichert <span className="text-[color:var(--sp-ziffer)]">/</span> Keynote Speaker{" "}
                  <span className="text-[color:var(--sp-ziffer)]">/</span> KI-Experte aus der Praxis
                </p>
              </div>
              <div>
                <h1 id="hero-titel" className="sp-display mt-6 text-[clamp(3rem,10vw,6rem)]">
                  Weniger bla bla.
                  <span className="block text-[color:var(--sp-lime)]">Mehr machen.</span>
                </h1>
              </div>
              <div>
                <p className="mt-6 border-l-[5px] border-[color:var(--sp-blue)] pl-4 font-heading text-sm uppercase tracking-[0.08em] text-[color:var(--sp-text)] sm:text-base">
                  Heavy User. Early Adopter. Crazy Vision Guy.
                </p>
              </div>
              <div>
                <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-[color:var(--sp-muted)]">
                  Ich probiere KI nicht nur aus. Ich gehe rein, teste ihre Grenzen und mache aus Ideen echte
                  Anwendungen. Als Unternehmer arbeite ich jeden Tag mit einem Team aus KI-Agenten, und auf der
                  Bühne zeige ich, was davon funktioniert, was scheitert und was daraus für euch möglich wird.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#anfrage" className="sp-btn-primary transition-transform hover:scale-[1.03]">
                  <span className="sp-btn-text">Keynote anfragen</span>
                  <span className="sp-btn-zelle" aria-hidden="true">→</span>
                </a>
                <a href="#keynotes" className="sp-btn-secondary hover:scale-[1.03]">
                  Vorträge ansehen
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="sp-rahmen">
                <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--sp-bg-raised)]">
                  <Image
                    src={buehnenBild}
                    alt="Dennis Beichert spricht auf einer Bühne, hinter ihm die Präsentation „KI in Unternehmen“ mit promptwerker-Logo, im Vordergrund das Publikum"
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-[52%_50%]"
                  />
                </div>
                <figcaption className="sp-label mt-4 text-[color:var(--sp-muted)]">
                  [Bühne] KI in Unternehmen — Vortrag für promptwerker
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ===== Unternavigation der Speaker-Bühne ===== */}
        <nav aria-label="Speaker-Seite" className="sp-rule border-b border-[color:var(--sp-stroke)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-1 px-4 py-3 sm:px-8">
            <span className="sp-display text-base text-[color:var(--sp-text)]">Dennis Beichert</span>
            <ul className="flex flex-wrap gap-x-6">
              {unterNav.map((e) => (
                <li key={e.href}>
                  <a href={e.href} className="inline-flex min-h-[44px] items-center font-card-body text-sm font-semibold uppercase tracking-[0.06em] text-[color:var(--sp-muted)] transition-colors hover:text-[color:var(--sp-lime)]">
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
            <span className="font-card-body text-xs text-[color:var(--sp-muted)] sm:ml-auto">
              Gründer von{" "}
              <Link href="/" className="inline-flex min-h-[44px] items-center text-[color:var(--sp-text)] underline decoration-[color:var(--sp-blue)] underline-offset-4">promptwerker</Link>
            </span>
          </div>
        </nav>

        {/* ===== [01] Praxis ===== */}
        <section id="praxis" aria-labelledby="praxis-titel" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8 lg:py-32">
          <Abschnittskopf nummer="01" label="Praxis" id="praxis-titel">
            Nicht nur geredet.
            <span className="block text-[color:var(--sp-blue)]">Ausprobiert. Umgesetzt.</span>
          </Abschnittskopf>

          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <Auftritt className="lg:col-span-5">
              <figure className="sp-rahmen lg:sticky lg:top-28">
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--sp-bg-raised)]">
                  <Image
                    src={workshopBild}
                    alt="Dennis Beichert steht im Mittelgang eines Seminarraums und spricht mit den Teilnehmenden, vorn die Projektion „promptwerker — KI in Unternehmen“"
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 font-card-body text-sm leading-relaxed text-[color:var(--sp-muted)]">
                  Mitten im Raum statt hinter dem Pult: Workshop „KI in Unternehmen“.
                </figcaption>
              </figure>
            </Auftritt>

            <ol className="flex flex-col lg:col-span-7">
              {projekte.map((p, i) => (
                <li key={p.id} className="sp-rule py-10 first:border-t-0 first:pt-0">
                  <SeitenEintritt seite={i % 2 === 0 ? "rechts" : "links"}>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="sp-display text-2xl sm:text-3xl">
                        <span className="mr-3 font-heading text-base text-[color:var(--sp-ziffer)]">{String(i + 1).padStart(2, "0")}</span>
                        {p.href ? (
                          <a href={p.href} className="underline decoration-[color:var(--sp-stroke)] decoration-2 underline-offset-8 hover:decoration-[color:var(--sp-lime)]">
                            {p.name}
                          </a>
                        ) : (
                          p.name
                        )}
                      </h3>
                      <span className={`sp-label border px-2.5 py-1 ${statusFarbe[p.status]}`}>Status: {p.status}</span>
                    </div>
                    <p className="mt-4 font-card-body text-base leading-relaxed text-[color:var(--sp-text)]">{p.rolle}</p>
                    <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                      {[
                        ["Problem", p.problem],
                        ["Versuch", p.versuch],
                        ["Erkenntnis", p.erkenntnis],
                        ["Für dein Publikum", p.fuersPublikum],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="sp-label text-[color:var(--sp-lime)]">{k}</dt>
                          <dd className="mt-2 font-card-body text-sm leading-relaxed text-[color:var(--sp-muted)]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </SeitenEintritt>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== [02] Keynotes ===== */}
        <section id="keynotes" aria-labelledby="keynotes-titel" className="scroll-mt-24 bg-[color:var(--sp-bg-raised)] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Abschnittskopf nummer="02" label="Keynotes" id="keynotes-titel">
              Fünf Vorträge.
              <span className="block">Kein Folien-Karaoke.</span>
            </Abschnittskopf>
            <Auftritt>
              <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-[color:var(--sp-muted)] lg:ml-[25%]">
                Jeder Vortrag wird im Briefing auf Branche und Publikum zugeschnitten. Die Titel sind
                Arbeitstitel, die Beispiele kommen aus laufenden Projekten.
              </p>
            </Auftritt>

            {/* Signatur-Keynote als großes Split-Panel */}
            <SeitenEintritt seite="links" anheben className="mt-16">
              <article aria-labelledby={`talk-${signatur.id}`} className="grid border-[1.5px] border-[color:var(--sp-lime)] bg-[color:var(--sp-bg)] transition-[box-shadow] duration-300 hover:shadow-[0_0_55px_8px_rgba(184,255,53,0.16)] lg:grid-cols-12">
                <div className="border-b-[1.5px] border-[color:var(--sp-lime)] p-6 sm:p-10 lg:col-span-7 lg:border-b-0 lg:border-r-[1.5px]">
                  <p className="sp-label text-[color:var(--sp-lime)]">Signatur-Keynote</p>
                  <h3 id={`talk-${signatur.id}`} className="sp-display mt-4 text-3xl sm:text-5xl">{signatur.titel}</h3>
                  <p className="mt-5 font-body text-lg leading-relaxed text-[color:var(--sp-text)]">{signatur.hook}</p>
                  <p className="mt-6 font-card-body text-sm text-[color:var(--sp-muted)]"><span className="sp-label text-[color:var(--sp-text)]">Für wen:</span> {signatur.fuerWen}</p>
                  <p className="mt-2 font-card-body text-sm text-[color:var(--sp-muted)]"><span className="sp-label text-[color:var(--sp-text)]">Anlass:</span> {signatur.anlass}</p>
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:col-span-5">
                  <div>
                    <p className="sp-label text-[color:var(--sp-muted)]">Das nimmt dein Publikum mit</p>
                    <ol className="mt-4 flex flex-col gap-4">
                      {signatur.takeaways.map((t, i) => (
                        <li key={t} className="flex gap-4 font-card-body text-sm leading-relaxed text-[color:var(--sp-text)]">
                          <span className="font-heading text-[color:var(--sp-lime)]">0{i + 1}</span>
                          {t}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-6 font-card-body text-xs uppercase tracking-[0.06em] text-[color:var(--sp-muted)]">{signatur.formate}</p>
                  </div>
                  <a href="#anfrage" data-thema={signatur.titel} className="sp-link self-start">
                    Diese Keynote anfragen <span className="sp-pfeil" aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </SeitenEintritt>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {weitereTalks.map((t, i) => (
                <SeitenEintritt key={t.id} seite={i % 2 === 0 ? "links" : "rechts"} anheben>
                  <article aria-labelledby={`talk-${t.id}`} className="flex h-full flex-col border-[1.5px] border-[color:var(--sp-stroke)] bg-[color:var(--sp-bg)] p-6 transition-[box-shadow,border-color] duration-300 hover:border-[color:var(--sp-blue)] hover:shadow-[0_0_55px_8px_rgba(22,141,255,0.18)] sm:p-8">
                    <p className="sp-label text-[color:var(--sp-blue-text)]">[{String(i + 2).padStart(2, "0")}]</p>
                    <h3 id={`talk-${t.id}`} className="sp-display mt-3 text-2xl sm:text-3xl">{t.titel}</h3>
                    <p className="mt-4 font-body text-base leading-relaxed text-[color:var(--sp-text)]">{t.hook}</p>
                    <p className="mt-5 font-card-body text-sm text-[color:var(--sp-muted)]"><span className="sp-label text-[color:var(--sp-text)]">Für wen:</span> {t.fuerWen}</p>
                    <ul className="mt-5 flex flex-col gap-2">
                      {t.takeaways.map((k) => (
                        <li key={k} className="flex gap-3 font-card-body text-sm leading-relaxed text-[color:var(--sp-muted)]">
                          <span aria-hidden="true" className="text-[color:var(--sp-lime)]">→</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                    {t.demo && (
                      <p className="mt-5 border-l-[3px] border-[color:var(--sp-lime)] pl-3 font-card-body text-sm text-[color:var(--sp-text)]">
                        <span className="sp-label">Live-Demo:</span> {t.demo}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                      <span className="font-card-body text-xs uppercase tracking-[0.06em] text-[color:var(--sp-muted)]">{t.formate}</span>
                      <a href="#anfrage" data-thema={t.titel} className="sp-link">
                        Anfragen <span className="sp-pfeil" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </article>
                </SeitenEintritt>
              ))}
            </div>

            <Auftritt>
              <p className="mt-12 font-card-body text-sm text-[color:var(--sp-muted)]">
                Dein Team soll KI-Werkzeuge praktisch lernen statt einen Vortrag hören?{" "}
                <Link href="/leistungen/schulungen-fachvortraege" className="sp-link normal-case">
                  Zu den Team-Schulungen <span className="sp-pfeil" aria-hidden="true">→</span>
                </Link>
              </p>
            </Auftritt>
          </div>
        </section>

        {/* ===== [03] Geschichten aus dem Kaninchenbau ===== */}
        <section aria-labelledby="kaninchenbau-titel" className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-32">
          <div className="grid gap-4 lg:grid-cols-12">
            <Auftritt className="lg:col-span-3 lg:pt-3">
              <p className="sp-label text-[color:var(--sp-lime)]">[03] Logbuch</p>
            </Auftritt>
            <div className="lg:col-span-9">
              <TypewriterHeading
                id="kaninchenbau-titel"
                text="Geschichten aus dem Kaninchenbau"
                className="sp-display text-4xl sm:text-6xl"
              />
              <Auftritt>
                <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-[color:var(--sp-muted)]">
                  Drei echte Momente aus dem Bau eigener KI-Systeme. Keiner davon steht in einer
                  Hochglanz-Präsentation, alle stecken in den Vorträgen.
                </p>
              </Auftritt>
            </div>
          </div>

          <div className="mt-16 flex flex-col">
            {logbuch.map((eintrag, i) => (
              <SeitenEintritt key={eintrag.titel} seite={i % 2 === 0 ? "links" : "rechts"}>
                <article className="sp-rule grid gap-6 py-10 lg:grid-cols-12">
                  <p className="font-heading text-5xl text-[color:var(--sp-ziffer)] lg:col-span-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="sp-display text-2xl leading-[1.05] sm:text-3xl lg:col-span-4">{eintrag.titel}</h3>
                  <div className="lg:col-span-6">
                    <p className="font-card-body text-base leading-relaxed text-[color:var(--sp-text)]">{eintrag.was}</p>
                    <p className="mt-4 border-l-[3px] border-[color:var(--sp-lime)] pl-4 font-card-body text-sm leading-relaxed text-[color:var(--sp-muted)]">
                      {eintrag.lehre}
                    </p>
                  </div>
                </article>
              </SeitenEintritt>
            ))}
          </div>
        </section>

        {/* ===== [04] Publikumsnutzen ===== */}
        <section aria-labelledby="nutzen-titel" className="border-y border-[color:var(--sp-stroke)] bg-[color:var(--sp-bg-soft)] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Abschnittskopf nummer="04" label="Nach dem Vortrag" id="nutzen-titel">
              Was danach anders ist.
            </Abschnittskopf>
            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {publikumsnutzen.map((n, i) => (
                <li key={n.titel}>
                  <Auftritt>
                    <p className="font-heading text-sm text-[color:var(--sp-lime)]">0{i + 1}</p>
                    <h3 className="sp-display mt-3 text-2xl">{n.titel}</h3>
                    <p className="mt-3 font-card-body text-base leading-relaxed text-[color:var(--sp-muted)]">{n.text}</p>
                  </Auftritt>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== [05] Über mich ===== */}
        <section id="ueber-mich" aria-labelledby="ueber-titel" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8 lg:py-32">
          <Abschnittskopf nummer="05" label="Über mich" id="ueber-titel">
            Unternehmer.
            <span className="block text-[color:var(--sp-lime)]">Kein Informatiker.</span>
          </Abschnittskopf>
          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <Auftritt className="flex flex-col gap-5 lg:col-span-7 lg:col-start-4">
              <p className="font-body text-xl leading-relaxed text-[color:var(--sp-text)]">
                Ich habe kein Informatikstudium und bin kein klassischer Softwareentwickler. Ich bin
                Unternehmer, betreibe einen eigenen Online-Shop und habe angefangen, mit einem Team aus
                KI-Agenten Dinge zu bauen, für die ich früher Dienstleister gebraucht hätte.
              </p>
              <p className="font-card-body text-base leading-relaxed text-[color:var(--sp-muted)]">
                Mein Wissen kommt aus dem täglichen Benutzen, Ausprobieren und Kaputtmachen: KI-Agenten,
                die Texte schreiben und Daten auswerten, eine Telefonassistentin für Betriebe, ein
                Wissensnetz, aus dem meine Agenten jeden Morgen lernen, eigene Server in Deutschland. Ich
                weiß, wie sich ein System anfühlt, das um drei Uhr nachts nicht tut, was es soll.
              </p>
              <p className="font-card-body text-base leading-relaxed text-[color:var(--sp-muted)]">
                Das ist meine Perspektive auf der Bühne: nicht die eines Forschers oder Verkäufers, sondern
                die eines Anwenders, der Entscheidungen trifft und mit den Folgen lebt. Mit{" "}
                <Link href="/" className="text-[color:var(--sp-text)] underline decoration-[color:var(--sp-blue)] underline-offset-4">promptwerker</Link>{" "}
                setze ich das für Unternehmen um.
              </p>
            </Auftritt>
          </div>
        </section>

        {/* ===== [06] Buch =====
            Übergangskarte bis zur Listung im BoD-Buchshop, Daten: lib/buch.ts. */}
        <section id="buch" aria-labelledby="buch-titel" className="border-y border-[color:var(--sp-stroke)] bg-[color:var(--sp-bg-soft)] py-24 scroll-mt-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Abschnittskopf nummer="06" label="Buch" id="buch-titel">
              Das Buch zum Chaos.
              <span className="block text-[color:var(--sp-lime)]">{buch.status === "lieferbar" ? "Jetzt im Handel." : "Erscheint in Kürze."}</span>
            </Abschnittskopf>
            <div className="mt-14 grid items-start gap-12 lg:grid-cols-12">
              <Auftritt className="mx-auto w-full max-w-[18rem] lg:col-span-4 lg:col-start-1 lg:max-w-none">
                <Image
                  src={buch.cover}
                  width={buch.coverBreite}
                  height={buch.coverHoehe}
                  alt={buch.coverAlt}
                  sizes="(min-width: 1024px) 28vw, 18rem"
                  className="h-auto w-full shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              </Auftritt>
              <Auftritt className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
                <div>
                  <h3 className="sp-display text-3xl sm:text-4xl">{buch.titel}</h3>
                  <p className="mt-2 font-card-body text-lg text-[color:var(--sp-muted)]">{buch.untertitel}</p>
                </div>
                <p className="font-body text-xl leading-relaxed text-[color:var(--sp-text)]">{buch.kurztext}</p>
                <ul className="flex flex-col gap-3">
                  {buch.punkte.map((p) => (
                    <li key={p} className="flex gap-3 font-card-body text-base leading-relaxed text-[color:var(--sp-muted)]">
                      <span aria-hidden="true" className="text-[color:var(--sp-lime)]">→</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="font-card-body text-base font-semibold text-[color:var(--sp-text)]">{buch.bonus}</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[color:var(--sp-stroke)] pt-6 font-card-body text-sm sm:grid-cols-4">
                  <div>
                    <dt className="sp-label text-[color:var(--sp-ziffer)]">Preis</dt>
                    <dd className="mt-1 text-[color:var(--sp-text)]">{buch.preis}</dd>
                  </div>
                  <div>
                    <dt className="sp-label text-[color:var(--sp-ziffer)]">Umfang</dt>
                    <dd className="mt-1 text-[color:var(--sp-text)]">{buch.seiten} Seiten</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="sp-label text-[color:var(--sp-ziffer)]">ISBN</dt>
                    <dd className="mt-1 text-[color:var(--sp-text)]">{buch.isbn}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-4">
                  {buch.shopUrl ? (
                    <a
                      href={buch.shopUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-[44px] items-center bg-[color:var(--sp-lime)] px-6 font-heading text-sm uppercase tracking-wide text-[color:var(--sp-ink-on-lime)]"
                    >
                      Im BoD-Buchshop kaufen
                    </a>
                  ) : (
                    <p className="font-card-body text-sm text-[color:var(--sp-muted)]">
                      {buch.format} bei {buch.verlag}. Bestellbar in jeder Buchhandlung über die ISBN, sobald der Titel gelistet ist.
                    </p>
                  )}
                  <Link
                    href="#anfrage"
                    className="inline-flex min-h-[44px] items-center border border-[color:var(--sp-stroke)] px-6 font-heading text-sm uppercase tracking-wide text-[color:var(--sp-text)]"
                  >
                    Lesung oder Keynote zum Buch anfragen
                  </Link>
                </div>
                <p className="font-card-body text-xs text-[color:var(--sp-ziffer)]">{buch.kiHinweis}</p>
              </Auftritt>
            </div>
          </div>
        </section>

        {/* ===== [07] Ablauf + FAQ ===== */}
        <section aria-labelledby="ablauf-titel" className="bg-[color:var(--sp-bg-raised)] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Abschnittskopf nummer="07" label="Ablauf" id="ablauf-titel">
              Von der Anfrage auf die Bühne.
            </Abschnittskopf>
            <ol className="mt-14 grid gap-px bg-[color:var(--sp-stroke)] sm:grid-cols-2 lg:grid-cols-4">
              {ablauf.map((s, i) => (
                <li key={s.titel} className="bg-[color:var(--sp-bg-raised)] p-6">
                  <Auftritt>
                    <p className="font-heading text-sm text-[color:var(--sp-blue-text)]">0{i + 1}</p>
                    <h3 className="sp-display mt-3 text-xl">{s.titel}</h3>
                    <p className="mt-2 font-card-body text-sm leading-relaxed text-[color:var(--sp-muted)]">{s.text}</p>
                  </Auftritt>
                </li>
              ))}
            </ol>

            <div className="mt-20 grid gap-8 lg:grid-cols-12">
              <Auftritt className="lg:col-span-3">
                <h3 className="sp-label text-[color:var(--sp-lime)]">Häufige Fragen</h3>
              </Auftritt>
              <div className="lg:col-span-9">
                {speakerFaq.map((f) => (
                  <details key={f.q} className="group sp-rule py-5">
                    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-card-body text-lg font-semibold text-[color:var(--sp-text)]">
                      {f.q}
                      <span aria-hidden="true" className="text-[color:var(--sp-lime)] transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-3xl font-card-body text-base leading-relaxed text-[color:var(--sp-muted)]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== [08] Anfrage ===== */}
        <section id="anfrage" aria-labelledby="anfrage-titel" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8 lg:py-32">
          <Abschnittskopf nummer="08" label="Anfrage" id="anfrage-titel">
            Bühne frei?
            <span className="block text-[color:var(--sp-lime)]">Lass uns reden.</span>
          </Abschnittskopf>
          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <Auftritt className="lg:col-span-4">
              <p className="font-body text-base leading-relaxed text-[color:var(--sp-muted)]">
                Datum, Ort und Thema genügen für den Anfang. Du bekommst eine persönliche Antwort von
                Dennis, keine Agentur dazwischen.
              </p>
              <div className="mt-8 flex flex-col gap-2 border-l-[5px] border-[color:var(--sp-blue)] pl-4">
                <p className="sp-label text-[color:var(--sp-text)]">Lieber direkt?</p>
                <a href={`tel:${anbieter.telefonHref}`} className="inline-flex min-h-[44px] items-center font-card-body text-lg text-[color:var(--sp-text)] underline decoration-[color:var(--sp-stroke)] underline-offset-4 hover:decoration-[color:var(--sp-lime)]">
                  {anbieter.telefon}
                </a>
                <a href={`mailto:${anbieter.email}?subject=Speaker-Anfrage`} className="inline-flex min-h-[44px] items-center font-card-body text-lg text-[color:var(--sp-text)] underline decoration-[color:var(--sp-stroke)] underline-offset-4 hover:decoration-[color:var(--sp-lime)]">
                  {anbieter.email}
                </a>
              </div>
            </Auftritt>
            <KreisReveal className="lg:col-span-8" panelClassName="border-[1.5px] border-[color:var(--sp-stroke)] bg-[color:var(--sp-bg-soft)] p-6 sm:p-10">
              <SpeakerAnfrage />
            </KreisReveal>
          </div>
        </section>
      </main>
    </BewegungsRahmen>
  );
}
