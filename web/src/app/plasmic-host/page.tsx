"use client";

import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/lib/plasmic-init";

// Diese Route (/plasmic-host) muss im Plasmic-Editor als "App host" hinterlegt
// werden. Dadurch sieht der Editor die Seite und die registrierten Bausteine.
export default function PlasmicHost() {
  return PLASMIC && <PlasmicCanvasHost />;
}
