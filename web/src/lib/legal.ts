/* Zentrale Quelle für alle rechtlich relevanten Angaben.
   Impressum, Datenschutz, AGB, AVV und die JSON-LD-Daten im Layout ziehen
   ausschließlich von hier — damit eine Adress- oder Anbieteränderung genau
   an einer Stelle passiert und nicht in fünf Dateien auseinanderläuft.

   RECHTSENTITÄT: identisch zu mit-frau-schmidt.de und geilstekerze.de
   (dort im Impressum verifiziert). "promptwerker" ist eine Geschäfts-
   bezeichnung dieses Einzelunternehmens, keine eigene Gesellschaft.

   ACHTUNG — HOSTER: `hoster` ist die einzige Angabe hier, die noch nicht
   final entschieden ist (die Domain liegt bei united-domains, ein Deploy-
   Ziel steht noch aus). Voreingestellt ist Hetzner, weil dort bereits die
   übrigen Projekte laufen. Vor Livegang prüfen — die Angabe steht in der
   Datenschutzerklärung Ziffer 2 und in der AVV-Tabelle. */

export const anbieter = {
  person: "Dennis Beichert",
  firma: "better than e-commerce D. Beichert",
  marke: "promptwerker",
  strasse: "Akazienplatz 14",
  plz: "65597",
  ort: "Hünfelden",
  land: "Deutschland",
  landCode: "DE",
  telefon: "06438 9016836",
  telefonHref: "+4964389016836",
  email: "kontakt@promptwerker.de",
  ustId: "DE445320469",
  aufsichtsbehoerde: "Der Hessische Beauftragte für Datenschutz und Informationsfreiheit",
} as const;

export const domain = "promptwerker.de";
export const baseUrl = `https://${domain}`;

/* Fassungsdatum der Rechtstexte. Bei inhaltlicher Änderung hochsetzen —
   der Stand wird unter jedem Rechtstext ausgegeben. */
export const rechtsstand = "31. Juli 2026";

export const hoster = {
  name: "Hetzner Online GmbH",
  anschrift: "Industriestr. 25, 91710 Gunzenhausen, Deutschland",
  ort: "Deutschland",
} as const;

export const mailanbieter = {
  name: "united-domains AG",
  anschrift: "Gautinger Str. 10, 82319 Starnberg, Deutschland",
  ort: "Deutschland",
} as const;

export type Unterauftragnehmer = {
  zweck: string;
  anbieter: string;
  ort: string;
  /** false = Daten verlassen die EU oder können sie verlassen (rot markiert) */
  eu: boolean;
};

/* Unterauftragnehmer für den Betrieb von promptwerker.de selbst.
   Nicht zu verwechseln mit den Dienstleistern in Kundenprojekten — die
   stehen projektweise im jeweiligen AV-Vertrag, weil sie sich je nach
   gebautem System unterscheiden (Ziffer "Projektbezogene Dienstleister"
   auf der AVV-Seite). */
export const unterauftragnehmerWebsite: Unterauftragnehmer[] = [
  {
    zweck: "Hosting, Auslieferung der Website, Server-Logfiles",
    anbieter: hoster.name,
    ort: hoster.ort,
    eu: true,
  },
  {
    zweck: "E-Mail-Postfach und Versand des Kontaktformulars",
    anbieter: mailanbieter.name,
    ort: mailanbieter.ort,
    eu: true,
  },
  {
    zweck: "Domainverwaltung",
    anbieter: "united-domains AG, Starnberg",
    ort: "Deutschland",
    eu: true,
  },
  {
    zweck: "Kalenderabgleich für die Terminbuchung (nur bei Buchung eines Termins)",
    anbieter: "Google Ireland Ltd., Dublin",
    ort: "Irland — Übermittlung in die USA möglich, EU-US Data Privacy Framework",
    eu: false,
  },
];

/* Typische Dienstleister in Kundenprojekten. Die Liste ist der Rahmen, aus
   dem sich die projektbezogene Anlage 1 zum AV-Vertrag zusammensetzt — welche
   Zeilen konkret gelten, hängt vom gebauten System ab und wird pro Projekt
   schriftlich festgehalten. */
export const unterauftragnehmerProjekte: Unterauftragnehmer[] = [
  {
    zweck: "Betrieb von Anwendungen und Datenbanken im Kundenauftrag",
    anbieter: "Hetzner Online GmbH, Gunzenhausen",
    ort: "Deutschland",
    eu: true,
  },
  {
    zweck: "Spracherkennung und Sprachausgabe für Voice-Agenten",
    anbieter: "Microsoft Ireland Operations Ltd. (Azure Speech)",
    ort: "EU — Azure-Region Schweden",
    eu: true,
  },
  {
    zweck: "Telefonie und Rufnummern",
    anbieter: "sipgate GmbH, Düsseldorf / Telnyx LLC",
    ort: "Deutschland bzw. Konzernsitz USA — EU-Standardvertragsklauseln",
    eu: false,
  },
  {
    zweck: "Texterzeugung, Zusammenfassungen, Chat-Antworten",
    anbieter: "Anthropic PBC bzw. OpenAI Ireland Ltd. — je nach Projekt",
    ort: "USA bzw. Irland — EU-US Data Privacy Framework bzw. Standardvertragsklauseln",
    eu: false,
  },
  {
    zweck: "Anbindung bestehender Kundensysteme (CRM, Kalender, Postfach)",
    anbieter: "Vom Kunden selbst eingesetzte Anbieter (z. B. SAP, Salesforce, HubSpot, Google, Microsoft)",
    ort: "Keine Unterauftragnehmer von promptwerker — der Kunde bleibt verantwortlich",
    eu: true,
  },
];
