import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { notFound } from "next/navigation";
import { PLASMIC, isPlasmicConfigured } from "@/lib/plasmic-init";
import { PlasmicClientRootProvider } from "@/lib/plasmic-init-client";

// Plasmic-Inhalte werden zur Laufzeit geholt, nicht beim Build vorgerendert
// (Tokens koennen erst spaeter gesetzt werden).
export const dynamic = "force-dynamic";

export default async function PlasmicSubpage({
  params,
}: {
  params: Promise<{ catchall?: string[] }>;
}) {
  const { catchall } = await params;

  // Kein Plasmic-Projekt eingerichtet -> 404 statt API-Fehler.
  if (!isPlasmicConfigured) {
    notFound();
  }

  // URL /seite/leistungen  ->  Plasmic-Seitenpfad /seite/leistungen
  // Im Plasmic-Editor muss der Pfad der Seite also mit /seite/ anfangen.
  const plasmicPath = "/seite/" + (catchall ?? []).join("/");

  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);

  // Keine passende Plasmic-Seite -> normale 404-Seite.
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    notFound();
  }

  const pageMeta = plasmicData.entryCompMetas[0];

  return (
    <PlasmicClientRootProvider
      prefetchedData={plasmicData}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params}
    >
      <PlasmicComponent component={pageMeta.displayName} />
    </PlasmicClientRootProvider>
  );
}
