import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Standalone-Ausgabe für den Docker-Betrieb auf dem eigenen Server:
     `.next/standalone` enthält einen minimalen server.js samt der
     tatsächlich benötigten Abhängigkeiten, sodass das Laufzeit-Image ohne
     node_modules auskommt. `public/` und `.next/static` kopiert Next dabei
     bewusst nicht mit — das übernimmt das Dockerfile. */
  output: "standalone",
};

export default nextConfig;
