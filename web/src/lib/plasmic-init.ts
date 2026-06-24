import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional";
import Logo from "@/components/Logo";

// projectId + token bekommt Dennis beim Anlegen des Plasmic-Projekts
// (Plasmic -> Projekt -> Settings -> Code -> Next.js). Beides ist ein
// oeffentlicher Client-Token, KEIN Secret. Siehe PLASMIC-SETUP.md.
const projectId = process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID ?? "";
const projectToken = process.env.NEXT_PUBLIC_PLASMIC_PROJECT_TOKEN ?? "";

// True, sobald beide Tokens in .env.local gesetzt sind. Solange das false ist,
// liefern die Plasmic-Routen einfach 404 statt einen API-Call zu versuchen –
// so baut die Seite auch ohne eingerichtetes Plasmic-Projekt fehlerfrei.
export const isPlasmicConfigured = projectId !== "" && projectToken !== "";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: projectId,
      token: projectToken,
    },
  ],
  // In Entwicklung unveroeffentlichte Entwuerfe zeigen, in Produktion nur
  // veroeffentlichte Inhalte.
  preview: process.env.NODE_ENV !== "production",
});

// Bestehende Bausteine, die Dennis im Plasmic-Editor wiederverwenden kann.
// Bewusst kurz gehalten – jede registrierte Komponente muss im Editor-Canvas
// fehlerfrei rendern. Weitere koennen spaeter ergaenzt werden.
PLASMIC.registerComponent(Logo, {
  name: "Logo",
  displayName: "Promptwerker Logo",
  props: {},
  importPath: "@/components/Logo",
  isDefaultExport: true,
});
