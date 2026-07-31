# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Orientierung: drei Generationen im selben Repo

Nur eine davon ist aktiv. Vor jeder Änderung prüfen, in welcher man landet:

| Verzeichnis | Was | Status |
|---|---|---|
| `web/` | Next.js 16 App Router — **die echte Website** | aktiv, hier passiert alles |
| `preview/` | Vanilla-HTML-Prototyp, three.js + GSAP über `<script type="importmap">` aus `preview/js/vendor/` | Referenz für die 3D-Hero-Idee, wird nicht ausgeliefert |
| `wp-theme/`, `docker/`, `render.yaml` | WordPress-Block-Theme + Render-Docker-Deploy | **überholt** — `render.yaml` deployt noch das WP-Image mit `healthCheckPath: /wp-login.php`; der Pivot zu Next.js (Commit `4e52bfa`) hat das nie nachgezogen |

`docs/BRIEF.md` ist das lebende Projekt-Dokument mit den getroffenen Entscheidungen (Design-Richtung, Typografie-Lizenzen, Animation-Tech). Bei Fragen nach dem „Warum" einer Entscheidung dort zuerst nachsehen — es dokumentiert auch bewusst gekippte Vorentscheidungen.

## Befehle

Alles in `web/`:

```bash
npm run dev      # Dev-Server (Turbopack)
npm run build    # Produktions-Build, prüft auch TypeScript
npm run start    # Produktions-Server (PORT=3111 npm run start für Parallel-Betrieb)
npm run lint     # ESLint
```

Es gibt kein Test-Setup — keine Test-Runner-Abhängigkeit, kein `test`-Script. Verifikation läuft über `npm run build` (TypeScript-Prüfung inklusive) plus manuellen Abruf der Routen gegen den Produktions-Server.

Bekannter vorbestehender Lint-Fehler: `src/components/SiteShell.tsx:48` (`react-hooks/set-state-in-effect`). Nicht durch neue Arbeit verursacht.

## Next.js 16 — Pflichtlektüre vor Code

`web/AGENTS.md` (per `web/CLAUDE.md` eingebunden) verlangt: **vor dem Schreiben von Code den passenden Leitfaden in `node_modules/next/dist/docs/` lesen.** Diese Next-Version weicht in APIs und Konventionen vom Trainingsstand ab. Relevante Pfade: `01-app/03-api-reference/04-functions/generate-metadata.md`, `01-app/01-getting-started/15-route-handlers.md`.

Praktische Konsequenzen, die immer wieder auftreten:
- `params` in Seiten und Route-Handlern ist ein **Promise** und muss awaitet werden.
- Client-Komponenten können kein `metadata` exportieren. Braucht eine `"use client"`-Seite Metadaten, bekommt sie eine `layout.tsx` daneben (Muster: `src/app/leistungen/workshop-roadmap/layout.tsx`).

## Datengetriebene Seitenstruktur

Der Inhalt steckt nicht in den Seiten, sondern in typisierten Daten-Modulen unter `src/lib/`. Wer eine Leistung hinzufügt, ändert eine Datei — Route, Navigation, Footer, Sitemap und `llms.txt` ziehen nach:

- `topics.ts` — die vier Hauptleistungen (Karten auf der Startseite)
- `bottomCards.ts` — weitere Themen; `hasPage: false` heißt: Karte ohne eigene Seite, verlinkt aufs Kontakt-Overlay
- `serviceContent.ts` — Langtexte je Slug (Pain Points, Prozess, Vorteile, Use Case, FAQ). **Ohne Eintrag hier rendert `/leistungen/[slug]` einen 404**, auch wenn Topic/Card existiert
- `toolLogos.ts` — 36 Integrations-Logos, drei Varianten (`simple-icons`-Slug, Bilddatei, Initiale mit Farbe), gerendert über `ToolIcon.tsx`
- `legal.ts` — **einzige Quelle** für Anbieter-, Hoster- und Unterauftragnehmerdaten. Impressum, Datenschutz, AGB, AVV, das JSON-LD im Layout und die Footer-Adresse ziehen alle von hier

Karten ausblenden statt löschen: `enabled: false`.

## Layout- und Rendering-Aufbau

`app/layout.tsx` hält Skip-Link, Logo, Nav, `{children}` und Footer — Footer und Nav laufen dadurch auf **jeder** Seite. Die Startseite (`page.tsx` → `SiteShell`) ist eine Client-Komponente mit eigenem Zustand für drei Overlays (Themen-Detail, Kontakt, Terminbuchung); `FooterZone` liefert dort nur noch den Übergang ins helle Laufband, nicht den Footer selbst.

`NeuralBackground` (three.js, WebGL) wird per `dynamic(..., { ssr: false })` geladen, damit three.js nicht im hydrations-kritischen Bundle landet. Die Komponente respektiert `prefers-reduced-motion` und `max-width: 768px` bereits intern und exponiert per `useImperativeHandle` zwei Methoden: `highlightTopic(id)` und `getCtaOrigin()` — letztere liefert den Bildschirmpunkt, aus dem das Kontakt-Overlay aufblendet.

Unterseiten setzen `id="inhalt"` auf ihrem `<main>`, sonst läuft der Skip-Link ins Leere.

## Styling

Tailwind v4, **CSS-first**: es gibt keine `tailwind.config.*`. Farben, Schriften und Utilities stehen in `src/app/globals.css` im `@theme`-Block. Eigene Glas-Utilities dort: `.glass-panel` (dunkel), `.glass-panel-light` (hell, für Footer und helle Sektionen), `.glass-panel-liquid`, `.glass-button-liquid`, `.logo-badge-frost`.

Zwei Farbwelten, die nicht vermischt werden: dunkle Seite (`--color-bg`, `--color-ink`, `--color-body`, `--color-accent`) und helle Flächen (`--color-paper`, `--color-paper-ink`, `--color-paper-body`, `--color-accent-deep` für Links auf Hell).

Barrierefreiheit ist global geregelt: ein `:focus-visible`-Ring für alle interaktiven Elemente und eine `prefers-reduced-motion`-Regel. Beides nicht per komponenteneigenem `focus:outline-none` aushebeln.

## API-Routen und Degradation

Beide Routen laufen mit `runtime = "nodejs"` und **verschlucken fehlende Zugangsdaten nicht**, sondern melden sie so, dass die Oberfläche einen Ersatzweg anbieten kann:

- `POST /api/kontakt` → `lib/mailer.ts` (nodemailer/SMTP). Ohne `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` antwortet die Route `503` mit `{"error":"SMTP_NICHT_KONFIGURIERT"}`; die Formulare zeigen dann den mailto-Fallback. Schutz: Honigtopf-Feld `website` (ausgefüllt → `200 ok`, aber kein Versand) und 5 Anfragen pro Stunde und IP im Arbeitsspeicher
- `GET /api/booking/slots`, `POST /api/booking/create` → `lib/googleCalendar.ts`. Ohne `GOOGLE_CALENDAR_*` zeigt das Buchungs-Overlay den E-Mail-Fallback. Einrichtung: `web/KALENDER-SETUP.md`

Beide Kontaktformulare (`FooterContactForm`, `ContactFormReveal`) schicken auf dieselbe Route.

## Plasmic

`/seite/[...catchall]` und `/plasmic-host` binden den visuellen Editor Plasmic ein (`lib/plasmic-init.ts`). Der Editor ist derzeit nicht aktiv geschaltet; wird er aktiviert, muss die Datenschutzerklärung vorher ergänzt werden (dort ist es als noch nicht aktiv beschrieben).

## Rechtstexte

Die sechs Rechtsseiten (`/impressum`, `/datenschutz`, `/agb`, `/avv`, `/barrierefreiheit`, `/ki-transparenz`) nutzen alle das Gerüst `components/LegalPage.tsx` mit `LegalSection`, `LegalSubSection`, `LegalNote`, `LegalLink`. Neue Rechtstexte dort einhängen, nicht frei aufbauen — sonst driften Typografie und Abstände auseinander.

Inhaltliche Änderungen an Anbieterdaten gehören nach `lib/legal.ts`, nicht in die Seiten. Bei einer inhaltlichen Textänderung `rechtsstand` dort hochsetzen; der Wert erscheint unter jedem Rechtstext.

`hoster` in `legal.ts` ist der einzige noch nicht final entschiedene Wert und erscheint in der Datenschutzerklärung und der AVV-Tabelle — vor einem Livegang prüfen.

## Deployment

Aktuell **keines**. Die Domain promptwerker.de parkt bei united-domains (Stand 31.07.2026), `render.yaml` beschreibt noch das alte WordPress-Setup. Ein Deploy-Ziel für die Next.js-App muss noch festgelegt werden.
