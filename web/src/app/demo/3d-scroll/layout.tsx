import type { Metadata } from "next";
import { baseUrl } from "@/lib/legal";

/* Die Demo-Seite ist eine Client-Komponente (three.js über dynamic mit
   ssr:false) und kann deshalb selbst kein `metadata` exportieren. Dieses
   Layout liefert Titel, Beschreibung, Canonical und die strukturierten
   Daten nach — dasselbe Muster wie /leistungen/workshop-roadmap. */

const titel = "3D-Scroll-Demo: Website baut sich beim Scrollen auf";
const beschreibung =
  "Live-Demo einer scroll-getriebenen 3D-Website: Aus verstreuten Bausteinen setzt sich beim Scrollen eine komplette Seite zusammen — in Echtzeit im Browser gerendert, ohne Video und ohne Ladebalken.";

export const metadata: Metadata = {
  // Ohne Suffix: das Root-Layout hängt per title.template " — promptwerker" an.
  title: titel,
  description: beschreibung,
  alternates: { canonical: "/demo/3d-scroll" },
  openGraph: {
    title: `${titel} — promptwerker`,
    description: beschreibung,
    url: `${baseUrl}/demo/3d-scroll`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: titel, description: beschreibung },
};

const strukturierteDaten = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/demo/3d-scroll#seite`,
      name: titel,
      description: beschreibung,
      url: `${baseUrl}/demo/3d-scroll`,
      inLanguage: "de-DE",
      isPartOf: { "@id": `${baseUrl}/#organisation` },
      about: { "@id": `${baseUrl}/leistungen/3d-scroll-websites#service` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/demo/3d-scroll#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "3D-Scroll-Websites",
          item: `${baseUrl}/leistungen/3d-scroll-websites`,
        },
        { "@type": "ListItem", position: 3, name: "Demo", item: `${baseUrl}/demo/3d-scroll` },
      ],
    },
  ],
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(strukturierteDaten)}</script>
      {children}
    </>
  );
}
