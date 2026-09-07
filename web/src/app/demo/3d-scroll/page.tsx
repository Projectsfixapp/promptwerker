"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { SCROLL_BEATS } from "@/lib/scrollShowcase";

/* Code-split wie beim NeuralBackground: three.js gehört nicht in das
   Bundle, das die Hydration blockiert. ssr:false, weil die Szene einen
   echten Canvas und window braucht. */
const ScrollWebsiteScene = dynamic(() => import("@/components/ScrollWebsiteScene"), {
  ssr: false,
  loading: () => <div className="h-[60vh]" aria-hidden="true" />,
});

const technik = [
  {
    titel: "Kein Video",
    text: "Die Szene ist Geometrie, die der Browser in Echtzeit rechnet. Ein Video müsste geladen, dekodiert und gepuffert werden — und würde beim Scrollen ruckeln, sobald das Netz schwächelt.",
  },
  {
    titel: "Kein Layout-Sprung",
    text: "Die Fläche steht von der ersten Millisekunde fest. Der Canvas hat feste Maße, es wird nichts nachgeladen, was den Inhalt verschiebt — Core Web Vitals bleiben sauber.",
  },
  {
    titel: "Scroll steuert, nicht Zeit",
    text: "Jeder Zustand ist eine reine Funktion der Scrollposition. Hochscrollen spielt alles rückwärts, Anhalten hält an — es läuft keine Animation gegen den Besucher.",
  },
  {
    titel: "Fällt sauber zurück",
    text: "Ohne WebGL oder bei aktivierter Systemeinstellung „Bewegung reduzieren“ erscheint derselbe Inhalt als ruhige Textfassung. Kein leerer schwarzer Kasten, kein Schwindelgefühl.",
  },
];

const passt = [
  "Produkte oder Leistungen, die man erklären muss, bevor jemand kauft",
  "Marken, die sich sichtbar von einem Baukasten-Template absetzen wollen",
  "Landingpages für Kampagnen, bei denen Verweildauer über den Abschluss entscheidet",
  "Messeauftritte und Pitches, bei denen die Seite selbst das Demo ist",
];

const passtNicht = [
  "Reine Kontaktseiten — dort zählt die Telefonnummer über dem Falz, nicht die Kamerafahrt",
  "Shops mit vielen Artikeln: Ladezeit und Filterlogik schlagen jede Inszenierung",
  "Inhalte, die sich wöchentlich ändern — jede Szene ist gebaut, nicht redaktionell gepflegt",
  "Budgets, bei denen danach kein Geld mehr für Inhalte und Reichweite übrig ist",
];

export default function DemoDreiDScrollSeite() {
  return (
    <main id="inhalt" className="relative">
      <section className="mx-auto max-w-3xl px-6 pb-14 pt-36 sm:pt-44">
        <Link
          href="/leistungen/3d-scroll-websites"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-accent"
        >
          ← Zur Leistung
        </Link>

        <span className="mt-8 block text-xs font-semibold uppercase tracking-wider text-accent">
          Live-Demo
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Eine Website, die sich beim Scrollen aufbaut</h1>
        <p className="mt-5 text-lg leading-relaxed text-body">
          Scroll weiter: Aus verstreuten Bausteinen setzt sich Stück für Stück eine komplette
          Seite zusammen — Navileiste, Hero, Karten, Footer. Alles in Echtzeit im Browser
          gerechnet, kein Video im Hintergrund.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/?kontakt=1"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            So eine Seite für mein Unternehmen anfragen
          </Link>
          <Link
            href="/leistungen/3d-scroll-websites"
            className="glass-button-liquid inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            Ablauf und Umfang ansehen
          </Link>
        </div>
      </section>

      <ScrollWebsiteScene />

      {/* Der Ablauf als echter Text im HTML: die Szene wird client-seitig
          nachgeladen, ihre Beschriftungen stehen also nicht im ausgelieferten
          Dokument. Diese Liste schon — für Suchmaschinen, Antwortmaschinen
          und alle, bei denen die Animation gar nicht erst startet. */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Der Ablauf
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Vier Stationen auf der Scrollstrecke</h2>
        <ol className="mt-8 flex flex-col gap-4">
          {SCROLL_BEATS.map((beat, i) => (
            <li key={beat.id} className="glass-panel flex gap-5 rounded-2xl p-6">
              <span className="font-heading shrink-0 text-2xl text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base">{beat.eyebrow}</h3>
                <p className="mt-2 font-card-body text-sm leading-relaxed text-body">{beat.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Was du gerade gesehen hast
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Vier Entscheidungen hinter der Szene</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {technik.map((punkt) => (
            <div key={punkt.titel} className="glass-panel rounded-2xl p-6">
              <h3 className="text-base">{punkt.titel}</h3>
              <p className="mt-2 font-card-body text-sm leading-relaxed text-body">{punkt.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Ehrliche Einordnung
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Wann sich das lohnt — und wann nicht</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-base text-accent">Lohnt sich</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {passt.map((eintrag) => (
                <li key={eintrag} className="font-card-body text-sm leading-relaxed text-body">
                  {eintrag}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-base">Lohnt sich nicht</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {passtNicht.map((eintrag) => (
                <li key={eintrag} className="font-card-body text-sm leading-relaxed text-body">
                  {eintrag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl">Passt das zu deinem Vorhaben?</h2>
          <p className="mx-auto mt-4 max-w-xl font-card-body text-sm leading-relaxed text-body sm:text-base">
            Im kostenlosen Erstgespräch schauen wir uns an, ob eine 3D-Scroll-Seite bei deiner
            Zielgruppe wirklich etwas bringt — und sagen dir ehrlich, wenn eine klassische Seite
            die bessere Investition ist.
          </p>
          <Link
            href="/?kontakt=1"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            Kostenloses Erstgespräch buchen
          </Link>
        </div>
      </section>
    </main>
  );
}
