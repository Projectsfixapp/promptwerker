import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalNote, LegalSection } from "@/components/LegalPage";
import { anbieter, baseUrl } from "@/lib/legal";

export const metadata: Metadata = {
  title: "KI-Transparenz — promptwerker",
  description:
    "Transparenzangaben nach Art. 50 EU AI Act: welche KI-Systeme promptwerker auf dieser Website und in Kundenprojekten einsetzt, wer Anbieter und wer Betreiber ist.",
  alternates: { canonical: "/ki-transparenz" },
  openGraph: {
    title: "KI-Transparenz — promptwerker",
    description:
      "Kennzeichnung eingesetzter KI-Systeme, Rollenverteilung nach EU AI Act und menschliche Aufsicht.",
    url: `${baseUrl}/ki-transparenz`,
    type: "website",
  },
};

/* Transparenzseite zur Verordnung (EU) 2024/1689 (EU AI Act).
   Fristenlage zum Zeitpunkt der Erstellung: Verbote gelten seit 02.02.2025,
   Pflichten für Modelle mit allgemeinem Verwendungszweck seit 02.08.2025,
   die Transparenzpflichten des Art. 50 ab 02.08.2026. Die Seite ist deshalb
   bewusst schon vor dem Stichtag online. */

export default function KiTransparenzPage() {
  return (
    <LegalPage
      titel="KI-Transparenz"
      intro="Transparenzangaben nach Art. 50 der Verordnung (EU) 2024/1689 über künstliche Intelligenz (EU AI Act)."
    >
      <LegalNote>
        Auf dieser Website interagieren Sie{" "}
        <strong className="text-ink">nicht mit einem KI-System</strong>. Es gibt hier keinen
        Chatbot und keine Sprachausgabe. Wo wir KI einsetzen — in Kundenprojekten und bei der
        Erstellung von Inhalten — steht unten.
      </LegalNote>

      <LegalSection titel="Rollen nach dem EU AI Act">
        <p>
          Der EU AI Act unterscheidet zwischen dem Anbieter eines KI-Systems, der es entwickelt
          und in Verkehr bringt, und dem Betreiber, der es unter eigener Verantwortung einsetzt.
        </p>
        <p>
          Bauen wir für einen Kunden ein KI-System, das dieser ausschließlich intern oder
          gegenüber seinen eigenen Kunden nutzt, ist{" "}
          <strong className="text-ink">der Kunde der Betreiber</strong>. Wir handeln als
          technischer Dienstleister und, soweit wir das System zusammenstellen und unter dem Namen
          des Kunden bereitstellen, als Anbieter im Sinne der Verordnung. Wer welche Rolle
          übernimmt, halten wir je Projekt schriftlich fest — denn daran hängen die Pflichten zur
          Kennzeichnung, zur Dokumentation und zur menschlichen Aufsicht.
        </p>
        <p>
          Die zugrunde liegenden Sprachmodelle stammen von Dritten (unter anderem Anthropic,
          OpenAI, Microsoft). Diese sind Anbieter von Modellen mit allgemeinem Verwendungszweck
          und tragen die dafür geltenden Pflichten selbst.
        </p>
      </LegalSection>

      <LegalSection titel="Kennzeichnung in Kundenprojekten">
        <p>
          Systeme, die wir bauen und die unmittelbar mit Menschen interagieren, weisen zu Beginn
          der Interaktion darauf hin, dass es sich um ein KI-System handelt — bei Telefonagenten
          hörbar in der Begrüßung, bei Chat-Assistenten sichtbar im Fenster. Diese Hinweise sind
          fester Bestandteil der Auslieferung. Unsere{" "}
          <LegalLink href="/agb">Allgemeinen Geschäftsbedingungen</LegalLink> verpflichten unsere
          Kunden in § 10 ausdrücklich, sie nicht zu deaktivieren oder zu verschleiern.
        </p>
        <p>
          Künstlich erzeugte oder manipulierte Bild-, Ton- und Videoinhalte kennzeichnen wir als
          solche und versehen sie, soweit technisch verfügbar, mit maschinenlesbaren
          Herkunftsangaben.
        </p>
      </LegalSection>

      <LegalSection titel="Was wir nicht bauen">
        <p>
          Wir setzen keine Praktiken um, die Art. 5 EU AI Act verbietet — insbesondere keine
          Emotionserkennung am Arbeitsplatz oder in Bildungseinrichtungen, keine biometrische
          Kategorisierung nach sensiblen Merkmalen, keine soziale Bewertung von Personen und keine
          Systeme, die menschliches Verhalten durch unterschwellige Techniken manipulieren.
        </p>
        <p>
          Fällt ein Anwendungsfall in den Hochrisiko-Bereich nach Anhang III — etwa Systeme für
          Bewerberauswahl, Kreditwürdigkeitsprüfung oder die Bewertung von Beschäftigten — weisen
          wir vor Projektbeginn auf die damit verbundenen Pflichten hin (Risikomanagement,
          Datenqualität, technische Dokumentation, Protokollierung, menschliche Aufsicht,
          Konformitätsbewertung). Ohne belastbaren Plan zur Erfüllung dieser Pflichten setzen wir
          solche Projekte nicht um.
        </p>
      </LegalSection>

      <LegalSection titel="Menschliche Aufsicht und Grenzen">
        <p>
          Generative KI erzeugt Ergebnisse wahrscheinlichkeitsbasiert und kann sachlich falsch
          liegen. Wir richten Systeme deshalb so ein, dass Ausgaben mit rechtlicher oder
          finanzieller Tragweite dem Menschen zur Freigabe vorgelegt werden, dass die Übergabe an
          einen Menschen jederzeit möglich bleibt und dass Systemverhalten protokolliert wird.
        </p>
        <p>
          Kompetenzaufbau nach Art. 4 EU AI Act ist Bestandteil jeder Einführung: Wir schulen die
          Personen, die mit dem System arbeiten, in dessen Fähigkeiten, Grenzen und typischen
          Fehlerbildern.
        </p>
      </LegalSection>

      <LegalSection titel="KI bei der Erstellung dieser Website">
        <p>
          Texte dieser Website sind teilweise mit KI-Unterstützung entstanden und durchgängig
          redaktionell geprüft und verantwortet. Eine Kennzeichnungspflicht besteht dafür nicht —
          wir nennen es, weil wir es von unseren Kunden ebenfalls erwarten.
        </p>
      </LegalSection>

      <LegalSection titel="Fragen zur KI-Konformität">
        <p>
          Fragen zu einem konkreten System oder zu Ihren Pflichten als Betreiber beantworten wir
          unter{" "}
          <LegalLink href={`mailto:${anbieter.email}?subject=Frage%20KI-Transparenz`}>
            {anbieter.email}
          </LegalLink>
          . Diese Seite ersetzt keine Rechtsberatung.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
