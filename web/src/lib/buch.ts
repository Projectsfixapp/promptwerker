/* Buch von Dennis Beichert — Daten für die Buchkarte auf /dennis-beichert.

   Übergangslösung bis zur Listung im BoD-Buchshop: Sobald BoD den Titel
   führt, ersetzt das BoD-Shop-Widget (myBoD → Weitere Leistungen →
   Shop-Widget) bzw. ein Link darauf diese Karte. Dann `shopUrl` setzen und
   `status` auf "lieferbar" stellen; die Karte zeigt den Kaufen-Button erst,
   wenn `shopUrl` gesetzt ist. Verkäufe über den BoD-Buchshop bringen 50 %
   mehr Honorar als andere Vertriebswege. */

export type BuchStatus = "erscheint" | "lieferbar";

export const buch = {
  titel: "Dein Chaos hat jetzt KI.",
  untertitel: "Wie du KI im Unternehmen sinnvoll einsetzt.",
  isbn: "978-3-6967-5876-9",
  preis: "19,99 €",
  seiten: 124,
  format: "Paperback, 15,5 × 22 cm",
  verlag: "BoD · Books on Demand",
  status: "erscheint" as BuchStatus,
  shopUrl: null as string | null,
  cover: "/buch/dein-chaos-hat-jetzt-ki-cover.webp",
  coverBreite: 600,
  coverHoehe: 910,
  coverAlt:
    "Buchcover „Dein Chaos hat jetzt KI.“ von Dennis Beichert: gelber Umschlag, darauf eine überquellende Ablage mit Papierstapeln und einem orangefarbenen KI-Etikett",
  kurztext:
    "KI gekauft. Problem geblieben? Ich betreibe meinen eigenen Onlineshop mit KI-Agenten und habe dabei fast jeden Fehler selbst gemacht. Dieses Buch zeigt Inhabern, Führungskräften und Teams in kleinen und mittleren Unternehmen, wie KI im Alltag wirklich funktioniert.",
  punkte: [
    "Die richtige Aufgabe wählen, statt Werkzeuge zu sammeln",
    "Wissen verlässlich machen, Datenschutz und AI Act einordnen",
    "Ehrlich rechnen und das Team mitnehmen",
  ],
  bonus: "Mit 90-Tage-Plan und 12 Arbeitsblättern zum direkten Ausfüllen",
  kiHinweis: "Mit Unterstützung von KI-Agenten erarbeitet und geschrieben; das Coverbild ist KI-generiert.",
} as const;
