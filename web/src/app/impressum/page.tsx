import type { Metadata } from "next";
import LegalPage, { LegalLink, LegalSection } from "@/components/LegalPage";
import { anbieter, baseUrl } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum — promptwerker",
  description:
    "Anbieterkennzeichnung nach § 5 DDG für promptwerker.de: Dennis Beichert, better than e-commerce D. Beichert, Hünfelden — Kontakt, USt-IdNr. und Verantwortlicher.",
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum — promptwerker",
    description: "Anbieterkennzeichnung nach § 5 DDG für promptwerker.de.",
    url: `${baseUrl}/impressum`,
    type: "website",
  },
};

export default function ImpressumPage() {
  return (
    <LegalPage
      titel="Impressum"
      intro="Anbieterkennzeichnung nach § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV)."
    >
      <LegalSection titel="Anbieter">
        <p>
          {anbieter.person}
          <br />
          {anbieter.firma}
          <br />
          {anbieter.strasse}
          <br />
          {anbieter.plz} {anbieter.ort}
          <br />
          {anbieter.land}
        </p>
        <p className="text-sm text-muted">
          „{anbieter.marke}“ ist eine Geschäftsbezeichnung des vorgenannten Einzelunternehmens
          und keine eigenständige Gesellschaft.
        </p>
      </LegalSection>

      <LegalSection titel="Kontakt">
        <p>
          Telefon: <LegalLink href={`tel:${anbieter.telefonHref}`}>{anbieter.telefon}</LegalLink>
          <br />
          E-Mail: <LegalLink href={`mailto:${anbieter.email}`}>{anbieter.email}</LegalLink>
        </p>
      </LegalSection>

      <LegalSection titel="Umsatzsteuer-Identifikationsnummer">
        <p>
          Umsatzsteuer-Identifikationsnummer nach § 27 a Umsatzsteuergesetz:{" "}
          <span className="text-ink">{anbieter.ustId}</span>
        </p>
      </LegalSection>

      <LegalSection titel="Inhaltlich verantwortlich">
        <p>
          Verantwortlich für journalistisch-redaktionelle Inhalte nach § 18 Abs. 2 MStV:{" "}
          {anbieter.person}, Anschrift wie oben.
        </p>
      </LegalSection>

      <LegalSection titel="Berufsbezeichnung und Kammerzugehörigkeit">
        <p>
          Die angebotenen Leistungen — Beratung, Softwareentwicklung und Automatisierung im
          Bereich künstlicher Intelligenz — unterliegen keiner gesetzlichen
          Berufszulassungs- oder Kammerpflicht.
        </p>
      </LegalSection>

      <LegalSection titel="Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
          <LegalLink href="https://ec.europa.eu/consumers/odr/">
            ec.europa.eu/consumers/odr
          </LegalLink>
          . Unser Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB. Wir
          sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection titel="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir nach § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
          Nutzung von Informationen nach den allgemeinen Gesetzen bleiben davon unberührt. Eine
          diesbezügliche Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten
          Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen
          entfernen wir diese Inhalte umgehend.
        </p>
      </LegalSection>

      <LegalSection titel="Haftung für Links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
          verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
          Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Eine permanente
          inhaltliche Kontrolle ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
          zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links
          umgehend.
        </p>
      </LegalSection>

      <LegalSection titel="Urheberrecht">
        <p>
          Die durch uns erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
          Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
          außerhalb der Grenzen des Urheberrechts bedürfen unserer schriftlichen Zustimmung.
          Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
          Gebrauch gestattet.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
