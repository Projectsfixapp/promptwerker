import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans, Archivo } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "promptwerker — KI-Beratung für den Mittelstand",
  description:
    "Voice-Agenten am Telefon, automatisierte Workflows, Leads im Autopilot: Wir bauen die KI-Systeme, die dein Unternehmen tatsächlich entlastet.",
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
      <body className="min-h-full bg-bg text-ink font-body overflow-x-hidden">{children}</body>
    </html>
  );
}
