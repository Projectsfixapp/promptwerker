import type { Metadata } from "next";
import { baseUrl } from "@/lib/legal";

/* Die Workshop-Seite ist eine Client-Komponente (Kontakt-Overlay mit
   State) und kann deshalb selbst kein `metadata` exportieren. Dieses
   Layout liefert Titel, Beschreibung, Canonical und die strukturierten
   Daten für das kostenpflichtige Angebot nach. */

const titel = "Video-Workshop: Deine KI-Roadmap im Selbststudium";
const beschreibung =
  "Video-Workshop für 99 €: In eigenem Tempo zur priorisierten KI-Roadmap für den eigenen Betrieb — welche Prozesse sich lohnen, in welcher Reihenfolge, mit welchem Aufwand.";

export const metadata: Metadata = {
  title: `${titel} — promptwerker`,
  description: beschreibung,
  alternates: { canonical: "/leistungen/workshop-roadmap" },
  openGraph: {
    title: `${titel} — promptwerker`,
    description: beschreibung,
    url: `${baseUrl}/leistungen/workshop-roadmap`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: titel, description: beschreibung },
};

const strukturierteDaten = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": `${baseUrl}/leistungen/workshop-roadmap#kurs`,
      name: titel,
      description: beschreibung,
      url: `${baseUrl}/leistungen/workshop-roadmap`,
      inLanguage: "de-DE",
      provider: { "@id": `${baseUrl}/#organisation` },
      offers: {
        "@type": "Offer",
        price: "99",
        priceCurrency: "EUR",
        category: "Video-Workshop",
        url: `${baseUrl}/leistungen/workshop-roadmap`,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT3H",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/leistungen/workshop-roadmap#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Leistungen", item: `${baseUrl}/#leistungen` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Workshop: Roadmap",
          item: `${baseUrl}/leistungen/workshop-roadmap`,
        },
      ],
    },
  ],
};

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(strukturierteDaten)}</script>
      {children}
    </>
  );
}
