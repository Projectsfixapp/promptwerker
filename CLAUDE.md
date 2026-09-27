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

<!-- PFLICHTEN:ANFANG erzeugt von ops/pflichten-verteilen.py -->
<!-- Quelle: ops/GEMEINSAME_PFLICHTEN.md · Stand 931bfdeda8 -->

> **Dieser Abschnitt ist erzeugt, nicht geschrieben.** Wer ihn hier von Hand
> aendert, verliert es beim naechsten Lauf. Aenderungen gehoeren in
> `C:\Users\Dell\ops\GEMEINSAME_PFLICHTEN.md`, danach
> `python C:\Users\Dell\ops\pflichten-verteilen.py`.

## Gemeinsame Pflichten für ALLE Modelle

Gilt für Claude Code, Codex, Gemini CLI, Kimi, OpenCode, Aider und jeden Subagenten — PC, Repos, Server 2. Vollfassung: `C:\Users\Dell\CLAUDE.md`; bei Widerspruch gilt sie.

### 0. Stand nie hier hartkodieren

Hier stehen Regeln, keine Zahlen — Zahlen, Status und Hashes veralten schneller, als verteilt werden kann.
- Wo stehen wir heute? → `~/.claude/projects/C--Users-Dell/memory/MEMORY.md` (erzeugt) + die `project_*.md` daneben
- Was ist wahr, wie hängt es zusammen? → `C:\Users\Dell\second-brain\wiki\index.md`, dann `entities/`, `concepts/`
- Was haben wir tief gelernt? → `icm.exe recall "<frage>"` (PowerShell: nie nacktes `icm`)
- Welche Regel gilt? → diese Datei

Jede Vault-Seite trägt genau einen Bereich-Tag: `bereich/geilstekerze` (pink), `bereich/mitfrauschmidt` (hellrosa), `bereich/onos` (rot), `bereich/allgemein` (blau). Neue Seite: `bereich:` + `gehoert_zu:` setzen, dann `python scripts/index-bauen.py` — sonst fehlt sie im Index, und den hält die nächste Sitzung für vollständig.

### 1. Gedächtnis — eine Bank, nie überschreiben

- **ICM** = strukturierte DB zu Dennis und den Projekten: `C:\Users\Dell\AppData\Local\icm\bin\icm.exe` (PowerShell: nie nacktes `icm` = `Invoke-Command`). Suchen `icm.exe recall "<frage>"` · Speichern `icm.exe store -t <topic> -c "..." -i high`.
- **Speicherpflicht:** Fehler gelöst · Architektur-/Designentscheidung · Präferenz von Dennis · Aufgabe fertig → sofort `store`, **bevor** geantwortet wird.
- 🚨 **Nie eine Gedächtnisdatei/-DB überschreiben** (bis zu 5 Sitzungen parallel):
  - vor jedem Schreiben **frisch einlesen**, nie aus altem Kontext;
  - **atomar**: daneben schreiben, dann `os.replace` — nie `write_text` direkt (leert erst; Fehler danach = Datei weg);
  - DBs **mergen statt kopieren** (ID-Vereinigung, `INSERT OR IGNORE`): `python C:\Users\Dell\ops\gedaechtnis-sync.py` (erst `--trocken`). Rettete am 21.08. zwei nur auf dem Server vorhandene Einträge, darunter einen `critical`-Befund.
- 🏗️ **MEMORY.md wird GEBAUT** (seit 23.08.2026): PreToolUse-Hook blockt Write/Edit, Handänderungen sind beim nächsten Bau weg. Ändern im Frontmatter der Quelldatei unter `metadata:`, dann `python C:\Users\Dell\ops\router-bauen.py`:
  ```
  router_prio:   akut | aktiv | ruhend     # fehlt = nach Alter (10 Tage)
  router_gruppe: onos | mfs | geilstekerze | infra | nebenprojekte | regeln
  router_falle:  "eine Zeile Risiko"
  router_label:  "Kurzname"
  ```
  Fester Kopf: `C:\Users\Dell\ops\router-kopf.md`. Notausgang `MEMORY_ROUTER_GUARD=aus`. Grund: fester Deckel über wachsender Fläche ist ein Rechenproblem — der Generator kappt selbst auf 20 KB, und eine abgeleitete Datei kann keine Parallel-Sitzung zerschießen.
- Commit-Hashes, Testzahlen, CI-Nummern → jeweilige `project_*.md`, nie in den Router (dort veralten sie und führen in die Irre).

### 2. Second Brain / Wiki — Pflegepflicht

`C:\Users\Dell\second-brain\wiki\` wird **mitgeschrieben**, nicht nur gelesen:
- neue Entität (Firma, Werkzeug, Person, Produkt, Kanal) → Seite unter `wiki\entities\`
- neues Konzept, Richtungs-/Architekturentscheidung → Seite unter `wiki\concepts\`
- Annahme widerlegt → Seite korrigieren, alte Aussage nicht stehen lassen
- Tagesstatus (Deploy, Testlauf, Hash, CI-Nummer) → **nicht ins Vault**, sondern ICM

Immer: `updated:` auf heute, Zeile in `wiki\log.md`, **committen** (kein Autocommit-Hook): `git -C C:\Users\Dell\second-brain add -A && git commit -m "Wiki: <was>"`. Vault = langlebige Zusammenhänge, ICM = Tiefenwissen + Live-Stand; nie derselbe Inhalt in beiden.

### 3. Text-Hygiene — MANDATORY bei jedem Kundentext

Alles, was ein Mensch liest: Shop-/Produkttexte, Mails, Anzeigen, Landingpages, Blog/Outreach, Angebote, PDFs.

```bash
S=/c/Users/Dell/.claude/skill-library/clean-user-facing-text/scripts
python "$S/inspect_text.py" --json DATEI          # Exit 1 = Treffer, kein Fehler
python "$S/clean_text.py" DATEI -o DATEI.cleaned --stats --no-normalize-spaces
python "$S/inspect_text.py" --json DATEI.cleaned  # Gegenprobe: 0 Treffer
```

Ohne Gegenprobe = ungereinigt. Nicht anfassen: Code, Befehle, Pfade, IDs, Formeln, Zitate, Preise, Pflichtangaben (Impressum, Widerruf, DSGVO). Binärdateien (PDF/DOCX/Bilder) nie durch die Textskripte — dafür `remove-ai-marks`.

### 4. Status nie behaupten, immer messen

Git-/Serverstand, „ist deployed", „ist erledigt" nur nach echter Prüfung, nie aus dem Gedächtnis. Jede Routen-/Containermessung braucht eine **Positivkontrolle** (ein Pfad, der bekannt fehlschlägt), sonst misst du den falschen Host. Umgebungsabhängiges nie am Quelltext belegen — `printenv` im Container.

### 5. Bauauflage — immer mit den Normen bauen

Jeder Bau, jedes Projekt, ohne Auslöser (Dennis 08.09.2026: „immer mit den Normen bauen wie ON.OS gebaut wurde"). Vollfassung mit Befunden und Erzwingern: `C:\Users\Dell\ops\BAUAUFLAGE.md`. Normwissen: `~/.claude/agents/iso-auditor-wissen/` (01–05 Sicherheit, 06 Produktqualität).

**Vor Baubeginn** in einem Satz: welche der neun Merkmale aus **ISO/IEC 25010:2023** binden und woran sie gemessen werden — ableiten (ISO/IEC 25002), nicht alle abhaken; Nichtbindendes benennen. 🚩 **Fassung 2023, nicht 2011:** Usability → **Interaktionsfähigkeit**, Portability → **Flexibilität** (inkl. Skalierbarkeit), **Betriebssicherheit (Safety)** ist neu. Die meisten Prüflisten im Netz stehen noch auf 2011.

Zehn Auflagen, jede aus einem echten Vorfall:

| | Auflage | Merkmal |
|---|---|---|
| B0 | Bindende Merkmale vor Baubeginn benennen | alle (25002) |
| B1 | Jede Messung braucht eine **Positivkontrolle** | Zuverlässigkeit |
| B2 | Keine Prüfung friert einen Wert ein, den die Welt ändern kann | Wartbarkeit |
| B3 | Ein Bezeichner ist kein Verhalten — `grep`, ob ihn jemand **liest** | Funktionale Eignung |
| B4 | Neues Kriterium gegen **Bestandsdaten** prüfen, nicht Testdaten | Kompatibilität |
| B5 | Umgebungsabhängiges nie am Quelltext belegen — `printenv` im Container | Flexibilität |
| B6 | Kein Schritt ohne Rückweg; Produktion ist nie das Versuchsfeld | **Safety** |
| B7 | Status wird gemessen, nie erinnert | Zurechenbarkeit |
| B8 | Ein Speicher, der still altert, ist ein Fehler | Datenqualität (25012) |
| B9 | Vor Baubeginn prüfen, ob eine andere Sitzung daran sitzt | Wartbarkeit |
| B10 | Kundentext geht nie ungereinigt raus (siehe 3.) | Interaktionsfähigkeit |

Für **Agenten, Personas und alles mit Sprachmodell** zusätzlich **ISO/IEC 25059**, v. a. *Steuerbarkeit durch den Nutzer*: kann ein Mensch rechtzeitig eingreifen — die Frage im AVV-Gespräch.

🪤 **Ehrlich bleiben:** Nur zwei der zehn Auflagen sind technisch erzwungen, der Rest ist Disziplin. Eine Auflage ohne Erzwinger ist die leichtere Hälfte der Arbeit — das gilt auch für diese Tabelle.

### 6. Diese Datei ist die Quelle — die Kopien werden erzeugt

Dieser Block steht in **einer** Datei und wird in alle Werkzeug-Dateien geschrieben (Claude Code, Codex, Gemini, OpenCode, Aider, Repos, Server 2); wer ihn dort ändert, verliert es beim nächsten Lauf.
- Ändern: `C:\Users\Dell\ops\GEMEINSAME_PFLICHTEN.md` · Verteilen: `python C:\Users\Dell\ops\pflichten-verteilen.py` (`--alles` inkl. Server 2) · Prüfen ohne Schreiben: `--pruefen` (Exit 1 = Drift) · Neues Werkzeug: eine Zeile in `ops/pflichten-ziele.json`, nicht kopieren.

Verteilt bei jedem Claude-Start (Hook `brain-guard.sh`, PC + Repos) und täglich komplett inkl. Server 2 (Aufgabe `Pflichten-Abgleich`). Grund: am 07.09.2026 gab es den Text fünfmal, alle „Stand 21.08.", inhaltlich auseinandergelaufen — eine Regel in vier Fassungen ist keine Regel, sondern vier Meinungen.

<!-- PFLICHTEN:ENDE -->
