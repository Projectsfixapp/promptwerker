export type AuditOption = { label: string; sublabel: string; score: number };
export type AuditQuestion = {
  id: string;
  category: string;
  prompt: string;
  why: string;
  options: AuditOption[];
};

export const AUDIT_CATEGORIES = [
  "Strategie & Ziele",
  "Daten & Tools",
  "Prozesse & Automatisierung",
  "Team & Akzeptanz",
] as const;

export type AuditSource = {
  category: string;
  framework: string;
  year: string;
  url: string;
  note: string;
};

// Echte, frei zugängliche Quellen, an denen sich unsere 4 Kategorien orientieren.
// promptwerker steht in keiner Partnerschaft, Zertifizierung oder Zusammenarbeit
// mit den genannten Organisationen — es werden ausschließlich deren öffentlich
// dokumentierte Konzepte als fachliche Referenz genutzt. Stand: Juli 2026,
// jede URL manuell verifiziert (keine erfundenen Titel/Zitate).
const MCKINSEY_STATE_OF_AI = "McKinsey QuantumBlack — „The State of AI“ (Rewired-Forschung)";
const MCKINSEY_STATE_OF_AI_URL = "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai";

export const auditSources: AuditSource[] = [
  {
    category: "Strategie & Ziele",
    framework: MCKINSEY_STATE_OF_AI,
    year: "2025",
    url: MCKINSEY_STATE_OF_AI_URL,
    note: "Orientiert an der Dimension „Strategy“ aus McKinseys branchenübergreifender Analyse von über 200 KI-Transformationen: klares, in die Unternehmensstrategie eingebettetes KI-Ziel statt isolierter Tech-Initiative.",
  },
  {
    category: "Strategie & Ziele",
    framework: "OECD AI Principles (Update 2024)",
    year: "2024",
    url: "https://oecd.ai/en/ai-principles",
    note: "Orientiert an dem Prinzip „Accountability“: klare Verantwortlichkeit für KI-Entscheidungen und deren Auswirkungen im Unternehmen.",
  },
  {
    category: "Daten & Tools",
    framework: "OECD AI Principles (Update 2024)",
    year: "2024",
    url: "https://oecd.ai/en/ai-principles",
    note: "Orientiert an den Prinzipien „Robustness, Security and Safety“ sowie Menschenrechte/Fairness (u.a. Datenschutz) der OECD-Empfehlung zu Künstlicher Intelligenz.",
  },
  {
    category: "Daten & Tools",
    framework: "EU AI Act — Verordnung (EU) 2024/1689",
    year: "2024",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
    note: "Offizieller Gesetzestext der EU. Grundlage für unsere Frage zu Datenschutz- und Folgenabschätzung bei KI-Anwendungsfällen — keine Rechtsberatung, nur Orientierung an den dokumentierten Pflichten.",
  },
  {
    category: "Daten & Tools",
    framework: MCKINSEY_STATE_OF_AI,
    year: "2025",
    url: MCKINSEY_STATE_OF_AI_URL,
    note: "Orientiert an den Dimensionen „Technology“ und „Data“: zugängliche, integrierte Dateninfrastruktur als Grundvoraussetzung für skalierbare KI-Nutzung.",
  },
  {
    category: "Prozesse & Automatisierung",
    framework: MCKINSEY_STATE_OF_AI,
    year: "2025",
    url: MCKINSEY_STATE_OF_AI_URL,
    note: "Orientiert an den Dimensionen „Operating Model“ und „Adoption & Scaling“: definierte Prozesse für Rollout und Skalierung erfolgreicher KI-Piloten statt Einzelprojekten ohne Struktur.",
  },
  {
    category: "Team & Akzeptanz",
    framework: MCKINSEY_STATE_OF_AI,
    year: "2025",
    url: MCKINSEY_STATE_OF_AI_URL,
    note: "Orientiert an der Dimension „Talent“: gezielte Qualifizierung und Kapazität im Team als einer von sechs Faktoren, die laut McKinsey mit tatsächlichem KI-Wertbeitrag korrelieren.",
  },
  {
    category: "Team & Akzeptanz",
    framework: "Bitkom Research — „Künstliche Intelligenz in Deutschland“",
    year: "2026",
    url: "https://www.bitkom.org/Bitkom/Publikationen/Kuenstliche-Intelligenz-in-Deutschland",
    note: "Reale Umfragedaten aus 604 befragten deutschen Unternehmen (Befragung 2025): mangelnde Akzeptanz der Beschäftigten und fehlende personelle Ressourcen zählen zu den meistgenannten Hemmnissen beim KI-Einsatz.",
  },
];

// 10 Fragen, 4 Kategorien, je Antwort ein Score 0-4. Eigene Formulierungen,
// inhaltlich orientiert an dem, was für KMU-KI-Projekte tatsächlich zählt.
export const auditQuestions: AuditQuestion[] = [
  {
    id: "strategie-ziel",
    category: "Strategie & Ziele",
    prompt: "Gibt es ein konkretes Geschäftsziel, das KI bei euch erreichen soll?",
    why: "Projekte ohne klares Ziel enden meist als Demo in der Schublade, nicht als produktives System.",
    options: [
      { label: "Nein, wir experimentieren einfach mal", sublabel: "Kein definiertes Ziel", score: 0 },
      { label: "Vage Idee, nichts Schriftliches", sublabel: "Nur im Kopf einzelner Personen", score: 1 },
      { label: "Ein Bereich hat ein klares Ziel", sublabel: "Z.B. Support oder Vertrieb", score: 2 },
      { label: "Mehrere Bereiche mit dokumentierten Zielen", sublabel: "Abgestimmt mit der Leitung", score: 3 },
      { label: "Ziele sind Teil der Unternehmensstrategie", sublabel: "Mit klaren KPIs hinterlegt", score: 4 },
    ],
  },
  {
    id: "strategie-budget",
    category: "Strategie & Ziele",
    prompt: "Steht für KI-Vorhaben ein eigenes Budget zur Verfügung?",
    why: "Ohne Budgetrahmen bleiben KI-Vorhaben Wunschprojekte statt geplanter Investition.",
    options: [
      { label: "Kein Budget vorgesehen", sublabel: "Wird von Fall zu Fall entschieden", score: 0 },
      { label: "Kleines, informelles Budget", sublabel: "Für erste Tests", score: 1 },
      { label: "Budget für ein Pilotprojekt", sublabel: "Zeitlich begrenzt", score: 2 },
      { label: "Jahresbudget für KI-Vorhaben", sublabel: "Fest eingeplant", score: 3 },
      { label: "Mehrjährige Investitionsplanung", sublabel: "Mit Skalierungsbudget", score: 4 },
    ],
  },
  {
    id: "strategie-verantwortung",
    category: "Strategie & Ziele",
    prompt: "Wer treibt KI-Entscheidungen bei euch voran?",
    why: "Ohne klare Verantwortung verläuft jedes Vorhaben im Sand, sobald es unbequem wird.",
    options: [
      { label: "Niemand konkret", sublabel: "Läuft nebenbei mit", score: 0 },
      { label: "Einzelne engagierte Mitarbeitende", sublabel: "Ohne offizielles Mandat", score: 1 },
      { label: "Ein Fachbereich mit Zuständigkeit", sublabel: "Z.B. IT oder Marketing", score: 2 },
      { label: "Eine benannte Projektleitung", sublabel: "Mit Entscheidungsbefugnis", score: 3 },
      { label: "Geschäftsführung ist aktiv eingebunden", sublabel: "KI ist Chefsache", score: 4 },
    ],
  },
  {
    id: "daten-qualitaet",
    category: "Daten & Tools",
    prompt: "Wie zugänglich sind eure wichtigsten Unternehmensdaten?",
    why: "Ohne saubere, zugängliche Daten liefert jedes KI-System nur Rateergebnisse.",
    options: [
      { label: "Verteilt in Kopf und Zetteln", sublabel: "Kein System dahinter", score: 0 },
      { label: "In Excel-Listen, unstrukturiert", sublabel: "Verschiedene Versionen im Umlauf", score: 1 },
      { label: "In einzelnen Fachsystemen", sublabel: "Aber nicht verbunden", score: 2 },
      { label: "Zentral in wenigen Systemen", sublabel: "Mit klaren Verantwortlichkeiten", score: 3 },
      { label: "Sauber strukturiert und API-zugänglich", sublabel: "Bereit für Automatisierung", score: 4 },
    ],
  },
  {
    id: "daten-tools",
    category: "Daten & Tools",
    prompt: "Wie viele eurer Kernsysteme (CRM, ERP, Shop, …) sind bereits verbunden?",
    why: "Insellösungen ohne Verbindung sind der häufigste Grund, warum Automatisierung ausgebremst wird.",
    options: [
      { label: "Keine, alles läuft einzeln", sublabel: "Manuelle Übertragung nötig", score: 0 },
      { label: "Vereinzelte Handarbeit-Exporte", sublabel: "Copy-Paste zwischen Systemen", score: 1 },
      { label: "Ein bis zwei Systeme verbunden", sublabel: "Über einfache Schnittstellen", score: 2 },
      { label: "Die meisten Kernsysteme verbunden", sublabel: "Über stabile APIs", score: 3 },
      { label: "Vollständig integrierte Systemlandschaft", sublabel: "Ein durchgängiger Datenfluss", score: 4 },
    ],
  },
  {
    id: "daten-schutz",
    category: "Daten & Tools",
    prompt: "Wie steht es um Datenschutz und EU AI Act bei euren KI-Vorhaben?",
    why: "Nachträgliche Compliance kostet deutlich mehr als von Anfang an mitgedachte.",
    options: [
      { label: "Noch nicht betrachtet", sublabel: "Kein Thema bisher", score: 0 },
      { label: "Bewusstsein vorhanden, nichts dokumentiert", sublabel: "Wird mitgedacht, aber informell", score: 1 },
      { label: "Erste Einschätzung gemacht", sublabel: "Grobe Risikoeinordnung", score: 2 },
      { label: "Dokumentierte Folgenabschätzung", sublabel: "Für zentrale Anwendungsfälle", score: 3 },
      { label: "Vollständig dokumentiert und laufend geprüft", sublabel: "Fester Prozess etabliert", score: 4 },
    ],
  },
  {
    id: "prozesse-automatisiert",
    category: "Prozesse & Automatisierung",
    prompt: "Wie viele wiederkehrende Abläufe laufen bei euch schon automatisiert?",
    why: "Der Reifegrad bestehender Automatisierung zeigt, wie schnell KI-Agenten andocken können.",
    options: [
      { label: "Keine, alles manuell", sublabel: "Jeder Schritt von Hand", score: 0 },
      { label: "Ein einzelner Ablauf", sublabel: "Erste Gehversuche", score: 1 },
      { label: "Einige zentrale Abläufe", sublabel: "In Kernbereichen", score: 2 },
      { label: "Die meisten Routineabläufe", sublabel: "Über mehrere Abteilungen", score: 3 },
      { label: "Durchgängig automatisierte Prozesskette", sublabel: "Von Anfrage bis Abschluss", score: 4 },
    ],
  },
  {
    id: "prozesse-support",
    category: "Prozesse & Automatisierung",
    prompt: "Wie werden Kundenanfragen (Telefon, Chat, Mail) aktuell bearbeitet?",
    why: "Hier liegt bei den meisten Mittelständlern der schnellste Hebel für einen ersten KI-Agenten.",
    options: [
      { label: "Ausschließlich persönlich, oft mit Wartezeit", sublabel: "Keine Vertretung außerhalb Öffnungszeiten", score: 0 },
      { label: "Persönlich mit einfachem Ticketsystem", sublabel: "Noch keine Automatisierung", score: 1 },
      { label: "Teilweise mit Chatbot oder Regeln", sublabel: "Für Standardfälle", score: 2 },
      { label: "KI unterstützt bei Vorqualifizierung", sublabel: "Mensch übernimmt komplexe Fälle", score: 3 },
      { label: "KI-Agent bearbeitet eigenständig", sublabel: "Eskalation nur bei Bedarf", score: 4 },
    ],
  },
  {
    id: "team-akzeptanz",
    category: "Team & Akzeptanz",
    prompt: "Wie steht dein Team aktuell zu KI-Werkzeugen im Arbeitsalltag?",
    why: "Das beste System bringt nichts, wenn das Team es nicht nutzt oder ihm misstraut.",
    options: [
      { label: "Große Skepsis oder Ablehnung", sublabel: "Sorge um den eigenen Job", score: 0 },
      { label: "Abwartend, wenig Berührung bisher", sublabel: "Noch keine Erfahrung", score: 1 },
      { label: "Neugierig, einzelne nutzen Tools privat", sublabel: "Ohne offizielle Schulung", score: 2 },
      { label: "Offen, erste Schulungen fanden statt", sublabel: "Positive erste Erfahrungen", score: 3 },
      { label: "KI ist fester Teil des Arbeitsalltags", sublabel: "Breit akzeptiert und genutzt", score: 4 },
    ],
  },
  {
    id: "team-kapazitaet",
    category: "Team & Akzeptanz",
    prompt: "Habt ihr intern Kapazität, ein KI-Projekt aktiv zu begleiten?",
    why: "Auch das beste externe Team braucht einen internen Ansprechpartner, der Entscheidungen trifft.",
    options: [
      { label: "Niemand hat dafür Zeit", sublabel: "Alle sind ausgelastet", score: 0 },
      { label: "Nebenbei, wenn Zeit bleibt", sublabel: "Keine feste Kapazität", score: 1 },
      { label: "Eine Person mit Teilzeit-Kapazität", sublabel: "Neben dem Tagesgeschäft", score: 2 },
      { label: "Feste Ansprechperson mit Zeitbudget", sublabel: "Regelmäßige Abstimmung möglich", score: 3 },
      { label: "Eigenes kleines Team oder Rolle", sublabel: "Dediziert für KI-Vorhaben", score: 4 },
    ],
  },
];
