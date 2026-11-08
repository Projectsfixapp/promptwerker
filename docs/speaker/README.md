# Speaker-Seite Dennis Beichert — Übergabe

Route `https://promptwerker.de/dennis-beichert` innerhalb der bestehenden Next.js-App (`web/`). Lokal fertig und geprüft, **nicht deployed**.

## Starten

```bash
cd /c/Users/Dell/promptwerker-website/web
npm run build                 # Produktions-Build inkl. TypeScript
PORT=3111 npm run start       # dann http://localhost:3111/dennis-beichert
npm run dev                   # Entwicklung mit Turbopack
npm run lint
```

Lokal ohne `SMTP_*` antwortet das Formular mit dem E-Mail-/Telefon-Ersatzweg (gewollt). Mit echten Zugangsdaten in `web/.env.local` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, optional `SMTP_FROM`, `KONTAKT_EMPFAENGER`) wird versendet, Variablen wie im Bestand, nichts Neues.

Inhalte ändern: `web/src/lib/speaker.ts` (Talks, Projekte, Logbuch, FAQ). Auswahllisten des Formulars: `web/src/lib/speakerAnfrage.ts`. Bewegung: `web/src/lib/motion.ts` (wirkt auch auf die Startseite).

## Dokumente

| Datei | Inhalt |
|---|---|
| `research/benchmark.md` | Vergleichsmatrix 8 Domains × 20 Kriterien, Ranking |
| `research/strategie.md` | Taktiken, Fehler, Positionierungen, Differenzierung |
| `research/design-referenz.md` | Designbefunde, Abgrenzungsregeln |
| `research/domains/*.md`, `research/screens/` | Einzelanalysen, Screenshots Desktop/Mobil, JSON |
| `DESIGN_SYSTEM.md` | Konzepte, Tokens, Kontraste, Typo, Knöpfe, Hero-Varianten, Bildentscheidungen |
| `MOTION_AUDIT.md` | Bestandsanimationen → Speaker-Seite, Abweichungen |
| `INTEGRATION_REPORT.md` | Route, Änderungen am Bestand, Anfrage-Strecke, Domain |
| `QA_REPORT.md` | Messungen, behobene Fehler, Grenzen |
| `CONTENT_NEEDED.md` | Offene Freigaben und Material |
| `qa/` | QA-Screenshots, `qa-ergebnis.json` |

## Bis zur Live-Freigabe (Reihenfolge)

1. Freigaben aus `CONTENT_NEEDED.md` A (Bilder/Einwilligungen, Projektaussagen, Live-Demo, Datenschutz-Empfänger).
2. Code-Review-Befunde (OCR) erledigt, siehe Commit.
3. Deploy über den bestehenden Weg `/opt/promptwerker/ops/deploy.sh` auf Server 1 (Produktion) — nur nach ausdrücklicher Freigabe; danach Live-Messung der Routen mit Positivkontrolle und ein freigegebener Testversand.
4. Video + Stimmen nachrüsten (`CONTENT_NEEDED.md` B), das ist der größte Hebel für Buchungen.
5. Optional: `dennis-beichert.com` registrieren → 301 auf die Route.
