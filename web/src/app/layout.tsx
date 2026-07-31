import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans, Archivo } from "next/font/google";
import "./globals.css";
import Logo from "@/components/Logo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { anbieter, baseUrl } from "@/lib/legal";

const disketMono = localFont({
  src: [
    { path: "../../public/fonts/Disket-Mono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Disket-Mono-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-disket",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const beschreibung =
  "Voice-Agenten am Telefon, automatisierte Workflows, Leads im Autopilot: Wir bauen die KI-Systeme, die dein Unternehmen tatsächlich entlasten.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "promptwerker — KI-Beratung für den Mittelstand",
    // Unterseiten mit kurzem Titel bekommen die Marke automatisch angehängt.
    template: "%s — promptwerker",
  },
  description: beschreibung,
  applicationName: "promptwerker",
  authors: [{ name: anbieter.person }],
  creator: anbieter.person,
  publisher: anbieter.firma,
  alternates: { canonical: "/" },
  keywords: [
    "KI-Beratung",
    "Voice-Agent",
    "KI-Telefonagent",
    "Workflow-Automatisierung",
    "CRM-Anbindung",
    "RAG-System",
    "EU AI Act",
    "Mittelstand",
    "Hünfelden",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: baseUrl,
    siteName: "promptwerker",
    title: "promptwerker — KI-Beratung für den Mittelstand",
    description: beschreibung,
  },
  twitter: {
    card: "summary_large_image",
    title: "promptwerker — KI-Beratung für den Mittelstand",
    description: beschreibung,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

/* Strukturierte Daten für Such- und Antwortmaschinen.
   @graph statt einzelner Blöcke, damit Organisation und Website über @id
   aufeinander verweisen — das ist der Unterschied zwischen "ein paar
   Angaben" und einer maschinenlesbaren Beschreibung des Anbieters.
   Alle Werte stammen aus lib/legal.ts, es fließt keine Nutzereingabe ein. */
const strukturierteDaten = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${baseUrl}/#organisation`,
      name: "promptwerker",
      legalName: anbieter.firma,
      url: baseUrl,
      description:
        "KI-Systeme für den Mittelstand: Voice-Agenten, Workflow-Automatisierung, Lead- und Sales-Autopilot, CRM-Anbindung sowie Beratung zu DSGVO und EU AI Act.",
      founder: { "@type": "Person", name: anbieter.person },
      vatID: anbieter.ustId,
      email: anbieter.email,
      telephone: anbieter.telefonHref,
      address: {
        "@type": "PostalAddress",
        streetAddress: anbieter.strasse,
        postalCode: anbieter.plz,
        addressLocality: anbieter.ort,
        addressRegion: "Hessen",
        addressCountry: anbieter.landCode,
      },
      areaServed: [
        { "@type": "Country", name: "Deutschland" },
        { "@type": "Country", name: "Österreich" },
        { "@type": "Country", name: "Schweiz" },
      ],
      availableLanguage: ["de"],
      knowsAbout: [
        "Künstliche Intelligenz",
        "Sprachagenten",
        "Prozessautomatisierung",
        "Retrieval Augmented Generation",
        "EU AI Act",
        "DSGVO",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "promptwerker",
      inLanguage: "de-DE",
      publisher: { "@id": `${baseUrl}/#organisation` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${disketMono.variable} ${ibmPlexSans.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink font-body overflow-x-hidden">
        <script type="application/ld+json">{JSON.stringify(strukturierteDaten)}</script>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-accent-ink"
        >
          Direkt zum Inhalt
        </a>
        <Logo />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
