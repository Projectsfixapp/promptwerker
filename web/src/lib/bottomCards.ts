export type BottomCard = {
  id: string;
  title: string;
  blurb: string;
  /** Karte ausblenden ohne sie zu löschen: einfach auf false setzen. */
  enabled: boolean;
  /** Hat eine eigene Unterseite unter /leistungen/[id]. false = z.B. reine CTA-Karte (Kontakt). */
  hasPage: boolean;
  eyebrow?: string;
  detail?: string[];
  cta?: string;
  /** Interner Link auf eine Live-Demo, die die Leistung vorführt. Gesetzt =
      die Leistungsseite blendet zusätzlich einen Demo-Knopf ein. */
  demoHref?: string;
  /** Beschriftung des Demo-Knopfs. Ohne Angabe: "Live-Demo ansehen". */
  demoLabel?: string;
};

// Neue Karte hinzufügen: Objekt nach diesem Schema unten anhängen.
// Karte ausblenden statt löschen: enabled: false setzen.
export const bottomCards: BottomCard[] = [
  {
    id: "dsgvo-ai-act",
    title: "DSGVO & EU AI Act",
    blurb: "Rechtssichere KI-Systeme — von der Datenschutz-Folgenabschätzung bis zur Risikoklassifizierung.",
    enabled: true,
    hasPage: true,
    eyebrow: "Recht & Compliance",
    cta: "Compliance-Check anfragen",
    detail: [
      "Seit Inkrafttreten des EU AI Act müssen Unternehmen ihre KI-Systeme nach Risikoklasse einordnen — von minimal bis hoch — und je nach Klasse unterschiedliche Pflichten erfüllen.",
      "Wir übersetzen die regulatorischen Anforderungen in konkrete, umsetzbare Schritte für dein System: Datenschutz-Folgenabschätzung, Dokumentationspflichten, technische und organisatorische Maßnahmen.",
      "Compliance wird von Anfang an mitgedacht, nicht als nachträgliche Prüfung drangehängt — das spart Zeit und vermeidet teure Nacharbeiten.",
    ],
  },
  {
    id: "strategie-roadmap",
    title: "Strategie & Roadmap",
    blurb: "Klarer Fahrplan statt Buzzword-Bingo: Welche KI-Schritte sich für dein Unternehmen wirklich lohnen.",
    enabled: true,
    hasPage: true,
    eyebrow: "Beratung",
    cta: "Strategiegespräch vereinbaren",
    detail: [
      "Viele Unternehmen starten mit einem KI-Pilotprojekt, ohne zu wissen, wie es danach weitergeht — Ergebnis: eine Demo, die in der Schublade landet.",
      "Wir beginnen andersherum: erst die Frage, welches Geschäftsproblem gelöst werden soll, dann die passende KI-Lösung — nicht umgekehrt.",
      "Am Ende steht eine Roadmap mit priorisierten Schritten, realistischen Aufwänden und klaren Erfolgskriterien, keine Buzzword-Folie.",
    ],
  },
  {
    id: "rag-systeme",
    title: "RAG-Systeme",
    blurb: "Dein Unternehmenswissen als durchsuchbare KI-Wissensbasis — präzise Antworten statt Halluzinationen.",
    enabled: true,
    hasPage: true,
    eyebrow: "KI-Wissensmanagement",
    cta: "RAG-Potenzial prüfen",
    detail: [
      "Standard-KI-Modelle kennen dein Unternehmen nicht — sie raten, statt zu wissen, und erfinden im Zweifel Antworten, die falsch klingen, aber überzeugend wirken.",
      "Ein RAG-System (Retrieval-Augmented Generation) durchsucht dein eigenes Unternehmenswissen — Handbücher, Wikis, Support-Tickets, Produktdaten — und lässt die KI nur auf Basis dieser echten Quellen antworten.",
      "Das Ergebnis: Antworten mit Quellenangabe, die überprüfbar sind, statt Halluzinationen, die im schlimmsten Fall falsche Informationen an Kunden weitergeben.",
    ],
  },
  {
    id: "implementierung-loesungen",
    title: "Implementierung & Lösungen",
    blurb: "Von der ersten Idee bis zum produktiven System — wir bauen und betreuen die technische Umsetzung.",
    enabled: true,
    hasPage: true,
    eyebrow: "Umsetzung",
    cta: "Umsetzung besprechen",
    detail: [
      "Viele KI-Projekte scheitern nicht an der Idee, sondern an der Umsetzung — zwischen Konzept und laufendem System liegt oft eine große Lücke.",
      "Wir schließen diese Lücke: von der ersten Idee über einen funktionierenden Prototyp bis zum produktiven, betreuten System.",
      "Jede Phase hat ein klares Ergebnis, keine endlose Konzeptphase ohne sichtbaren Fortschritt.",
    ],
  },
  {
    id: "schulungen-fachvortraege",
    title: "Schulungen & Fachvorträge",
    blurb: "Dein Team lernt, KI-Werkzeuge sicher und sinnvoll im Arbeitsalltag einzusetzen.",
    enabled: true,
    hasPage: true,
    eyebrow: "Weiterbildung",
    cta: "Schulung anfragen",
    detail: [
      "Das beste KI-System bringt wenig, wenn das Team es nicht versteht oder ihm nicht vertraut — Akzeptanz entscheidet über den tatsächlichen Nutzen.",
      "Unsere Schulungen sind praxisnah: keine abstrakten KI-Grundlagen, sondern konkrete Werkzeuge und Abläufe aus eurem Arbeitsalltag.",
      "Auf Wunsch ergänzen Fachvorträge — etwa für Führungskräfte-Runden oder Kick-off-Veranstaltungen — die praktische Schulung um den strategischen Überblick.",
    ],
  },
  {
    id: "3d-scroll-websites",
    title: "3D-Scroll-Websites",
    blurb: "Seiten, bei denen Scrollen zur Kamerafahrt wird — in Echtzeit im Browser gerendert, ohne Video.",
    enabled: true,
    hasPage: true,
    eyebrow: "Web-Erlebnisse",
    cta: "3D-Scroll-Seite anfragen",
    demoHref: "/demo/3d-scroll",
    demoLabel: "Live-Demo ansehen",
    detail: [
      "Die meisten Websites sind eine Liste: Abschnitt unter Abschnitt, Besucher scrollen daran vorbei. Eine 3D-Scroll-Seite macht aus derselben Strecke eine Kamerafahrt — der Inhalt baut sich auf, während gescrollt wird.",
      "Technisch läuft das über WebGL und eine scrollgesteuerte Szene, nicht über ein Hintergrundvideo: Jeder Zustand ist an die Scrollposition gebunden, Hochscrollen spielt alles rückwärts, und es gibt keinen Ladebalken vor dem ersten Bild.",
      "Ohne WebGL oder bei aktivierter Systemeinstellung „Bewegung reduzieren“ erscheint derselbe Inhalt als ruhige Textfassung — die Seite bleibt bedienbar und barrierefrei statt leer.",
    ],
  },
  {
    id: "kontakt-chat",
    title: "Kontakt / Chat-Anfrage",
    blurb: "Direkt unverbindlich anfragen — wir melden uns zeitnah mit einem ersten Einschätzungsgespräch.",
    enabled: true,
    hasPage: false,
  },
  {
    id: "use-cases",
    title: "Use Cases",
    blurb: "Konkrete Beispiele aus der Praxis: welche KI-Systeme wir für welche Branchen bereits umgesetzt haben.",
    enabled: true,
    hasPage: true,
    eyebrow: "Praxisbeispiele",
    cta: "Meinen Use Case besprechen",
    detail: [
      "KI-Beratung bleibt abstrakt, solange sie nicht an echten Beispielen gezeigt wird — deshalb sammeln wir hier konkrete Anwendungsfälle statt allgemeiner Versprechen.",
      "Die folgenden Szenarien zeigen, wie sich Voice-Agenten, Workflow-Automatisierung, Lead-Scoring, CRM-Anbindung, RAG-Systeme und Schulungen in der Praxis kombinieren lassen.",
      "Jedes Unternehmen hat eine andere Ausgangslage — die Beispiele sind Orientierung, kein Baukasten von der Stange.",
    ],
  },
];
