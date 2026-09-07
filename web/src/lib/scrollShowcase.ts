/* Die Textbeats der 3D-Scroll-Demo.

   Bewusst hier und nicht in der Szene: die Szene wird per dynamic mit
   ssr:false geladen und steht deshalb nicht im ausgelieferten HTML. Die
   Seite rendert dieselbe Liste serverseitig mit, damit Suchmaschinen,
   Antwortmaschinen und Screenreader den Ablauf auch dann lesen, wenn die
   Animation nie startet. */

export type ScrollBeat = {
  id: string;
  /** Scrollfortschritt, ab dem der Text eingeblendet wird (0–1) */
  von: number;
  /** Scrollfortschritt, ab dem er wieder verschwunden ist */
  bis: number;
  eyebrow: string;
  text: string;
};

export const SCROLL_BEATS: ScrollBeat[] = [
  {
    id: "beat-teile",
    von: 0.0,
    bis: 0.34,
    eyebrow: "Ausgangslage",
    text: "Jede Website ist erst einmal ein Haufen Einzelteile.",
  },
  {
    id: "beat-kamera",
    von: 0.3,
    bis: 0.64,
    eyebrow: "Der Unterschied",
    text: "Scrollen wird zur Kamerafahrt statt zum Weiterblättern.",
  },
  {
    id: "beat-aufbau",
    von: 0.6,
    bis: 0.88,
    eyebrow: "Aufbau",
    text: "Die Seite baut sich vor den Augen der Besucher zusammen.",
  },
  {
    id: "beat-echtzeit",
    von: 0.84,
    bis: 1.0,
    eyebrow: "Technik",
    text: "Kein Video: das rendert dein Browser in Echtzeit.",
  },
];
