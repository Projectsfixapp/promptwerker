"use client";

import * as React from "react";
import { PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "./plasmic-init";

// Client-Wrapper um den Plasmic-RootProvider. Im App Router muss der Provider
// in einer Client-Komponente liegen; die Server-Seite (catchall) holt die
// Daten und reicht sie hier hinein.
type RootProviderProps = Omit<
  React.ComponentProps<typeof PlasmicRootProvider>,
  "loader"
>;

export function PlasmicClientRootProvider(props: RootProviderProps) {
  return <PlasmicRootProvider loader={PLASMIC} {...props} />;
}
