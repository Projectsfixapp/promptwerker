import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalNote, LegalSection } from "@/components/LegalPage";
import { anbieter, baseUrl, hoster, mailanbieter } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — promptwerker",
  description:
    "Datenschutzerklärung nach Art. 13, 14 DSGVO für promptwerker.de: Hosting in Deutschland, Kontaktformular, Terminbuchung, keine Cookies, keine Analyse-Tools — und Ihre Rechte.",
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    title: "Datenschutzerklärung — promptwerker",
    description:
      "Wie promptwerker personenbezogene Daten verarbeitet: Hosting, Formulare, Terminbuchung, Rechtsgrundlagen und Betroffenenrechte.",
    url: `${baseUrl}/datenschutz`,
    type: "website",
  },
};

/* Struktur bewusst zweiteilig, analog zu mit-frau-schmidt.de:
   Teil A = Besucher dieser Website (wir sind Verantwortlicher),
   Teil B = Kundenprojekte (wir sind in der Regel Auftragsverarbeiter).
   Ohne Teil B fehlt Interessenten die Auskunft, wie mit ihren Daten im
   gebauten System umgegangen wird — genau die Frage, die im Erstgespräch
   als erstes kommt. */

export default function DatenschutzPage() {
  return (
    <LegalPage
      titel="Datenschutzerklärung"
      intro="Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 und 14 DSGVO."
    >
      <LegalNote>
        <strong className="text-ink">Teil A</strong> betrifft den Besuch dieser Website — dafür
        sind wir der Verantwortliche. <strong className="text-ink">Teil B</strong> betrifft
        Systeme, die wir für Kunden bauen und betreiben — dort handeln wir in der Regel
        weisungsgebunden als Auftragsverarbeiter.
      </LegalNote>

      <LegalSection titel="Teil A — Besuch dieser Website" id="teil-a">
        <p className="text-sm text-muted">
          Ziffern 1 bis 10 gelten für alle Besucherinnen und Besucher von {baseUrl}.
        </p>
      </LegalSection>

      <LegalSection titel="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der DSGVO ist:
          <br />
          <br />
          {anbieter.person}
          <br />
          {anbieter.firma} ({anbieter.marke})
          <br />
          {anbieter.strasse}
          <br />
          {anbieter.plz} {anbieter.ort}, {anbieter.land}
          <br />
          Telefon: <LegalLink href={`tel:${anbieter.telefonHref}`}>{anbieter.telefon}</LegalLink>
          <br />
          E-Mail: <LegalLink href={`mailto:${anbieter.email}`}>{anbieter.email}</LegalLink>
        </p>
        <p>
          Ein Datenschutzbeauftragter ist gesetzlich nicht zu benennen (§ 38 BDSG). Anfragen zum
          Datenschutz richten Sie bitte an die vorstehende E-Mail-Adresse.
        </p>
      </LegalSection>

      <LegalSection titel="2. Hosting und Server-Logfiles">
        <p>
          Diese Website wird auf Servern der {hoster.name} ({hoster.anschrift}) betrieben. Beim
          Aufruf einer Seite verarbeitet der Server automatisch technische Zugriffsdaten, die Ihr
          Browser übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Datei,
          übertragene Datenmenge, Browsertyp und -version, Betriebssystem und die zuvor besuchte
          Seite (Referrer).
        </p>
        <p>
          Diese Verarbeitung ist für den sicheren und störungsfreien Betrieb der Website
          erforderlich und stützt sich auf unser berechtigtes Interesse an Betriebssicherheit und
          Missbrauchsabwehr (Art. 6 Abs. 1 lit. f DSGVO). Die Logfiles werden spätestens nach
          sieben Tagen gelöscht oder anonymisiert, sofern nicht ein konkreter Sicherheitsvorfall
          eine längere Aufbewahrung erfordert. Eine Zusammenführung mit anderen Datenquellen
          findet nicht statt. Mit dem Hosting-Anbieter besteht ein Vertrag zur
          Auftragsverarbeitung nach Art. 28 DSGVO; die Verarbeitung findet in {hoster.ort} statt.
        </p>
      </LegalSection>

      <LegalSection titel="3. Cookies, Analyse und Werbung">
        <p>
          Diese Website setzt <strong className="text-ink">keine Cookies</strong> zu Analyse-
          oder Marketingzwecken, <strong className="text-ink">kein Analysewerkzeug</strong> (etwa
          Google Analytics) und <strong className="text-ink">kein Werbe-Tracking</strong> (etwa
          Meta-Pixel oder Google Ads Conversion-Tracking) ein. Es wird deshalb auch kein
          Einwilligungsbanner angezeigt — es gibt nichts einzuwilligen.
        </p>
        <p>
          Sollten künftig Analyse- oder Marketingdienste eingesetzt werden, wird diese Erklärung
          vorab ergänzt und die Dienste werden erst nach Ihrer Einwilligung geladen (Art. 6 Abs. 1
          lit. a DSGVO, § 25 Abs. 1 TDDDG).
        </p>
      </LegalSection>

      <LegalSection titel="4. Schriftarten und eingebundene Inhalte">
        <p>
          Alle Schriftarten werden zur Bauzeit lokal eingebunden und von unserem eigenen Server
          ausgeliefert. Es besteht <strong className="text-ink">keine Verbindung</strong> zu
          Google Fonts oder anderen externen Schriftanbietern. Externe Videos, Karten oder Social
          Plugins sind nicht eingebunden.
        </p>
      </LegalSection>

      <LegalSection titel="5. Kontaktformular und E-Mail">
        <p>
          Über das Kontaktformular im Seitenfuß können Sie uns eine Nachricht senden. Verarbeitet
          werden die von Ihnen angegebenen Daten: Name, E-Mail-Adresse, optional Unternehmen und
          Telefonnummer sowie der Inhalt Ihrer Nachricht. Zweck ist ausschließlich die Bearbeitung
          Ihrer Anfrage.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf den Abschluss
          oder die Durchführung eines Vertrags gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f
          DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
        </p>
        <p>
          Die Nachricht wird nicht in einer Datenbank gespeichert, sondern per E-Mail an unser
          Postfach {anbieter.email} zugestellt. Der Versand und das Postfach laufen über die{" "}
          {mailanbieter.name} ({mailanbieter.anschrift}); die Verarbeitung findet in{" "}
          {mailanbieter.ort} statt. Wir löschen Ihre Anfrage, sobald sie abschließend bearbeitet
          ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen — bei geschäftlicher
          Korrespondenz können das nach § 257 HGB und § 147 AO sechs bzw. zehn Jahre sein.
        </p>
        <p>
          Zur Abwehr automatisierter Spam-Einsendungen enthält das Formular ein für Sie
          unsichtbares Zusatzfeld und eine Begrenzung der Sendehäufigkeit je IP-Adresse. Dabei
          wird die IP-Adresse für maximal eine Stunde im Arbeitsspeicher des Servers gehalten und
          nicht dauerhaft gespeichert (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </LegalSection>

      <LegalSection titel="6. Terminbuchung">
        <p>
          Buchen Sie über die Website ein Erstgespräch, verarbeiten wir Name, E-Mail-Adresse,
          optional Telefonnummer und Ihren Terminwunsch, um den Termin zu bestätigen und
          durchzuführen (Art. 6 Abs. 1 lit. b DSGVO). Zur Prüfung freier Zeiten und zum Eintragen
          des Termins greifen wir auf unseren Geschäftskalender bei Google (Google Ireland Ltd.,
          Gordon House, Barrow Street, Dublin 4, Irland) zu. Dabei kann eine Übermittlung in die
          USA erfolgen; sie stützt sich auf das EU-US Data Privacy Framework beziehungsweise die
          EU-Standardvertragsklauseln. Termindaten werden nach Abschluss des Vorgangs gelöscht,
          soweit keine Aufbewahrungspflichten bestehen.
        </p>
      </LegalSection>

      <LegalSection titel="7. Einsatz künstlicher Intelligenz">
        <p>
          Auf dieser Website werden Ihre Eingaben nicht automatisiert durch KI-Systeme
          ausgewertet. Es findet keine automatisierte Entscheidungsfindung einschließlich
          Profiling nach Art. 22 DSGVO statt. Redaktionelle Texte dieser Website können mit
          KI-Unterstützung erstellt und redaktionell geprüft worden sein; Einzelheiten und die
          Transparenzangaben nach dem EU AI Act finden Sie unter{" "}
          <LegalLink href="/ki-transparenz">KI-Transparenz</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection titel="8. Unterseiten-Editor (Plasmic)">
        <p>
          Für einzelne Unterseiten kann der visuelle Editor „Plasmic“ (Plasmic Inc., USA) zum
          Pflegen von Inhalten eingesetzt werden. Der Editor ist im ausgelieferten Seitenbestand
          nicht aktiv geschaltet und lädt keine Inhalte in Ihren Browser. Sollte er aktiviert
          werden, wird diese Erklärung zuvor um die verarbeiteten Daten, die Rechtsgrundlage und
          die Garantien für die Übermittlung in die USA ergänzt.
        </p>
      </LegalSection>

      <LegalSection titel="9. Empfänger und Drittlandübermittlung">
        <p>
          Eine Weitergabe Ihrer Daten erfolgt nur an die in dieser Erklärung genannten
          Dienstleister, die für uns weisungsgebunden tätig sind, sowie an Stellen, gegenüber
          denen wir gesetzlich zur Auskunft verpflichtet sind. Eine vollständige, laufend
          gepflegte Liste aller beteiligten Dienstleister mit Verarbeitungsort finden Sie unter{" "}
          <LegalLink href="/avv">Auftragsverarbeitung</LegalLink>. Ihre Daten werden nicht
          verkauft und nicht zum Training allgemeiner KI-Modelle verwendet.
        </p>
      </LegalSection>

      <LegalSection titel="10. Ihre Rechte">
        <p>Sie haben jederzeit das Recht,</p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>nach Art. 15 DSGVO Auskunft über die zu Ihnen verarbeiteten Daten zu verlangen,</li>
          <li>nach Art. 16 DSGVO die Berichtigung unrichtiger Daten zu verlangen,</li>
          <li>nach Art. 17 DSGVO die Löschung Ihrer Daten zu verlangen,</li>
          <li>nach Art. 18 DSGVO die Einschränkung der Verarbeitung zu verlangen,</li>
          <li>
            nach Art. 20 DSGVO Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren
            Format zu erhalten,
          </li>
          <li>
            nach Art. 21 DSGVO der Verarbeitung zu widersprechen, soweit sie auf einem
            berechtigten Interesse beruht,
          </li>
          <li>
            eine erteilte Einwilligung nach Art. 7 Abs. 3 DSGVO jederzeit mit Wirkung für die
            Zukunft zu widerrufen.
          </li>
        </ul>
        <p>
          Zur Ausübung genügt eine formlose Nachricht an{" "}
          <LegalLink href={`mailto:${anbieter.email}`}>{anbieter.email}</LegalLink>. Unabhängig
          davon steht Ihnen nach Art. 77 DSGVO ein Beschwerderecht bei einer Aufsichtsbehörde zu.
        </p>
      </LegalSection>

      <LegalSection titel="11. Zuständige Aufsichtsbehörde">
        <p>
          {anbieter.aufsichtsbehoerde} (HBDI)
          <br />
          Postfach 3163, 65021 Wiesbaden
          <br />
          <LegalLink href="https://datenschutz.hessen.de">datenschutz.hessen.de</LegalLink>
        </p>
      </LegalSection>

      <LegalSection titel="Teil B — Systeme, die wir für Kunden bauen" id="teil-b">
        <p className="text-sm text-muted">
          Die folgenden Hinweise gelten, wenn Sie mit einem KI-System interagieren, das wir für
          einen unserer Kunden entwickelt haben oder betreiben — etwa einem Telefonagenten oder
          einem Chat-Assistenten auf der Website dieses Kunden.
        </p>
      </LegalSection>

      <LegalSection titel="12. Rollenverteilung">
        <p>
          Nutzen Sie ein System, das wir für einen Kunden betreiben, ist{" "}
          <strong className="text-ink">dieser Kunde der Verantwortliche</strong> im Sinne der
          DSGVO. Wir verarbeiten die Daten ausschließlich weisungsgebunden als Auftragsverarbeiter
          nach Art. 28 DSGVO. Bitte richten Sie Anfragen zu Ihren Betroffenenrechten deshalb
          direkt an das jeweilige Unternehmen, das Sie kontaktiert haben. Wir unterstützen den
          Verantwortlichen bei der Beantwortung, dürfen aber nicht eigenmächtig Auskunft erteilen
          oder löschen.
        </p>
      </LegalSection>

      <LegalSection titel="13. Verarbeitung in Sprach- und Chatsystemen">
        <p>
          Sprachsysteme wandeln das Gesprochene in Echtzeit in Text um und geben Antworten als
          Sprache aus. Ein dauerhafter Mitschnitt des Gesprächs wird dabei nicht angelegt;
          flüchtige Audiopuffer werden unmittelbar nach der Verarbeitung verworfen. Gespeichert
          wird — soweit der verantwortliche Kunde das so beauftragt hat — ein strukturiertes
          Text-Transkript mit dem Anliegen, damit der Vorgang bearbeitet werden kann.
        </p>
        <p>
          Welche Dienstleister im konkreten Projekt beteiligt sind und wo sie verarbeiten, hängt
          vom gebauten System ab und ist in der Anlage zum jeweiligen Auftragsverarbeitungsvertrag
          festgehalten. Den Rahmen dazu finden Sie unter{" "}
          <LegalLink href="/avv">Auftragsverarbeitung</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection titel="14. Speicherdauer im Kundenbetrieb">
        <p>
          Löschfristen legt der verantwortliche Kunde fest. Trifft er keine abweichende Regelung,
          löschen wir Transkripte und Verarbeitungsprotokolle 90 Tage nach Abschluss des Vorgangs
          und anonymisieren oder löschen strukturierte Kontaktdaten spätestens 180 Tage nach der
          letzten Bearbeitung.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
