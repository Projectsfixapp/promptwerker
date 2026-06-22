export type Topic = {
  id: string;
  eyebrow: string;
  title: string;
  short: string;
  detail: string[];
  cta: string;
  side: "left" | "right";
  /** Karte ausblenden ohne sie zu löschen: einfach auf false setzen. */
  enabled: boolean;
};

// Neue Karte hinzufügen: Objekt nach diesem Schema unten anhängen, side abwechseln.
// Karte ausblenden statt löschen: enabled: false setzen.
export const topics: Topic[] = [
  {
    id: "voice-agenten",
    eyebrow: "Telefonie",
    title: "Voice-Agenten am Telefon",
    short:
      "KI nimmt Anrufe an, qualifiziert Leads und bucht Termine — rund um die Uhr, ohne Warteschlange.",
    detail: [
      "Ihr Telefon klingelt auch außerhalb der Geschäftszeiten. Ein Voice-Agent nimmt ab, führt ein natürliches Gespräch, erfasst Anliegen und Kontaktdaten und bucht bei Bedarf direkt einen Termin in Ihrem Kalender.",
      "Eskalation an einen Menschen passiert automatisch, wenn der Fall komplex wird — der Agent übergibt mit vollem Kontext, niemand muss sich wiederholen.",
      "Integration läuft über Ihre bestehende Telefonanlage oder eine neue Rufnummer, kein Hardware-Tausch nötig.",
    ],
    cta: "Voice-Agent für mein Unternehmen prüfen",
    side: "left",
    enabled: true,
  },
  {
    id: "workflow-automatisierung",
    eyebrow: "Prozesse",
    title: "Workflow-Automatisierung",
    short:
      "Wiederkehrende Abläufe zwischen Ihren Tools laufen automatisch — von der Anfrage bis zur Rechnung.",
    detail: [
      "Viele Stunden pro Woche gehen für Copy-Paste zwischen Systemen verloren: Anfrage aus dem Formular ins CRM, Angebot ins Buchhaltungstool, Status-Update an den Kunden.",
      "Wir bauen die Verbindungen direkt zwischen Ihren bestehenden Systemen — mit echten APIs, nicht mit brüchigen No-Code-Verkettungen, die bei jedem Update neu konfiguriert werden müssen.",
      "Jeder Workflow wird an einem realen Beispiel aus Ihrem Betrieb gebaut und getestet, bevor er live geht.",
    ],
    cta: "Workflow-Potenzial analysieren",
    side: "right",
    enabled: true,
  },
  {
    id: "lead-sales-autopilot",
    eyebrow: "Vertrieb",
    title: "Lead- und Sales-Autopilot",
    short:
      "Eingehende Leads werden automatisch bewertet, angereichert und zur richtigen Zeit angesprochen.",
    detail: [
      "Nicht jeder Lead ist gleich viel wert. Ein Scoring-System bewertet eingehende Anfragen nach Ihren Kriterien und sortiert vor, bevor Ihr Vertrieb überhaupt draufschaut.",
      "Follow-ups, die sonst untergehen, laufen automatisiert weiter — per E-Mail oder als vorbereitete Aufgabe für Ihr Team, im richtigen Moment statt nach Bauchgefühl.",
      "Das System lernt aus abgeschlossenen Deals, welche Signale tatsächlich auf Abschluss hindeuten.",
    ],
    cta: "Sales-Autopilot Use Case ansehen",
    side: "left",
    enabled: true,
  },
  {
    id: "crm-anbindung",
    eyebrow: "Integration",
    title: "CRM-Anbindung",
    short:
      "SAP, Salesforce, HubSpot oder ein anderes System — Ihre Daten bleiben an einem Ort, automatisch synchron.",
    detail: [
      "Egal welches CRM Sie einsetzen: Wir binden es per direkter API an, damit Leads, Kontakte und Aktivitäten aus allen anderen Systemen automatisch dort landen.",
      "Keine Zapier-Kette, die bricht, wenn ein Drittanbieter seine API ändert — direkte, wartbare Integrationen, die wir auch betreuen.",
      "Live-Zugänge bei SAP, Salesforce, HubSpot oder weiteren Systemen werden gemeinsam mit Ihrem Team eingerichtet, sobald Verträge/Zugänge vorliegen.",
    ],
    cta: "CRM-Integration besprechen",
    side: "right",
    enabled: true,
  },
];
