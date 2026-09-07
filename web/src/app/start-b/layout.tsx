import type { Metadata } from "next";

/* Die Variante B der Startseite ist eine Client-Komponente (Overlays mit
   State) und kann deshalb selbst kein `metadata` exportieren — gleiches
   Muster wie /leistungen/workshop-roadmap.

   Bewusst noindex: die Seite trägt dieselben Inhalte wie die Startseite
   und dient nur dem internen Vergleich — sie darf nicht als Dublette in
   den Index. Deshalb auch kein Eintrag in sitemap.ts oder llms.txt. */

const titel = "Startseite — Variante B";
const beschreibung =
  "Alternative Fassung der promptwerker-Startseite zum Vergleich: gleiche Inhalte, andere Inszenierung.";

export const metadata: Metadata = {
  // Ohne Suffix: das Root-Layout hängt per title.template " — promptwerker" an.
  title: titel,
  description: beschreibung,
  robots: { index: false, follow: true },
};

export default function StartBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
