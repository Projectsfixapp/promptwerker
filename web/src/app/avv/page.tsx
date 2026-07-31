import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalNote, LegalSection } from "@/components/LegalPage";
import {
  anbieter,
  baseUrl,
  unterauftragnehmerProjekte,
  unterauftragnehmerWebsite,
  type Unterauftragnehmer,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Auftragsverarbeitung (AVV) — promptwerker",
  description:
    "Auftragsverarbeitung nach Art. 28 DSGVO bei promptwerker: Rollenverteilung, technische und organisatorische Maßnahmen, Unterauftragnehmer und Verarbeitungsorte im Überblick.",
  alternates: { canonical: "/avv" },
  openGraph: {
    title: "Auftragsverarbeitung (AVV) — promptwerker",
    description:
      "Rollenverteilung, TOM, Unterauftragnehmer und Verarbeitungsorte nach Art. 28 DSGVO.",
    url: `${baseUrl}/avv`,
    type: "website",
  },
};

/* Umgeschriebene Fassung der MitFrauSchmidt-AVV-Seite.
   Wesentlicher Unterschied: dort ein Standardprodukt mit einer festen
   Unterauftragnehmerliste, hier Projektgeschäft — die tatsächlich
   beteiligten Dienstleister unterscheiden sich je gebautem System. Deshalb
   zwei Tabellen: fest für den Betrieb dieser Website, Rahmen für Projekte. */

function DienstleisterTabelle({
  eintraege,
  beschriftung,
}: {
  eintraege: Unterauftragnehmer[];
  beschriftung: string;
}) {
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{beschriftung}</caption>
        <thead>
          <tr className="border-b border-white/20 text-ink">
            <th scope="col" className="py-2 pr-4 font-semibold">
              Zweck
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold">
              Anbieter
            </th>
            <th scope="col" className="py-2 font-semibold">
              Verarbeitungsort
            </th>
          </tr>
        </thead>
        <tbody>
          {eintraege.map((eintrag) => (
            <tr key={`${eintrag.zweck}-${eintrag.anbieter}`} className="border-b border-white/10 align-top">
              <td className="py-3 pr-4">{eintrag.zweck}</td>
              <td className="py-3 pr-4">{eintrag.anbieter}</td>
              <td className="py-3">
                <span className={eintrag.eu ? "text-body" : "text-[color:var(--color-magenta-soft)]"}>
                  {eintrag.eu ? null : (
                    <span className="sr-only">Verlässt die EU oder kann sie verlassen: </span>
                  )}
                  {eintrag.ort}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AvvPage() {
  return (
    <LegalPage
      titel="Auftragsverarbeitung"
      intro="Nach Art. 28 DSGVO — Grundlage jeder Verarbeitung, die wir für einen Kunden übernehmen."
    >
      <LegalNote>
        Kurz gesagt: Sobald wir für Sie personenbezogene Daten verarbeiten, bleiben{" "}
        <strong className="text-ink">Sie der Verantwortliche</strong> und wir handeln
        weisungsgebunden. Ohne unterzeichneten Auftragsverarbeitungsvertrag nehmen wir die
        Verarbeitung nicht auf.
      </LegalNote>

      <LegalSection titel="Wer ist wofür verantwortlich?">
        <p>
          Bauen oder betreiben wir ein System, das Daten Ihrer Kunden, Anrufer oder Mitarbeiter
          verarbeitet, sind <strong className="text-ink">Sie der Verantwortliche</strong> im Sinne
          der DSGVO — Sie entscheiden über Zwecke und Mittel. Wir verarbeiten diese Daten
          ausschließlich nach Ihren dokumentierten Weisungen als{" "}
          <strong className="text-ink">Auftragsverarbeiter</strong> nach Art. 28 DSGVO.
        </p>
        <p>
          Der Vertrag regelt Gegenstand und Dauer der Verarbeitung, Art und Zweck, die Kategorien
          betroffener Personen und Daten, die Weisungsbindung, die Vertraulichkeitsverpflichtung
          der eingesetzten Personen, die technischen und organisatorischen Maßnahmen, den Einsatz
          weiterer Unterauftragnehmer, die Unterstützung bei Betroffenenrechten, die Meldung von
          Datenschutzverletzungen sowie Löschung oder Rückgabe nach Vertragsende.
        </p>
        <p>
          Reine Beratung ohne Zugriff auf personenbezogene Daten — etwa ein Strategie-Workshop —
          benötigt keinen Auftragsverarbeitungsvertrag. Sobald wir jedoch Zugänge zu Ihren
          Systemen erhalten oder Ihre Daten zu Test- und Entwicklungszwecken verarbeiten,
          schließen wir ihn vorab ab.
        </p>
      </LegalSection>

      <LegalSection titel="Technische und organisatorische Maßnahmen">
        <p>
          Die Maßnahmen nach Art. 32 DSGVO sind Anlage zum Vertrag. Im Kern: verschlüsselte
          Übertragung (TLS) und verschlüsselte Speicherung ruhender Daten, Zugriff nach dem
          Minimalprinzip mit persönlichen Zugängen und Mehrfaktor-Authentisierung, getrennte
          Mandanten je Kunde, protokollierte administrative Zugriffe, regelmäßige Sicherungen mit
          geprüfter Wiederherstellung sowie ein festgelegter Ablauf für die Meldung von
          Sicherheitsvorfällen innerhalb von 24 Stunden nach Kenntnis an Sie.
        </p>
      </LegalSection>

      <LegalSection titel="Dienstleister für den Betrieb dieser Website">
        <p>
          Diese Dienstleister sind am Betrieb von {baseUrl.replace("https://", "")} beteiligt.
          Hier sind wir selbst Verantwortlicher — die Liste dient der Transparenz nach Art. 13
          DSGVO.
        </p>
        <DienstleisterTabelle
          eintraege={unterauftragnehmerWebsite}
          beschriftung="Dienstleister für den Betrieb der Website promptwerker.de"
        />
      </LegalSection>

      <LegalSection titel="Dienstleister in Kundenprojekten">
        <p>
          Welche Dienstleister in Ihrem Projekt zum Einsatz kommen, hängt vom gebauten System ab.
          Die folgende Übersicht ist der Rahmen, aus dem sich die projektbezogene Anlage zum
          Auftragsverarbeitungsvertrag zusammensetzt — verbindlich ist stets die dort
          festgehaltene Liste.
        </p>
        <DienstleisterTabelle
          eintraege={unterauftragnehmerProjekte}
          beschriftung="Mögliche Unterauftragnehmer in Kundenprojekten"
        />
        <p className="text-sm text-muted">
          Hell hervorgehobene Einträge verlassen die EU oder können sie verlassen. Für diese
          Übermittlungen liegen Standardvertragsklauseln beziehungsweise eine
          Angemessenheitsentscheidung zugrunde. Wo es der Anwendungsfall zulässt, wählen wir eine
          Variante mit Verarbeitung innerhalb der EU.
        </p>
      </LegalSection>

      <LegalSection titel="Wechsel von Unterauftragnehmern">
        <p>
          Sie erteilen mit dem Vertrag eine allgemeine Genehmigung zum Einsatz der in der Anlage
          genannten Unterauftragnehmer. Beabsichtigte Änderungen kündigen wir mindestens vier
          Wochen vorab in Textform an. Sie können der Änderung innerhalb dieser Frist aus einem
          wichtigen datenschutzrechtlichen Grund widersprechen (Art. 28 Abs. 2 DSGVO); lässt sich
          die Leistung dann nicht wirtschaftlich zumutbar erbringen, steht beiden Seiten ein
          Sonderkündigungsrecht zu.
        </p>
      </LegalSection>

      <LegalSection titel="Was gespeichert wird — und was nicht">
        <p>
          Bei Sprachsystemen wird das Gespräch live in Text umgewandelt; eine dauerhafte
          Tonaufnahme wird nicht abgelegt. Gespeichert werden das Transkript und der daraus
          erzeugte Vorgang, soweit Sie das so beauftragt haben. Ihre Daten werden nicht verkauft
          und nicht zum Training allgemeiner KI-Modelle verwendet. Bei den eingesetzten
          KI-Schnittstellen nutzen wir ausschließlich Geschäftskonditionen, die eine Verwendung
          der übermittelten Inhalte zu Trainingszwecken ausschließen.
        </p>
      </LegalSection>

      <LegalSection titel="Vertrag anfordern">
        <p>
          Den unterschriftsfertigen Auftragsverarbeitungsvertrag stellen wir vor Vertragsschluss
          zur Prüfung bereit — projektbezogen, weil Anlage 1 (Unterauftragnehmer) und Anlage 2
          (Datenarten und betroffene Personen) vom jeweiligen System abhängen. Fordern Sie ihn
          formlos an unter{" "}
          <LegalLink href={`mailto:${anbieter.email}?subject=Anfrage%20AV-Vertrag`}>
            {anbieter.email}
          </LegalLink>
          .
        </p>
        <p>
          Setzen Sie bereits ein eigenes Vertragsmuster ein, prüfen wir dieses gern und
          unterzeichnen es, sofern es den Anforderungen des Art. 28 DSGVO entspricht.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
