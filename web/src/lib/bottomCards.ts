export type BottomCard = {
  id: string;
  title: string;
  blurb: string;
  /** Karte ausblenden ohne sie zu löschen: einfach auf false setzen. */
  enabled: boolean;
};

// Neue Karte hinzufügen: Objekt nach diesem Schema unten anhängen.
// Karte ausblenden statt löschen: enabled: false setzen.
export const bottomCards: BottomCard[] = [
  {
    id: "dsgvo-ai-act",
    title: "DSGVO & EU AI Act",
    blurb: "Rechtssichere KI-Systeme — von der Datenschutz-Folgenabschätzung bis zur Risikoklassifizierung.",
    enabled: true,
  },
  {
    id: "strategie-roadmap",
    title: "Strategie & Roadmap",
    blurb: "Klarer Fahrplan statt Buzzword-Bingo: Welche KI-Schritte sich für Ihr Unternehmen wirklich lohnen.",
    enabled: true,
  },
  {
    id: "rag-systeme",
    title: "RAG-Systeme",
    blurb: "Ihr Unternehmenswissen als durchsuchbare KI-Wissensbasis — präzise Antworten statt Halluzinationen.",
    enabled: true,
  },
  {
    id: "implementierung-loesungen",
    title: "Implementierung & Lösungen",
    blurb: "Von der ersten Idee bis zum produktiven System — wir bauen und betreuen die technische Umsetzung.",
    enabled: true,
  },
  {
    id: "schulungen-fachvortraege",
    title: "Schulungen & Fachvorträge",
    blurb: "Ihr Team lernt, KI-Werkzeuge sicher und sinnvoll im Arbeitsalltag einzusetzen.",
    enabled: true,
  },
  {
    id: "kontakt-chat",
    title: "Kontakt / Chat-Anfrage",
    blurb: "Direkt unverbindlich anfragen — wir melden uns zeitnah mit einem ersten Einschätzungsgespräch.",
    enabled: true,
  },
  {
    id: "use-cases",
    title: "Use Cases",
    blurb: "Konkrete Beispiele aus der Praxis: welche KI-Systeme wir für welche Branchen bereits umgesetzt haben.",
    enabled: true,
  },
];
