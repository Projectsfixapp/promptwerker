export type ProcessStep = { title: string; text: string };
export type Benefit = { title: string; text: string };
export type FaqItem = { q: string; a: string };

export type ServiceContent = {
  painPoints: string[];
  process: ProcessStep[];
  benefits: Benefit[];
  useCase: { title: string; text: string[] };
  faq: FaqItem[];
  finalCta: { headline: string; text: string; button: string };
};

export const serviceContent: Record<string, ServiceContent> = {
  "voice-agenten": {
    painPoints: [
      "Anrufe außerhalb der Geschäftszeiten landen auf der Mailbox — und die hört selten jemand ab.",
      "Dein Team hängt am Telefon mit Standardfragen, statt sich um die Anfragen zu kümmern, die wirklich Umsatz bringen.",
      "Jeder verpasste Anruf ist ein Interessent, der eine Seite weiterklickt — zu deiner Konkurrenz.",
      "Termine werden händisch koordiniert, mehrfach hin- und hertelefoniert, bis ein Slot passt.",
    ],
    process: [
      {
        title: "Gesprächsanalyse",
        text: "Wir hören uns deine typischen Anrufe an: Welche Fragen kommen wirklich, wo hakt es, welche Anliegen brauchen einen Menschen.",
      },
      {
        title: "Agent bauen & trainieren",
        text: "Der Voice-Agent bekommt dein Vokabular, deine Leistungen und einen klaren Eskalationspfad für alles, was zu komplex für Automatisierung ist.",
      },
      {
        title: "Anbindung an Telefonie & Kalender",
        text: "Integration in deine bestehende Rufnummer oder eine neue Leitung, direkte Terminbuchung in deinem Kalender-Tool.",
      },
      {
        title: "Livebetrieb & Feinschliff",
        text: "Erste echte Gespräche laufen, wir werten Transkripte aus und schärfen den Agent nach — bis die Übergabequote an Menschen stimmt.",
      },
    ],
    benefits: [
      { title: "Rund um die Uhr erreichbar", text: "Kein Anruf landet mehr unbeantwortet in der Mailbox — auch abends und am Wochenende nicht." },
      { title: "Entlastet dein Team", text: "Standardfragen und Terminbuchungen laufen automatisch, dein Team kümmert sich um die Fälle, die wirklich Aufmerksamkeit brauchen." },
      { title: "Nahtlose Übergabe", text: "Wird es komplex, übergibt der Agent mit vollständigem Kontext an einen Menschen — niemand muss sich wiederholen." },
      { title: "Direkte Terminbuchung", text: "Statt Rückrufnotiz landet der Termin sofort im richtigen Kalender, ohne weiteres Hin und Her." },
    ],
    useCase: {
      title: "Beispiel: Handwerksbetrieb mit Dauerklingeln",
      text: [
        "Ein Handwerksbetrieb aus unserem Netzwerk verlor jeden Tag mehrere Anrufe, weil das Team auf Baustellen unterwegs war und niemand ans Telefon ging.",
        "Der Voice-Agent nimmt jetzt jeden Anruf an, erfasst Anliegen und Adresse, schätzt die Dringlichkeit ein und bucht bei Standardanfragen direkt einen Vor-Ort-Termin.",
        "Nur noch komplexe Sonderfälle landen als Rückruf-Aufgabe beim Team — mit vollständiger Gesprächszusammenfassung, kein Nachfragen mehr nötig.",
      ],
    },
    faq: [
      { q: "Klingt der Agent wie ein Roboter?", a: "Nein. Moderne Sprachmodelle führen natürliche Gespräche mit Pausen, Rückfragen und Kontextverständnis — die meisten Anrufer merken den Unterschied erst auf den zweiten Blick." },
      { q: "Was passiert bei komplizierten Anliegen?", a: "Der Agent erkennt, wenn ein Fall über sein Skript hinausgeht, und eskaliert an einen Menschen — mit vollständigem Gesprächskontext, damit niemand von vorn anfangen muss." },
      { q: "Brauche ich neue Hardware oder eine neue Rufnummer?", a: "Nein. Die Integration läuft über deine bestehende Telefonanlage oder wahlweise über eine neue Rufnummer — kein Hardware-Tausch nötig." },
      { q: "Wie lange dauert die Einrichtung?", a: "Je nach Komplexität deiner Prozesse rechnen wir mit wenigen Wochen von der Gesprächsanalyse bis zum Livebetrieb." },
    ],
    finalCta: {
      headline: "Bereit, dass dein Telefon nie wieder unbeantwortet klingelt?",
      text: "Im kostenlosen Analysegespräch schauen wir uns deine Anruf-Situation an und sagen dir ehrlich, ob und wie sich ein Voice-Agent für dich lohnt.",
      button: "Kostenloses Analysegespräch buchen",
    },
  },

  "workflow-automatisierung": {
    painPoints: [
      "Anfragen aus dem Formular werden von Hand ins CRM übertragen — Copy-Paste, jeden Tag.",
      "Angebote entstehen manuell aus Vorlagen, Status-Updates gehen im Trubel unter.",
      "Jedes neue Tool bedeutet eine neue Insel — Daten wandern nicht automatisch zwischen den Systemen.",
      "No-Code-Verkettungen brechen bei jedem Update eines Drittanbieters und müssen ständig nachgepflegt werden.",
    ],
    process: [
      {
        title: "Prozess-Audit",
        text: "Wir zeichnen gemeinsam auf, wo in deinem Betrieb Zeit für manuelle Übertragungen zwischen Systemen draufgeht.",
      },
      {
        title: "Architektur entwerfen",
        text: "Statt brüchiger No-Code-Ketten planen wir direkte API-Verbindungen zwischen deinen bestehenden Tools — wartbar und stabil.",
      },
      {
        title: "An echtem Beispiel bauen",
        text: "Jeder Workflow wird an einem realen Fall aus deinem Betrieb entwickelt und getestet, bevor er live geht.",
      },
      {
        title: "Übergabe & Betreuung",
        text: "Du bekommst eine klare Dokumentation, wir bleiben ansprechbar, wenn sich Prozesse oder Tools später ändern.",
      },
    ],
    benefits: [
      { title: "Kein Copy-Paste mehr", text: "Daten fließen automatisch zwischen deinen Systemen — von der Anfrage bis zur Rechnung." },
      { title: "Wartbar statt brüchig", text: "Echte API-Anbindungen statt No-Code-Ketten, die bei jedem Drittanbieter-Update reißen." },
      { title: "An deinem Betrieb gebaut", text: "Kein Standard-Template — jeder Workflow wird an einem echten Fall aus deinem Alltag entwickelt und getestet." },
      { title: "Zeit für das Wesentliche", text: "Dein Team verbringt Arbeitszeit mit Entscheidungen, nicht mit Datenübertragung." },
    ],
    useCase: {
      title: "Beispiel: Vom Formular zur Rechnung ohne Handarbeit",
      text: [
        "Ein Dienstleistungsunternehmen bekam täglich Dutzende Anfragen über das Kontaktformular — jede wurde händisch ins CRM übertragen, dann folgte ein manuelles Angebot.",
        "Wir haben eine direkte Verbindung zwischen Formular, CRM und Angebotstool gebaut: Jede Anfrage landet automatisch im richtigen Status, ein Angebots-Entwurf wird vorbereitet, das Team muss nur noch prüfen und versenden.",
        "Die Zeit bis zum ersten Angebot ist von einem Tag auf wenige Minuten gesunken.",
      ],
    },
    faq: [
      { q: "Ersetzt ihr Zapier oder Make?", a: "Wir bauen bewusst keine Zapier-/Make-Ketten. Direkte API-Integrationen sind stabiler und brechen nicht bei jedem Drittanbieter-Update." },
      { q: "Was, wenn wir später ein Tool wechseln?", a: "Die Architektur ist modular gebaut — einzelne Anbindungen lassen sich austauschen, ohne den gesamten Workflow neu zu bauen." },
      { q: "Müssen wir unsere bestehenden Tools ablösen?", a: "Nein. Wir binden deine bestehenden Systeme an, statt sie zu ersetzen — der Wechsel-Aufwand bleibt bei dir minimal." },
      { q: "Wie schnell sehen wir Ergebnisse?", a: "Der erste Workflow wird an einem echten Beispiel gebaut und getestet, bevor er live geht — meist innerhalb weniger Wochen." },
    ],
    finalCta: {
      headline: "Wie viele Stunden gehen bei dir für Copy-Paste zwischen Systemen drauf?",
      text: "Im kostenlosen Analysegespräch identifizieren wir deine größten Zeitfresser und zeigen, was sich automatisieren lässt.",
      button: "Workflow-Potenzial analysieren",
    },
  },

  "lead-sales-autopilot": {
    painPoints: [
      "Nicht jeder Lead wird gleich behandelt — dein Vertrieb verbringt Zeit mit Anfragen, die nie kaufen.",
      "Follow-ups gehen im Tagesgeschäft unter, der richtige Moment für den nächsten Kontakt verstreicht.",
      "Entscheidungen über Priorisierung laufen nach Bauchgefühl statt nach echten Signalen.",
      "Abgeschlossene Deals werden nicht systematisch ausgewertet — die gleichen Fehler wiederholen sich.",
    ],
    process: [
      {
        title: "Scoring-Kriterien festlegen",
        text: "Gemeinsam definieren wir, was einen guten Lead bei dir ausmacht — Branche, Unternehmensgröße, Verhalten, Budget-Signale.",
      },
      {
        title: "Automatisches Scoring & Anreicherung",
        text: "Eingehende Leads werden automatisch bewertet und mit zusätzlichen Informationen angereichert, bevor dein Vertrieb sie sieht.",
      },
      {
        title: "Follow-up-Automation",
        text: "Follow-ups laufen automatisiert weiter — per E-Mail oder als vorbereitete Aufgabe für dein Team, zum richtigen Zeitpunkt.",
      },
      {
        title: "Lernschleife einbauen",
        text: "Das System lernt aus abgeschlossenen Deals, welche Signale tatsächlich auf einen Abschluss hindeuten, und schärft die Bewertung nach.",
      },
    ],
    benefits: [
      { title: "Vertrieb fokussiert sich richtig", text: "Dein Team sieht zuerst die Leads, die wirklich Potenzial haben." },
      { title: "Kein Follow-up geht unter", text: "Automatisierte Erinnerungen und Nachfassaktionen laufen im Hintergrund weiter." },
      { title: "Datenbasiert statt Bauchgefühl", text: "Priorisierung nach echten Signalen aus deinen bisherigen Abschlüssen." },
      { title: "Lernt kontinuierlich dazu", text: "Das Scoring wird mit jedem abgeschlossenen Deal präziser." },
    ],
    useCase: {
      title: "Beispiel: Vom Anfrage-Wust zur klaren Priorität",
      text: [
        "Ein B2B-Dienstleister bekam über verschiedene Kanäle mehr Anfragen, als der Vertrieb zeitnah bearbeiten konnte — die vielversprechendsten gingen im Stapel unter.",
        "Wir haben ein Scoring-System aufgesetzt, das eingehende Leads nach Branche, Unternehmensgröße und Anfrage-Verhalten bewertet und automatisch priorisiert.",
        "Der Vertrieb ruft jetzt zuerst die Leads mit der höchsten Abschlusswahrscheinlichkeit an — die durchschnittliche Reaktionszeit auf heiße Leads sank deutlich.",
      ],
    },
    faq: [
      { q: "Woher weiß das System, was ein guter Lead ist?", a: "Wir definieren die Scoring-Kriterien gemeinsam mit dir und trainieren das System zusätzlich mit Daten aus deinen bisherigen Abschlüssen." },
      { q: "Ersetzt das unseren Vertrieb?", a: "Nein. Das System sortiert und priorisiert vor — die Entscheidung und das Gespräch bleiben bei deinem Team." },
      { q: "Funktioniert das mit unserem bestehenden CRM?", a: "Ja, die Anbindung erfolgt an dein bestehendes CRM-System, siehe auch unsere CRM-Anbindung." },
      { q: "Ab welcher Lead-Menge lohnt sich das?", a: "Schon ab einigen Dutzend Anfragen im Monat macht sich systematisches Scoring in der Vertriebszeit bemerkbar — wir prüfen das im Analysegespräch für deinen konkreten Fall." },
    ],
    finalCta: {
      headline: "Willst du wissen, welche deiner Leads wirklich Potenzial haben?",
      text: "Im kostenlosen Analysegespräch schauen wir uns deinen aktuellen Lead-Prozess an und zeigen, wo Scoring und Automatisierung ansetzen.",
      button: "Sales-Autopilot Use Case ansehen",
    },
  },

  "crm-anbindung": {
    painPoints: [
      "Kontakte und Aktivitäten liegen verstreut in mehreren Tools statt an einem Ort.",
      "Zapier-Ketten brechen, sobald ein Drittanbieter seine API ändert — und niemand merkt es sofort.",
      "Vertrieb und Marketing arbeiten mit unterschiedlichem Datenstand, weil nichts automatisch synchron ist.",
      "Neue Systeme lassen sich nicht sauber anbinden, weil die Architektur dafür nie geplant wurde.",
    ],
    process: [
      {
        title: "Bestandsaufnahme",
        text: "Wir schauen uns an, welches CRM du einsetzt und welche weiteren Systeme Daten liefern oder brauchen.",
      },
      {
        title: "Direkte API-Anbindung",
        text: "Egal ob SAP, Salesforce, HubSpot oder ein anderes System — wir binden es per direkter API an, keine brüchige No-Code-Kette.",
      },
      {
        title: "Synchronisation einrichten",
        text: "Leads, Kontakte und Aktivitäten aus allen angebundenen Systemen landen automatisch dort, wo sie gebraucht werden.",
      },
      {
        title: "Live-Schaltung & Betreuung",
        text: "Sobald Verträge und Zugänge vorliegen, richten wir die Live-Anbindung gemeinsam mit deinem Team ein und betreuen sie danach weiter.",
      },
    ],
    benefits: [
      { title: "Ein Datenstand für alle", text: "Vertrieb, Marketing und Service arbeiten mit denselben, aktuellen Informationen." },
      { title: "Wartbare Integration", text: "Direkte, dokumentierte API-Anbindungen statt Zapier-Ketten, die bei jedem Update reißen können." },
      { title: "Egal welches CRM", text: "SAP, Salesforce, HubSpot oder ein anderes System — die Anbindung wird auf dein Setup zugeschnitten." },
      { title: "Wir betreuen die Anbindung", text: "Auch nach dem Go-Live bleiben wir Ansprechpartner, wenn sich Systeme oder Anforderungen ändern." },
    ],
    useCase: {
      title: "Beispiel: Drei Systeme, ein Datenstand",
      text: [
        "Ein mittelständisches Unternehmen nutzte HubSpot für Marketing, ein separates Tool für den Vertrieb und ein drittes für den Kundenservice — Kontakte mussten mehrfach händisch gepflegt werden.",
        "Wir haben eine direkte API-Anbindung zwischen allen drei Systemen gebaut, sodass Kontakte, Aktivitäten und Status automatisch synchron bleiben.",
        "Heute sieht jede Abteilung denselben, aktuellen Stand — ohne manuellen Abgleich, ohne Excel-Zwischenschritt.",
      ],
    },
    faq: [
      { q: "Welche CRM-Systeme bindet ihr an?", a: "SAP, Salesforce, HubSpot und weitere — die konkrete Anbindung richtet sich nach deinem bestehenden Setup." },
      { q: "Brauchen wir schon Live-Zugänge?", a: "Nein. Ohne Live-Zugänge bereiten wir die Architektur vor (Webhook-Empfänger, API-Client-Gerüste), die Live-Schaltung folgt, sobald Verträge und Zugänge vorliegen." },
      { q: "Warum keine Zapier-Kette?", a: "Zapier-Ketten sind schnell aufgesetzt, brechen aber bei API-Änderungen eines Drittanbieters oft unbemerkt. Direkte Integrationen sind stabiler und von uns betreut." },
      { q: "Was kostet eine CRM-Anbindung?", a: "Das hängt von der Anzahl der Systeme und der Komplexität deiner Prozesse ab — wir geben dir im Analysegespräch eine ehrliche Einschätzung." },
    ],
    finalCta: {
      headline: "Wie viele Systeme sprechen bei dir aktuell nicht miteinander?",
      text: "Im kostenlosen Analysegespräch schauen wir uns dein CRM-Setup an und zeigen, was sich direkt verbinden lässt.",
      button: "CRM-Integration besprechen",
    },
  },

  "dsgvo-ai-act": {
    painPoints: [
      "Du weißt nicht, in welche Risikoklasse dein KI-Einsatz laut EU AI Act fällt.",
      "Datenschutz-Folgenabschätzungen wirken wie Bürokratie-Monster ohne klaren Startpunkt.",
      "Externe KI-Tools verarbeiten Kundendaten, ohne dass ihr wisst, wo diese landen.",
      "Bei einer Prüfung fehlt euch die Dokumentation, um Entscheidungen nachzuweisen.",
    ],
    process: [
      { title: "Risikoeinordnung", text: "Wir klassifizieren deinen KI-Einsatz nach den Kategorien des EU AI Act (minimal, begrenzt, hoch, verboten) und zeigen, welche Pflichten daraus folgen." },
      { title: "Datenschutz-Folgenabschätzung", text: "Für Systeme mit höherem Risiko erstellen wir gemeinsam die nötige Folgenabschätzung — verständlich, nicht als Textwüste." },
      { title: "Technische & organisatorische Maßnahmen", text: "Wir definieren konkrete Maßnahmen (Zugriffsrechte, Löschkonzepte, Protokollierung), die zu deinem System passen." },
      { title: "Dokumentation & Nachweis", text: "Am Ende steht eine Dokumentation, die im Zweifel als Nachweis gegenüber Behörden oder Kunden dient." },
    ],
    benefits: [
      { title: "Rechtssicherheit statt Bauchgefühl", text: "Du weißt genau, wo dein KI-Einsatz regulatorisch steht — keine Grauzone." },
      { title: "Keine Nacharbeiten", text: "Compliance wird von Anfang an mitgebaut, nicht nachträglich draufgesetzt." },
      { title: "Verständliche Dokumentation", text: "Keine Juristensprache — Unterlagen, die du und dein Team wirklich verstehen und nutzen." },
      { title: "Vertrauen bei Kunden & Partnern", text: "Rechtssichere KI-Systeme sind ein Verkaufsargument, kein Hindernis." },
    ],
    useCase: {
      title: "Beispiel: KI-Chatbot ohne Datenschutz-Blackbox",
      text: [
        "Ein Unternehmen wollte einen KI-Chatbot für den Kundenservice einführen, war aber unsicher, ob Kundendaten dabei rechtskonform verarbeitet werden.",
        "Wir haben den Anwendungsfall nach EU AI Act eingeordnet, eine schlanke Datenschutz-Folgenabschätzung erstellt und die Datenverarbeitung so konfiguriert, dass sensible Daten gar nicht erst an externe Modelle gehen.",
        "Das Unternehmen konnte den Chatbot mit klarer Dokumentation gegenüber der eigenen Rechtsabteilung und Kunden begründen.",
      ],
    },
    faq: [
      { q: "Betrifft der EU AI Act auch kleine Unternehmen?", a: "Ja. Die Pflichten richten sich nach dem Risiko des KI-Einsatzes, nicht nach Unternehmensgröße — auch kleinere Betriebe mit risikoreicheren Anwendungen sind betroffen." },
      { q: "Was passiert bei einem Verstoß?", a: "Je nach Verstoß drohen Bußgelder analog zur DSGVO-Systematik — bis zu einem hohen Prozentsatz des Jahresumsatzes bei schweren Verstößen." },
      { q: "Gibt es Förderprogramme, die uns dabei unterstützen?", a: "Für Digitalisierungs- und KI-Projekte gibt es je nach Bundesland und Branche Förderprogramme wie 'go-digital' oder 'Digital Jetzt' — wir ordnen im Analysegespräch ein, ob dein Vorhaben infrage kommt." },
      { q: "Reicht eine einmalige Prüfung?", a: "Nein. Regulatorik und dein System entwickeln sich weiter — wir empfehlen eine regelmäßige Überprüfung, keine einmalige Checkliste." },
    ],
    finalCta: {
      headline: "Ist dein KI-Einsatz rechtlich auf sicherem Boden?",
      text: "Im kostenlosen Analysegespräch ordnen wir deinen Anwendungsfall nach EU AI Act ein und zeigen, welche Schritte wirklich nötig sind.",
      button: "Compliance-Check anfragen",
    },
  },

  "strategie-roadmap": {
    painPoints: [
      "Ihr habt schon ein KI-Pilotprojekt gestartet, aber niemand weiß, wie es weitergehen soll.",
      "Jede Abteilung testet eigene KI-Tools, ohne gemeinsame Linie.",
      "Ihr wisst nicht, wo im Unternehmen KI wirklich Wirkung hätte — und wo es nur Spielerei wäre.",
      "Investitionsentscheidungen werden vertagt, weil niemand eine belastbare Priorisierung liefert.",
    ],
    process: [
      { title: "Ist-Analyse", text: "Wir verschaffen uns einen Überblick über bestehende Prozesse, Systeme und laufende KI-Initiativen." },
      { title: "Potenzial-Bewertung", text: "Gemeinsam bewerten wir mögliche KI-Anwendungsfälle nach Aufwand und Wirkung — keine Wunschliste, sondern Priorisierung." },
      { title: "Roadmap erstellen", text: "Die priorisierten Schritte werden in eine realistische Zeitschiene mit klaren Meilensteinen gegossen." },
      { title: "Begleitung bei der Umsetzung", text: "Auf Wunsch begleiten wir die Umsetzung der Roadmap-Schritte, statt nur eine Folie zu übergeben." },
    ],
    benefits: [
      { title: "Priorisiert statt beliebig", text: "Ihr wisst, welcher Schritt zuerst kommt und warum." },
      { title: "Realistische Aufwände", text: "Keine Schönrechnerei — ehrliche Einschätzung von Zeit und Ressourcen." },
      { title: "Geschäftsproblem zuerst", text: "Die Technologie wird passend zum Problem gewählt, nicht umgekehrt." },
      { title: "Umsetzbar statt Theorie", text: "Die Roadmap ist eine Arbeitsgrundlage, keine Hochglanz-Präsentation für die Schublade." },
    ],
    useCase: {
      title: "Beispiel: Von der Tool-Wildwuchs-Situation zur klaren Linie",
      text: [
        "Ein mittelständisches Unternehmen hatte in drei Abteilungen unabhängig voneinander KI-Tools eingeführt — ohne gemeinsame Strategie, mit doppeltem Aufwand.",
        "Wir haben eine Ist-Analyse gemacht, alle laufenden Initiativen bewertet und eine gemeinsame Roadmap mit drei priorisierten Schritten für die nächsten zwölf Monate erstellt.",
        "Die Geschäftsführung hat jetzt eine klare Entscheidungsgrundlage statt drei parallele, unkoordinierte Projekte.",
      ],
    },
    faq: [
      { q: "Brauchen wir schon KI-Erfahrung für ein Strategiegespräch?", a: "Nein, im Gegenteil — gerade wenn ihr am Anfang steht, hilft eine klare Roadmap, Fehlinvestitionen zu vermeiden." },
      { q: "Wie lange dauert eine Strategie-Erstellung?", a: "Je nach Umfang wenige Wochen von der Ist-Analyse bis zur fertigen Roadmap." },
      { q: "Setzt ihr die Roadmap auch um?", a: "Ja, auf Wunsch begleiten wir die Umsetzung — von Voice-Agenten über Workflow-Automatisierung bis CRM-Anbindung." },
      { q: "Was kostet eine Strategie-Beratung?", a: "Das hängt vom Umfang ab — wir geben dir im Analysegespräch eine ehrliche Einschätzung." },
    ],
    finalCta: {
      headline: "Weißt du, welcher KI-Schritt bei dir wirklich zuerst kommt?",
      text: "Im kostenlosen Analysegespräch verschaffen wir uns einen Überblick über dein Potenzial und zeigen die sinnvolle Reihenfolge.",
      button: "Strategiegespräch vereinbaren",
    },
  },

  "rag-systeme": {
    painPoints: [
      "Mitarbeiter suchen Informationen mühsam in mehreren Wikis, Ordnern und Tools zusammen.",
      "Ein Standard-Chatbot erfindet Antworten, die überzeugend klingen, aber falsch sind.",
      "Neues Wissen landet in Dokumenten, die niemand mehr findet, sobald sie älter als ein paar Wochen sind.",
      "Der Support beantwortet dieselben Fragen immer wieder, weil das Wissen nicht zentral zugänglich ist.",
    ],
    process: [
      { title: "Wissensquellen sichten", text: "Wir identifizieren, wo dein relevantes Wissen liegt — Dokumente, Wikis, Tickets, Produktdaten." },
      { title: "Wissensbasis aufbauen", text: "Die Quellen werden strukturiert aufbereitet und durchsuchbar gemacht, mit Versionierung für Aktualität." },
      { title: "KI-Anbindung", text: "Das Sprachmodell wird so angebunden, dass es ausschließlich auf Basis deiner echten Quellen antwortet, inklusive Quellenangabe." },
      { title: "Testing & Feinschliff", text: "Wir prüfen mit echten Fragen aus deinem Alltag, ob die Antworten stimmen, und schärfen nach." },
    ],
    benefits: [
      { title: "Antworten mit Quelle", text: "Jede Antwort lässt sich auf ein echtes Dokument zurückführen, keine Blackbox." },
      { title: "Weniger Halluzinationen", text: "Die KI antwortet auf Basis deiner echten Daten statt zu raten." },
      { title: "Zentrale Wissensbasis", text: "Ein Zugang statt verstreuter Wikis, Ordner und Tools." },
      { title: "Entlastet Support & Onboarding", text: "Wiederkehrende Fragen werden automatisch beantwortet, neue Mitarbeiter finden sich schneller zurecht." },
    ],
    useCase: {
      title: "Beispiel: Interne Wissensbasis für den Kundenservice",
      text: [
        "Ein Unternehmen mit umfangreicher Produktpalette hatte sein Wissen auf Handbücher, ein internes Wiki und die Erfahrung einzelner Mitarbeiter verteilt.",
        "Wir haben eine RAG-Wissensbasis aus allen relevanten Quellen aufgebaut und an ein Chat-Interface angebunden, das der Support direkt nutzt.",
        "Antwortzeiten auf komplexe Produktfragen sind spürbar gesunken, neue Support-Mitarbeiter sind schneller einsatzbereit.",
      ],
    },
    faq: [
      { q: "Was ist der Unterschied zu ChatGPT?", a: "Standard-Modelle kennen nur ihr Trainingswissen. Ein RAG-System durchsucht zusätzlich deine eigenen, aktuellen Unternehmensdaten und antwortet darauf basierend." },
      { q: "Bleiben unsere Daten bei uns?", a: "Die Architektur wird so gebaut, dass sensible Daten nicht unkontrolliert an externe Anbieter gehen — Details klären wir passend zu deinem Datenschutz-Anspruch." },
      { q: "Wie aktuell sind die Antworten?", a: "Die Wissensbasis lässt sich laufend aktualisieren — neue Dokumente stehen der KI zeitnah zur Verfügung." },
      { q: "Für welche Unternehmensgröße lohnt sich das?", a: "Schon bei überschaubaren, aber verstreuten Wissensbeständen macht sich ein RAG-System bemerkbar — wir prüfen das im Analysegespräch für deinen Fall." },
    ],
    finalCta: {
      headline: "Wie viel Zeit geht bei euch für Informationssuche drauf?",
      text: "Im kostenlosen Analysegespräch schauen wir uns dein Unternehmenswissen an und zeigen, ob sich ein RAG-System lohnt.",
      button: "RAG-Potenzial prüfen",
    },
  },

  "implementierung-loesungen": {
    painPoints: [
      "Ihr habt ein KI-Konzept, aber niemanden, der es tatsächlich baut.",
      "Prototypen funktionieren in der Demo, aber nie im echten Betrieb.",
      "Nach dem Go-Live ist niemand mehr für Wartung und Weiterentwicklung zuständig.",
      "Interne IT-Kapazität fehlt, um ein KI-Projekt neben dem Tagesgeschäft umzusetzen.",
    ],
    process: [
      { title: "Discovery", text: "Wir klären Anforderungen, Systemlandschaft und Erfolgskriterien, bevor eine Zeile Code entsteht." },
      { title: "Prototyp (PoC)", text: "Ein funktionsfähiger Prototyp zeigt früh, ob die Lösung trägt — mit echten Daten, nicht nur Demo-Daten." },
      { title: "Produktive Implementierung", text: "Der Prototyp wird zu einem stabilen, produktiven System ausgebaut, inklusive Anbindung an deine bestehenden Tools." },
      { title: "Go-Live & Monitoring", text: "Nach dem Launch behalten wir das System im Blick und passen es bei Bedarf an — kein Projekt, das nach der Übergabe verwaist." },
    ],
    benefits: [
      { title: "Sichtbarer Fortschritt in jeder Phase", text: "Kein monatelanges Konzeptpapier ohne Ergebnis." },
      { title: "Prototyp mit echten Daten", text: "Frühe Tests mit deinen echten Fällen statt Hochglanz-Demo." },
      { title: "Betreuung nach Go-Live", text: "Wir bleiben Ansprechpartner, wenn sich Anforderungen oder Systeme ändern." },
      { title: "Passt zu deiner IT-Landschaft", text: "Integration in bestehende Systeme statt Insellösung." },
    ],
    useCase: {
      title: "Beispiel: Vom Konzeptpapier zum laufenden System in wenigen Wochen",
      text: [
        "Ein Unternehmen hatte ein fertiges KI-Konzept von einer Beratung erhalten — aber keine Kapazität, es intern umzusetzen.",
        "Wir haben das Konzept in einem ersten Prototyp mit echten Daten getestet, dann die produktive Version gebaut und an die bestehende Systemlandschaft angebunden.",
        "Innerhalb weniger Wochen lief das System produktiv, inklusive laufender Betreuung durch uns.",
      ],
    },
    faq: [
      { q: "Übernehmt ihr auch fertige Konzepte anderer Berater?", a: "Ja, wir prüfen ein bestehendes Konzept auf Umsetzbarkeit und bauen es bei Bedarf direkt um." },
      { q: "Was passiert nach dem Go-Live?", a: "Wir bleiben ansprechbar für Wartung, Anpassungen und Weiterentwicklung — kein Projekt, das nach der Übergabe verwaist." },
      { q: "Wie lange dauert eine Implementierung?", a: "Abhängig vom Umfang — ein erster Prototyp steht meist innerhalb weniger Wochen, die produktive Version danach." },
      { q: "Braucht ihr Zugriff auf unsere Systeme?", a: "Für die Integration ja, im Umfang, der für die jeweilige Anbindung nötig ist — abgestimmt mit deiner IT." },
    ],
    finalCta: {
      headline: "Habt ihr ein KI-Konzept, dem die Umsetzung fehlt?",
      text: "Im kostenlosen Analysegespräch schauen wir uns dein Vorhaben an und sagen dir ehrlich, was bis zum laufenden System nötig ist.",
      button: "Umsetzung besprechen",
    },
  },

  "schulungen-fachvortraege": {
    painPoints: [
      "Ein neues KI-Tool wurde eingeführt, aber kaum jemand nutzt es wirklich.",
      "Mitarbeiter sind unsicher, was mit KI-Tools erlaubt ist und was nicht.",
      "Es gibt Berührungsängste — KI wird als Bedrohung statt als Werkzeug wahrgenommen.",
      "Führungskräfte sollen KI verstehen, aber niemand erklärt es verständlich.",
    ],
    process: [
      { title: "Bedarf klären", text: "Wir besprechen, welches Team welche Werkzeuge im Alltag nutzt und wo Unsicherheit besteht." },
      { title: "Praxisnahe Inhalte entwickeln", text: "Die Schulung wird an euren echten Tools und Abläufen ausgerichtet, nicht an generischen Folien." },
      { title: "Schulung durchführen", text: "Vor Ort oder remote, mit praktischen Übungen statt reiner Theorie." },
      { title: "Nachbereitung & Fragen", text: "Im Nachgang bleiben wir für Rückfragen erreichbar, statt nach dem Termin abzutauchen." },
    ],
    benefits: [
      { title: "Praxisnah statt abstrakt", text: "Inhalte an euren echten Tools und Prozessen, keine generischen KI-Grundlagen." },
      { title: "Mehr Akzeptanz im Team", text: "Verständnis baut Berührungsängste ab und erhöht die tatsächliche Nutzung." },
      { title: "Klare Leitplanken", text: "Mitarbeiter wissen, was mit KI-Tools erlaubt ist und was nicht." },
      { title: "Für jede Zielgruppe passend", text: "Von der praktischen Team-Schulung bis zum Fachvortrag für die Führungsebene." },
    ],
    useCase: {
      title: "Beispiel: Von Tool-Frust zu echter Nutzung",
      text: [
        "Ein Unternehmen hatte ein KI-Tool für die Angebotserstellung eingeführt — nach drei Monaten nutzten es nur zwei von zehn Mitarbeitenden.",
        "Wir haben eine praxisnahe Schulung direkt am echten Tool durchgeführt, inklusive der Fälle, die dem Team bisher Probleme bereitet hatten.",
        "Die Nutzung stieg deutlich, weil das Team verstand, wofür das Tool wirklich gedacht ist und wo seine Grenzen liegen.",
      ],
    },
    faq: [
      { q: "Für wen eignen sich die Schulungen?", a: "Von einzelnen Teams bis zur gesamten Belegschaft — wir passen Inhalt und Tiefe an die Zielgruppe an." },
      { q: "Braucht unser Team Vorwissen?", a: "Nein, die Schulungen sind so aufgebaut, dass sie ohne KI-Vorwissen funktionieren." },
      { q: "Bietet ihr auch Vorträge für Führungskräfte an?", a: "Ja, als eigenständiges Format oder ergänzend zur Team-Schulung — mit Fokus auf strategischen Überblick statt Tool-Bedienung." },
      { q: "Findet die Schulung remote oder vor Ort statt?", a: "Beides ist möglich, je nachdem, was für euer Team besser passt." },
    ],
    finalCta: {
      headline: "Nutzt dein Team eure KI-Tools wirklich — oder nur auf dem Papier?",
      text: "Im kostenlosen Analysegespräch klären wir, welche Schulung euren größten Hebel bringt.",
      button: "Schulung anfragen",
    },
  },

  "use-cases": {
    painPoints: [
      "Ihr könnt euch unter 'KI im Unternehmen' konkret nichts vorstellen.",
      "Anbieter versprechen viel, zeigen aber keine echten Beispiele aus eurer Branche.",
      "Ihr wisst nicht, ob euer Anwendungsfall überhaupt realistisch umsetzbar ist.",
      "Budget-Entscheidungen fehlt die Vergleichsgrundlage, was andere Unternehmen bereits erreicht haben.",
    ],
    process: [
      { title: "Anwendungsfall einordnen", text: "Wir hören uns euer Anliegen an und ordnen es einem ähnlichen, bereits umgesetzten Szenario zu." },
      { title: "Machbarkeit prüfen", text: "Ehrliche Einschätzung, ob und wie sich der Fall in eurem Setup umsetzen lässt." },
      { title: "Angepasste Lösung skizzieren", text: "Aus dem Vergleichsfall wird eine auf euch zugeschnittene Lösung, kein 1:1-Kopieren." },
      { title: "Umsetzung wie gewohnt", text: "Ab hier läuft der Prozess wie bei jedem unserer Projekte: Prototyp, Test, produktives System." },
    ],
    benefits: [
      { title: "Konkret statt abstrakt", text: "Echte Szenarien statt allgemeiner KI-Versprechen." },
      { title: "Branchenübergreifende Erfahrung", text: "Muster aus verschiedenen Branchen fließen in eure Lösung ein." },
      { title: "Realistische Erwartungen", text: "Ihr seht, was ein KI-System wirklich leisten kann — und was nicht." },
      { title: "Schnellerer Einstieg", text: "Ein bekanntes Muster als Ausgangspunkt beschleunigt die erste Einschätzung." },
    ],
    useCase: {
      title: "Ein Ausschnitt möglicher Szenarien",
      text: [
        "Handwerksbetrieb: Voice-Agent nimmt Anrufe außerhalb der Geschäftszeiten an und bucht Vor-Ort-Termine direkt in den Kalender.",
        "B2B-Dienstleister: Lead-Scoring priorisiert eingehende Anfragen automatisch, der Vertrieb ruft zuerst die vielversprechendsten Kontakte an.",
        "Unternehmen mit mehreren Tools: Direkte CRM-Anbindung sorgt dafür, dass Vertrieb, Marketing und Service denselben aktuellen Datenstand sehen.",
        "Unternehmen mit großem Produktkatalog: RAG-Wissensbasis beantwortet Support-Anfragen mit Quellenangabe aus echten Produktdaten.",
      ],
    },
    faq: [
      { q: "Sind die Beispiele auf meine Branche übertragbar?", a: "Die konkrete Umsetzung unterscheidet sich, aber die Muster dahinter — Automatisierung, Priorisierung, Wissenszugriff — lassen sich meist übertragen." },
      { q: "Kann ich ein Beispiel 1:1 übernehmen?", a: "Als Ausgangspunkt ja, angepasst an dein Setup — ein reines Kopieren würde deinen echten Prozessen selten gerecht." },
      { q: "Was, wenn mein Fall in keinem Beispiel vorkommt?", a: "Dann schauen wir uns dein Anliegen im Analysegespräch individuell an — die gezeigten Fälle sind Ausschnitt, nicht Grenze." },
      { q: "Wie schnell lässt sich ein ähnlicher Fall bei uns umsetzen?", a: "Das hängt von eurem Setup ab — eine erste Einschätzung bekommst du im kostenlosen Analysegespräch." },
    ],
    finalCta: {
      headline: "Welches Szenario passt am ehesten zu deinem Unternehmen?",
      text: "Im kostenlosen Analysegespräch ordnen wir deinen Fall ein und zeigen, was realistisch umsetzbar ist.",
      button: "Meinen Use Case besprechen",
    },
  },
};
