import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalNote, LegalSection } from "@/components/LegalPage";
import { anbieter, baseUrl } from "@/lib/legal";

export const metadata: Metadata = {
  title: "AGB — promptwerker",
  description:
    "Allgemeine Geschäftsbedingungen von promptwerker für KI-Beratung, Entwicklung und Betrieb: Leistungen, Mitwirkung, Preise, Nutzungsrechte, Haftung — B2B, Preise netto.",
  alternates: { canonical: "/agb" },
  openGraph: {
    title: "AGB — promptwerker",
    description:
      "Allgemeine Geschäftsbedingungen für KI-Beratung, Entwicklung und Betrieb — ausschließlich für Unternehmer nach § 14 BGB.",
    url: `${baseUrl}/agb`,
    type: "website",
  },
};

/* AGB für Beratungs- und Projektgeschäft mit optionalem Betrieb.
   Bewusst NICHT die MitFrauSchmidt-AGB kopiert: dort geht es um ein
   Standard-SaaS-Abo mit Paketpreisen, hier um Werk-/Dienstleistungen mit
   Abnahme, Mitwirkungspflichten und Nutzungsrechten am Arbeitsergebnis.
   Übernommen wurden nur die Teile, die sachlich gleich sind: B2B-Zuschnitt,
   KI-Haftungsklausel, AV-Vertrags-Kopplung, Schlussbestimmungen. */

export default function AgbPage() {
  return (
    <LegalPage
      titel="Allgemeine Geschäftsbedingungen"
      intro="Für Beratung, Entwicklung und Betrieb von KI-Systemen durch promptwerker."
    >
      <LegalNote>
        Unser Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB. Alle
        Preise verstehen sich netto zuzüglich der gesetzlichen Umsatzsteuer.
      </LegalNote>

      <LegalSection titel="§ 1 Geltungsbereich und Anbieter">
        <p>
          Diese Bedingungen gelten für alle Verträge zwischen {anbieter.person},{" "}
          {anbieter.firma}, {anbieter.strasse}, {anbieter.plz} {anbieter.ort} (nachfolgend
          „Anbieter“ oder „{anbieter.marke}“) und seinen Auftraggebern (nachfolgend „Kunde“) über
          Beratung, Konzeption, Entwicklung, Integration, Schulung und Betrieb von Systemen der
          künstlichen Intelligenz.
        </p>
        <p>
          Abweichende, entgegenstehende oder ergänzende Geschäftsbedingungen des Kunden werden
          nicht Vertragsbestandteil, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich
          in Textform zu.
        </p>
      </LegalSection>

      <LegalSection titel="§ 2 Leistungsgegenstand">
        <p>
          Der Anbieter erbringt insbesondere folgende Leistungen: Analyse und Beratung zu
          KI-Einsatzmöglichkeiten, Entwicklung und Integration von Sprach- und Chat-Agenten,
          Automatisierung von Arbeitsabläufen, Anbindung bestehender Systeme (etwa CRM, Kalender
          und Postfach), Aufbau wissensbasierter Systeme sowie Schulungen und Fachvorträge.
        </p>
        <p>
          Der jeweils geschuldete Leistungsumfang ergibt sich abschließend aus dem einzelnen
          Angebot beziehungsweise der Leistungsbeschreibung. Darstellungen auf dieser Website sind
          unverbindlich und stellen kein bindendes Angebot dar.
        </p>
        <p>
          Beratungs-, Schulungs- und Betriebsleistungen sind Dienstleistungen; ein bestimmter
          wirtschaftlicher Erfolg wird nicht geschuldet. Ist im Angebot ausdrücklich ein
          abnahmefähiges Arbeitsergebnis vereinbart, gelten insoweit die Regeln des Werkvertrags
          einschließlich § 5 dieser Bedingungen.
        </p>
      </LegalSection>

      <LegalSection titel="§ 3 Vertragsschluss">
        <p>
          Der Vertrag kommt durch Annahme des Angebots des Anbieters durch den Kunden in Textform
          zustande, spätestens jedoch mit Beginn der Leistungserbringung durch den Anbieter mit
          Wissen des Kunden. Angebote des Anbieters sind, sofern nicht anders angegeben, 30 Tage
          ab Zugang gültig.
        </p>
      </LegalSection>

      <LegalSection titel="§ 4 Mitwirkungspflichten des Kunden">
        <p>
          KI-Projekte lassen sich nur mit den Daten, Zugängen und Ansprechpartnern des Kunden
          umsetzen. Der Kunde stellt daher rechtzeitig und unentgeltlich bereit: die für die
          Leistung erforderlichen Informationen und Beispieldaten, die notwendigen Zugänge zu
          seinen Systemen, einen entscheidungsbefugten Ansprechpartner sowie Rückmeldungen und
          Freigaben innerhalb angemessener Frist.
        </p>
        <p>
          Der Kunde sichert zu, dass er zur Bereitstellung der überlassenen Daten und zur
          Anbindung der genannten Konten berechtigt ist und die betroffenen Personen sowie
          gegebenenfalls seine Mitarbeitervertretung im erforderlichen Umfang informiert hat.
        </p>
        <p>
          Verzögerungen, die auf unterbliebener oder verspäteter Mitwirkung beruhen, verlängern
          vereinbarte Fristen angemessen. Dadurch entstehender Mehraufwand wird nach Aufwand
          vergütet.
        </p>
      </LegalSection>

      <LegalSection titel="§ 5 Abnahme">
        <p>
          Bei vereinbarten Werkleistungen zeigt der Anbieter die Fertigstellung an. Der Kunde
          prüft das Arbeitsergebnis innerhalb von zehn Werktagen und erklärt die Abnahme in
          Textform oder benennt die Mängel konkret. Erfolgt innerhalb dieser Frist weder eine
          Abnahme noch eine Mängelrüge, gilt die Leistung als abgenommen. Die produktive Nutzung
          des Arbeitsergebnisses durch den Kunden gilt ebenfalls als Abnahme.
        </p>
        <p>
          Unwesentliche Mängel berechtigen nicht zur Verweigerung der Abnahme; sie werden im
          Rahmen der Mängelbeseitigung behoben.
        </p>
      </LegalSection>

      <LegalSection titel="§ 6 Preise, Zahlung und Fremdkosten">
        <p>
          Sofern nicht anders vereinbart, wird nach Aufwand zu den im Angebot genannten Sätzen
          abgerechnet. Bei Festpreisen bleibt es beim vereinbarten Preis, solange sich der
          Leistungsumfang nicht ändert; Änderungswünsche werden gesondert beauftragt.
        </p>
        <p>
          Rechnungen sind ohne Abzug innerhalb von 14 Tagen ab Zugang zahlbar. Bei Projekten mit
          einem Volumen über 5.000 Euro netto ist der Anbieter berechtigt, Abschlagszahlungen nach
          Leistungsfortschritt zu verlangen.
        </p>
        <p>
          Laufende Kosten Dritter — insbesondere Hosting, Telefonie, Rufnummern und Entgelte für
          KI-Schnittstellen — trägt der Kunde. Sie werden, soweit sie über den Anbieter laufen,
          ohne Aufschlag weiterberechnet. Der Anbieter weist auf absehbare nutzungsabhängige
          Kosten vor Beauftragung hin.
        </p>
      </LegalSection>

      <LegalSection titel="§ 7 Nutzungsrechte">
        <p>
          Mit vollständiger Bezahlung räumt der Anbieter dem Kunden an den eigens für ihn
          erstellten Arbeitsergebnissen ein einfaches, zeitlich und räumlich unbeschränktes Recht
          zur Nutzung für die eigenen Geschäftszwecke ein.
        </p>
        <p>
          Vorbestehende Bausteine, Bibliotheken, Werkzeuge und allgemeines Know-how des Anbieters
          bleiben dessen Eigentum. Der Anbieter darf sie in anderen Projekten weiterverwenden; der
          Kunde erhält daran ein einfaches Nutzungsrecht, soweit sie im Arbeitsergebnis enthalten
          sind. Rechte an eingesetzter Fremdsoftware richten sich nach deren Lizenzbedingungen.
        </p>
        <p>
          Der Anbieter darf den Kunden nach vorheriger Abstimmung in Textform als Referenz nennen.
        </p>
      </LegalSection>

      <LegalSection titel="§ 8 Laufzeit und Kündigung von Betriebsleistungen">
        <p>
          Vereinbarte Betriebs-, Wartungs- und Supportleistungen laufen auf unbestimmte Zeit und
          sind von beiden Seiten mit einer Frist von einem Monat zum Monatsende kündbar, sofern
          nichts anderes vereinbart ist. Die Textform genügt. Das Recht zur außerordentlichen
          Kündigung aus wichtigem Grund bleibt unberührt.
        </p>
        <p>
          Nach Beendigung stellt der Anbieter dem Kunden dessen Daten auf Wunsch in einem
          gängigen, maschinenlesbaren Format bereit und löscht sie anschließend nach den Vorgaben
          des Auftragsverarbeitungsvertrags.
        </p>
      </LegalSection>

      <LegalSection titel="§ 9 Verfügbarkeit">
        <p>
          Übernimmt der Anbieter den Betrieb eines Systems, beträgt die Verfügbarkeit 98 Prozent
          im Monatsmittel. Ausgenommen sind angekündigte Wartungsfenster sowie Störungen außerhalb
          des Einflussbereichs des Anbieters, insbesondere Ausfälle von Telefonnetzen,
          Rechenzentren, KI-Schnittstellen oder anderen Vorleistungen Dritter sowie höhere Gewalt.
        </p>
      </LegalSection>

      <LegalSection titel="§ 10 Eigenschaften von KI-Systemen">
        <p>
          Der Kunde nimmt zur Kenntnis, dass Ergebnisse generativer KI-Systeme
          wahrscheinlichkeitsbasiert erzeugt werden und trotz sorgfältiger Umsetzung inhaltlich
          unzutreffend sein können. Solche Systeme unterstützen betriebliche Abläufe, ersetzen
          aber keine fachliche, rechtliche, steuerliche oder medizinische Prüfung durch den
          Kunden.
        </p>
        <p>
          Der Anbieter richtet die Systeme so ein, dass Ausgaben mit rechtlicher oder finanzieller
          Tragweite dem Kunden zur Freigabe vorgelegt werden, soweit dies mit dem beauftragten
          Anwendungsfall vereinbar ist. Der Kunde ist verpflichtet, die bereitgestellten
          Transparenzhinweise — insbesondere die Kennzeichnung als KI-System nach Art. 50 der
          Verordnung (EU) 2024/1689 (EU AI Act) — nicht zu deaktivieren, zu umgehen oder zu
          verschleiern.
        </p>
        <p>
          Der Kunde bleibt Betreiber des Systems im Sinne des EU AI Act und verantwortet dessen
          Einsatz in seinem Betrieb. Der Anbieter unterstützt ihn bei der Erfüllung der daraus
          folgenden Pflichten, übernimmt sie aber nicht.
        </p>
      </LegalSection>

      <LegalSection titel="§ 11 Haftung">
        <p>
          Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der
          Verletzung von Leben, Körper oder Gesundheit. Bei leicht fahrlässiger Verletzung
          wesentlicher Vertragspflichten — also solcher Pflichten, deren Erfüllung die
          ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren
          Einhaltung der Kunde regelmäßig vertrauen darf — ist die Haftung auf den
          vertragstypischen, vorhersehbaren Schaden begrenzt, höchstens jedoch auf die Summe der
          vom Kunden in den letzten zwölf Monaten gezahlten Entgelte. Im Übrigen ist die Haftung
          ausgeschlossen. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
        </p>
        <p>
          Für die inhaltliche Richtigkeit KI-generierter Ausgaben wird keine Gewähr übernommen,
          soweit der Kunde zumutbare Kontrollmöglichkeiten nicht genutzt hat. Bei
          Echtzeit-Interaktionen wie Telefon-Assistenz oder Live-Chat, bei denen eine vorherige
          Prüfung durch den Kunden technisch naturgemäß ausscheidet, ist die Haftung für
          fehlerhafte oder unpräzise KI-Aussagen — insbesondere für rechtsgeschäftliche
          Erklärungen gegenüber Endkunden — ausgeschlossen, es sei denn, der Fehler beruht auf
          Vorsatz oder grober Fahrlässigkeit des Anbieters.
        </p>
        <p>
          Für den Verlust von Daten haftet der Anbieter nur bis zu dem Aufwand, der bei
          ordnungsgemäßer und regelmäßiger Datensicherung durch den Kunden zur Wiederherstellung
          erforderlich gewesen wäre.
        </p>
      </LegalSection>

      <LegalSection titel="§ 12 Vertraulichkeit">
        <p>
          Beide Seiten behandeln alle im Rahmen der Zusammenarbeit erlangten, nicht offenkundigen
          Informationen der anderen Seite vertraulich und verwenden sie ausschließlich für
          Vertragszwecke. Die Pflicht gilt für die Dauer des Vertrags und drei Jahre darüber
          hinaus fort.
        </p>
      </LegalSection>

      <LegalSection titel="§ 13 Datenschutz">
        <p>
          Informationen zur Verarbeitung personenbezogener Daten enthält die{" "}
          <LegalLink href="/datenschutz">Datenschutzerklärung</LegalLink>. Verarbeitet der
          Anbieter personenbezogene Daten im Auftrag des Kunden, schließen die Parteien vor Beginn
          der Verarbeitung einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Dieser ist
          Bestandteil des Vertrags; ohne wirksamen Auftragsverarbeitungsvertrag wird die
          betreffende Verarbeitung nicht aufgenommen. Weitere Angaben unter{" "}
          <LegalLink href="/avv">Auftragsverarbeitung</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection titel="§ 14 Abwerbeverbot">
        <p>
          Der Kunde verpflichtet sich, während der Zusammenarbeit und für zwölf Monate danach
          keine Mitarbeiter oder Unterauftragnehmer des Anbieters, die an der Leistungserbringung
          beteiligt waren, gezielt abzuwerben. Für jeden Verstoß wird eine Vertragsstrafe
          vereinbart, deren Höhe der Anbieter nach billigem Ermessen festlegt und die im
          Streitfall vom zuständigen Gericht überprüft werden kann.
        </p>
      </LegalSection>

      <LegalSection titel="§ 15 Schlussbestimmungen">
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ausschließlicher
          Gerichtsstand für alle Streitigkeiten aus der Geschäftsbeziehung ist, soweit gesetzlich
          zulässig, der Sitz des Anbieters. Änderungen und Ergänzungen bedürfen der Textform; das
          gilt auch für die Abbedingung dieses Formerfordernisses.
        </p>
        <p>
          Sollte eine Bestimmung unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen
          Bestimmungen unberührt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
