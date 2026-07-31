import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalNote, LegalSection } from "@/components/LegalPage";
import { anbieter, baseUrl } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Erklärung zur Barrierefreiheit — promptwerker",
  description:
    "Erklärung zur Barrierefreiheit von promptwerker.de: angestrebte Konformität mit WCAG 2.2 Stufe AA, umgesetzte Maßnahmen, bekannte Einschränkungen und Kontakt für Rückmeldungen.",
  alternates: { canonical: "/barrierefreiheit" },
  openGraph: {
    title: "Erklärung zur Barrierefreiheit — promptwerker",
    description:
      "Konformitätsstand nach WCAG 2.2 AA, umgesetzte Maßnahmen und Rückmeldemöglichkeit.",
    url: `${baseUrl}/barrierefreiheit`,
    type: "website",
  },
};

export default function BarrierefreiheitPage() {
  return (
    <LegalPage
      titel="Erklärung zur Barrierefreiheit"
      intro="Diese Erklärung gilt für die Website promptwerker.de."
    >
      <LegalNote>
        Wir geben diese Erklärung freiwillig ab. Als privatwirtschaftliches
        Business-to-Business-Angebot unterliegt promptwerker.de weder der Barrierefreie-
        Informationstechnik-Verordnung (BITV 2.0) noch dem Barrierefreiheitsstärkungsgesetz
        (BFSG), das seit dem 28. Juni 2025 für Verbraucherangebote gilt. Wir halten den Standard
        trotzdem ein — barrierefreie Bedienung ist schlicht bessere Bedienung.
      </LegalNote>

      <LegalSection titel="Angestrebter Konformitätsstand">
        <p>
          Ziel ist die Übereinstimmung mit den Web Content Accessibility Guidelines (WCAG) in der
          Fassung 2.2, Konformitätsstufe AA, entsprechend der harmonisierten europäischen Norm
          EN 301 549. Nach eigener Prüfung ist die Website{" "}
          <strong className="text-ink">weitgehend konform</strong>: Die Anforderungen der Stufe AA
          werden erfüllt, mit den unten genannten Einschränkungen.
        </p>
      </LegalSection>

      <LegalSection titel="Umgesetzte Maßnahmen">
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>
            Vollständige Bedienung per Tastatur, einschließlich aller Menüs, Formulare und
            Überlagerungen; ein Sprunglink führt am Anfang jeder Seite direkt zum Inhalt.
          </li>
          <li>
            Deutlich sichtbare Fokusanzeige mit ausreichendem Kontrast zum Hintergrund
            (WCAG 2.4.11, 2.4.13).
          </li>
          <li>
            Semantische Struktur mit Landmarken, durchgehender Überschriftenhierarchie und in
            Textform beschrifteten Bedienelementen.
          </li>
          <li>
            Formularfelder mit dauerhaft sichtbarer Beschriftung — nicht nur mit Platzhaltertext —
            sowie Fehler- und Erfolgsmeldungen, die Hilfsmitteln aktiv angesagt werden.
          </li>
          <li>
            Farbkontraste von mindestens 4,5:1 für Fließtext und 3:1 für große Schrift und
            Bedienelemente.
          </li>
          <li>
            Respektierung der Systemeinstellung „Bewegung reduzieren“: Hintergrundanimation,
            Logo-Karussell und Laufband stehen dann still.
          </li>
          <li>
            Nutzbarkeit ohne Farbwahrnehmung — Informationen werden nie allein über Farbe
            transportiert; Tabelleneinträge außerhalb der EU sind zusätzlich in Textform
            gekennzeichnet.
          </li>
          <li>Angabe der Seitensprache und aussagekräftige, eindeutige Seitentitel.</li>
        </ul>
      </LegalSection>

      <LegalSection titel="Bekannte Einschränkungen">
        <p>
          Der dreidimensionale Hintergrund und das Logo-Karussell auf der Startseite sind rein
          dekorativ. Sie sind für Hilfsmittel ausgeblendet und tragen keine Information — auf
          leistungsschwachen Geräten kann die Startseite dadurch dennoch spürbar später
          reagieren. An der Ladezeit arbeiten wir laufend.
        </p>
        <p>
          Über die Website erreichbare Dokumente Dritter — etwa Vertragsentwürfe im PDF-Format —
          sind nicht zwingend barrierefrei aufbereitet. Auf Anfrage stellen wir jeden Inhalt in
          einem zugänglichen Format bereit.
        </p>
      </LegalSection>

      <LegalSection titel="Erstellung dieser Erklärung">
        <p>
          Diese Erklärung wurde am 31. Juli 2026 auf Grundlage einer Selbstbewertung erstellt.
          Geprüft wurde mit Tastaturbedienung, Kontrastmessung und automatisierten Werkzeugen. Ein
          Test mit Nutzerinnen und Nutzern von Screenreadern steht noch aus.
        </p>
      </LegalSection>

      <LegalSection titel="Rückmeldung und Kontakt">
        <p>
          Ist Ihnen eine Barriere aufgefallen oder benötigen Sie einen Inhalt in einem anderen
          Format? Schreiben Sie an{" "}
          <LegalLink href={`mailto:${anbieter.email}?subject=Barrierefreiheit`}>
            {anbieter.email}
          </LegalLink>{" "}
          oder rufen Sie an unter{" "}
          <LegalLink href={`tel:${anbieter.telefonHref}`}>{anbieter.telefon}</LegalLink>. Wir
          antworten innerhalb von fünf Werktagen und nennen dabei, bis wann wir die Barriere
          beheben.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
