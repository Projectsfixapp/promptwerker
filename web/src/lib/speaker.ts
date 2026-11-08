/* Inhalte der Speaker-Seite /dennis-beichert.

   Regel für jede Zeile hier: nur Aussagen, die an einem echten Artefakt
   belegt sind (Repo, Live-Seite, Messung). Projektstatus steht ausdrücklich
   dabei. Keine Auftrittszahlen, Kundenlogos oder Stimmen, solange keine
   freigegebenen Belege vorliegen — offene Punkte stehen in
   docs/speaker/CONTENT_NEEDED.md. Talks sind Konzept-Talks, keine
   Behauptung, dass sie schon öffentlich gehalten wurden. */

export const speakerPfad = "/dennis-beichert";
export const buehnenBild = "/speaker/03_promptwerker_keynote.jpg";
export const workshopBild = "/speaker/01_workshop_promptwerker.jpg";

export type Talk = {
  id: string;
  titel: string;
  hook: string;
  fuerWen: string;
  anlass: string;
  takeaways: [string, string, string];
  formate: string;
  demo?: string;
  signatur?: boolean;
};

export const talks: Talk[] = [
  {
    id: "kaninchenbau",
    signatur: true,
    titel: "Geschichten aus dem Kaninchenbau",
    hook: "Was beim Bau echter KI-Systeme überraschend gut funktioniert und was spektakulär schiefgeht, erzählt von dem, der es gebaut hat.",
    fuerWen: "Gemischtes Publikum, Führungskräfte, Teams, die mit KI anfangen",
    anlass: "Konferenz-Opener, Kick-off, Jahresauftakt",
    takeaways: [
      "Warum KI-Agenten Ergebnisse melden, die nicht stimmen, und wie man das in zehn Sekunden prüft",
      "Wo der echte Engpass sitzt: meist nicht beim Modell, sondern bei Daten, Abläufen und Kontrolle",
      "Ein Prüfraster für die eigene erste Anwendung, das am Montag funktioniert",
    ],
    formate: "Keynote 30, 45 oder 60 Minuten, auf Wunsch mit Fragerunde",
  },
  {
    id: "kollege-aus-dem-valley",
    titel: "Der neue Kollege aus dem Valley",
    hook: "KI-Agenten übernehmen Arbeit. Welche, wie viel, und was bleibt beim Menschen, gezeigt am eigenen Betrieb.",
    fuerWen: "Geschäftsführung, Bereichsleitungen, HR und Organisationsentwicklung",
    anlass: "Strategietag, Führungskräftetagung, Zukunft-der-Arbeit-Formate",
    takeaways: [
      "Welche Aufgaben ein Agententeam heute verlässlich übernimmt und welche nicht",
      "Wie Wissensdatenbanken und Gedächtnis dafür sorgen, dass Agenten nicht jeden Tag bei null anfangen",
      "Welche Rolle Menschen in einem Team mit Agenten bekommen: Richtung, Freigabe, Verantwortung",
    ],
    formate: "Keynote 45 oder 60 Minuten",
  },
  {
    id: "mittelstand-handwerk",
    titel: "KI im Mittelstand: weniger Hype, mehr Handwerk",
    hook: "Telefon, Angebote, Recherche, Social Media: wo kleine und mittlere Betriebe mit KI wirklich Zeit gewinnen und wo nicht.",
    fuerWen: "Inhaber, Geschäftsführung und Teams aus KMU und Handwerk",
    anlass: "Verbands- und Kammertage, Unternehmerfrühstück, Branchentreffen",
    takeaways: [
      "Drei Einstiege, die ohne IT-Abteilung funktionieren",
      "Wie eine KI-Telefonassistentin im Alltag klingt und wo ihre Grenzen liegen",
      "Was man vor dem ersten Euro klären muss: Daten, Datenschutz, Zuständigkeit",
    ],
    formate: "Keynote 30 oder 45 Minuten, auch als Impuls mit Diskussion",
    demo: "Live-Anruf bei der KI-Telefonassistentin möglich, nach technischer Absprache vor Ort",
  },
  {
    id: "shop-mit-ki",
    titel: "Der Online-Shop, der mit KI arbeitet",
    hook: "Ein echter Shop, ein Unternehmer, ein Team aus KI-Agenten: wer was macht, was es bringt und was nach wie vor Chefsache ist.",
    fuerWen: "E-Commerce, Handel, Marketing- und Vertriebsteams",
    anlass: "E-Commerce-Konferenzen, Handelsverbände, Marketing-Events",
    takeaways: [
      "Wie Suchtexte für fast 200 Seiten entstanden und wie man den Effekt sauber nachmisst",
      "Welche Social-Media- und Analysearbeit eine Pipeline erledigt und wo der Mensch freigibt",
      "Warum Automatisierung ohne Messung nur ein schnelleres Raten ist",
    ],
    formate: "Keynote 30 oder 45 Minuten",
  },
  {
    id: "wem-gehoert-deine-ki",
    titel: "Wem gehört deine KI?",
    hook: "Datenhoheit, europäische Infrastruktur und Abhängigkeiten, erklärt von jemandem, der eigene Server betreibt und weiß, wo es klemmt.",
    fuerWen: "Geschäftsführung, Datenschutz, IT-Leitung, öffentliche Hand",
    anlass: "Digitalisierungs- und Datenschutztage, Verbandsforen",
    takeaways: [
      "Was mit Daten passiert, wenn ein KI-Dienst sie verarbeitet, und welche Fragen man vorher stellt",
      "Wann eigene Infrastruktur in Deutschland Sinn ergibt und wann nicht",
      "Wie man Anbieter wechseln kann, ohne alles neu zu bauen",
    ],
    formate: "Keynote 45 Minuten oder Impuls 20 Minuten mit Panel",
  },
];

/** Titel, die das Formular als Wunschthema anbietet und der Server akzeptiert. */
export const talkTitel: readonly string[] = [...talks.map((t) => t.titel), "Noch offen, gern beraten"];

export type ProjektStatus = "Live" | "Im täglichen Einsatz" | "Prototyp";

export type Projekt = {
  id: string;
  name: string;
  href?: string;
  status: ProjektStatus;
  rolle: string;
  problem: string;
  versuch: string;
  erkenntnis: string;
  fuersPublikum: string;
};

export const projekte: Projekt[] = [
  {
    id: "geilstekerze",
    name: "geilstekerze.de",
    href: "https://geilstekerze.de",
    status: "Live",
    rolle: "Eigener Online-Shop für Duftkerzen. Dennis entscheidet über Sortiment, Einkauf, Preise und Freigaben. Das Agententeam schreibt Entwürfe, prüft, misst und erledigt Fleißarbeit.",
    problem: "Ein kleiner Shop braucht Suchtexte, Beiträge und Auswertungen wie ein großer, aber ohne Marketingabteilung.",
    versuch: "Agenten haben Google-Titel und Beschreibungen für fast 200 Seiten erstellt, die Nachmessung läuft. Eine eigene Pipeline veröffentlicht Pinterest- und LinkedIn-Beiträge. Einige Duftrezepte sind mit KI entwickelt und im Shop ausdrücklich so gekennzeichnet.",
    erkenntnis: "Die Agenten sind schnell. Der Engpass ist die Kontrolle: Jede Änderung braucht einen Rückweg und eine Messung, sonst weiß niemand, ob sie geholfen hat.",
    fuersPublikum: "Wie ein kleines Team mit Agenten Aufgaben schafft, für die es sonst Personal bräuchte, und wo es sich trotzdem nicht lohnt.",
  },
  {
    id: "frau-schmidt",
    name: "Mit Frau Schmidt",
    href: "https://mit-frau-schmidt.de",
    status: "Live",
    rolle: "KI-Telefonassistentin für Betriebe: nimmt Anrufe an, beantwortet Fragen und gibt Anliegen weiter.",
    problem: "Kleine Betriebe verpassen Anrufe, weil alle beim Kunden, in der Werkstatt oder am Herd stehen.",
    versuch: "Eine Assistentin, die rund um die Uhr ans Telefon geht, mit festen Regeln, wann sie an einen Menschen übergibt.",
    erkenntnis: "Entscheidend ist nicht die Stimme, sondern die Übergabe: Was die KI nicht sicher weiß, muss sauber beim Menschen landen.",
    fuersPublikum: "Wie KI-Assistenz im Kundenkontakt klingt, was sie kostet und wo die Grenze zwischen Entlastung und Ärgernis liegt.",
  },
  {
    id: "wissensnetz",
    name: "Wissensnetz für das Agententeam",
    status: "Im täglichen Einsatz",
    rolle: "Interne Wissensdatenbank mit Gedächtnis-Graph und Wiki, die die Agenten vor jeder Aufgabe befragen.",
    problem: "Ohne Gedächtnis fängt jeder Agent jeden Tag bei null an und wiederholt dieselben Fehler.",
    versuch: "Entscheidungen, Fehler und Arbeitsregeln landen in einer durchsuchbaren Datenbank und einem verknüpften Wiki. Mehrere KI-Werkzeuge greifen auf denselben Stand zu.",
    erkenntnis: "Wissen veraltet still. Ein Gedächtnis braucht Pflegeregeln, sonst glaubt der Agent einer Notiz von vor drei Monaten.",
    fuersPublikum: "Was Retrieval und Wissensgraphen im Unternehmen leisten, ohne Fachchinesisch, an einem laufenden Beispiel.",
  },
  {
    id: "avatar",
    name: "Sprechender Avatar für Frau Schmidt",
    status: "Prototyp",
    rolle: "Interaktiver Avatar, der zuhört, nachdenkt und mit Gesicht und Stimme antwortet.",
    problem: "Telefon ist gut, aber manche Kunden wollen ein Gegenüber sehen, zum Beispiel auf einer Website.",
    versuch: "Ein Prototyp verbindet Sprachmodell, Stimme und Avatar und läuft Ende zu Ende.",
    erkenntnis: "Das Gesicht ist nicht das Problem. Die Denkzeit zwischen Frage und Antwort ist es, und daran wird gearbeitet.",
    fuersPublikum: "Was KI-Avatare heute können, was sie kosten und warum der Engpass oft woanders liegt als gedacht.",
  },
];

export type Logbuch = { titel: string; was: string; lehre: string };

export const logbuch: Logbuch[] = [
  {
    titel: "„Erfolgreich hochgeladen.“ War es nicht.",
    was: "Ein Agent meldete, die Änderungen seien veröffentlicht. Eine kleine Befehlskette hatte den Fehlercode verschluckt, die Meldung war grün, der Server unverändert.",
    lehre: "Status wird gemessen, nicht geglaubt. Seitdem gilt: Jede Meldung braucht einen Gegenbeweis.",
  },
  {
    titel: "„Bitte in 56 Sekunden erneut versuchen.“",
    was: "Ein KI-Dienst bat um eine Minute Geduld. Tatsächlich war das Tageskontingent aufgebraucht, warten hätte bis zum nächsten Morgen gedauert.",
    lehre: "Auch Fehlermeldungen können irreführen. Wer automatisiert, muss die echten Grenzen seiner Werkzeuge kennen.",
  },
  {
    titel: "Das Gesicht war schnell. Das Denken nicht.",
    was: "Beim Avatar-Prototyp wurde zuerst an Bild und Lippen gefeilt. Gemessen lag der Engpass woanders: Das Sprachmodell braucht mehrere Sekunden bis zur Antwort.",
    lehre: "Erst messen, dann optimieren. Der sichtbarste Teil eines Systems ist selten der langsamste.",
  },
];

export const publikumsnutzen = [
  {
    titel: "Klarheit statt Hype",
    text: "Das Publikum weiß danach, was KI heute im eigenen Alltag verlässlich kann und was nicht.",
  },
  {
    titel: "Ein erster Schritt für Montag",
    text: "Jeder Vortrag endet mit konkreten Einstiegen, die ohne großes Projekt und ohne IT-Abteilung starten.",
  },
  {
    titel: "Die richtigen Fragen",
    text: "Zu Daten, Kosten und Kontrolle, damit das nächste Angebot eines KI-Anbieters nicht blind unterschrieben wird.",
  },
];

export const ablauf = [
  { titel: "Anfrage", text: "Datum, Ort, Format und Thema über das Formular unten oder per Telefon." },
  { titel: "Briefing", text: "Ein kurzes Gespräch zu Publikum, Anlass und Zielen der Veranstaltung." },
  { titel: "Zuschnitt", text: "Thema, Länge und Beispiele werden auf euer Publikum angepasst." },
  { titel: "Auftritt", text: "Vor Ort oder online, mit Technik-Check vorab." },
];

export const speakerFaq = [
  {
    q: "Was kostet eine Keynote mit Dennis Beichert?",
    a: "Das Honorar hängt von Format, Dauer, Ort und Anreise ab. Nach dem Briefing bekommst du ein festes Angebot ohne Nachforderungen.",
  },
  {
    q: "Ist Dennis Informatiker?",
    a: "Nein. Dennis ist Unternehmer und KI-Experte aus der Praxis. Sein Wissen kommt aus dem täglichen Bauen und Betreiben eigener KI-Anwendungen, nicht aus einem Studium. Genau deshalb erklärt er KI so, dass Entscheider und Teams sie verstehen.",
  },
  {
    q: "Gibt es die Vorträge auch online?",
    a: "Ja. Alle Themen gehen vor Ort, online oder hybrid.",
  },
  {
    q: "Was ist der Unterschied zu den promptwerker-Schulungen?",
    a: "Eine Keynote setzt Impulse für ein ganzes Publikum. Schulungen befähigen ein Team über mehrere Stunden praktisch. Für Schulungen gibt es eine eigene Seite unter Leistungen.",
  },
  {
    q: "Kann das Thema auf unsere Branche zugeschnitten werden?",
    a: "Ja. Im Briefing klären wir Branche und Publikum, die Beispiele werden darauf abgestimmt.",
  },
];
