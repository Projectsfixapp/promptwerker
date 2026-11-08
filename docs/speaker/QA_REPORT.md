# QA-Bericht — `/dennis-beichert` und Bestand

Gemessen 08./09.11.2026 lokal gegen den Produktions-Build (`npm run build` + `next start`, Port 3111). Live ist nicht betroffen.

**Positivkontrolle für jede Messrunde:** Jede im HTML referenzierte Chunk-Datei muss im aktuellen `.next/static` liegen. Zweimal lieferte ein verwaister alter Server aus (TaskStop beendet nur `npm`, nicht `node`). Diese Runden wurden verworfen und wiederholt. Skript: `scratchpad/tools/neustart.ps1` (Session-Ordner).

## Build und statische Prüfung

| Prüfung | Ergebnis |
|---|---|
| `npm run build` inkl. TypeScript | ✅ grün, `/dennis-beichert` statisch (○) |
| `npm run lint` | ✅ keine neuen Befunde. Vorbestehend: 1 Fehler `MagicRingScene.tsx:91`, Warnungen `NeuralBackground.tsx:72`, `RoadmapCard.tsx:9` (ungenutzter Prop, schon vorher) |
| Text-Hygiene (unsichtbare Unicode-Zeichen) | ✅ alle 15 angefassten Dateien 0 Treffer; Positivkontrolle mit U+200B → Treffer erkannt |

## Routen (inkl. Positivkontrolle 404)

`/`, `/dennis-beichert`, `/ueber-uns`, `/leistungen/schulungen-fachvortraege`, `/leistungen/voice-agenten`, `/datenschutz`, `/impressum`, `/sitemap.xml`, `/robots.txt`, `/llms.txt` → 200. `/gibt-es-nicht-xyz` und `/dennis-beichert/xyz` → 404. Canonical `https://promptwerker.de/dennis-beichert`, JSON-LD Person/ProfilePage/FAQPage vorhanden. Crosslinks auf Startseite, Schulungen, Über uns, Footer und Sitemap jeweils vorhanden.

## API `/api/kontakt`

| Fall | Erwartet | Ergebnis |
|---|---|---|
| Bestandsanfrage ohne Typ | unverändert | ✅ 503 SMTP_NICHT_KONFIGURIERT (lokal ohne SMTP, wie vorher) |
| Speaker gültig | Validierung bestanden | ✅ 503 (erreicht den Versand) |
| ohne Organisation / falsche Eventart `<script>` / falsches Format / Datum „morgen“ / ohne Einwilligung | 400 mit Klartext | ✅ alle 5 |
| Honigtopf gefüllt | 200, kein Versand | ✅ |

## Browser (Chromium/Playwright)

| Prüfung | Ergebnis |
|---|---|
| Breiten 320/390/768/1024/1440/1920 (Speaker) + 390/1440 (Start, Schulungen, Über uns) | ✅ 0 px horizontaler Überlauf, 0 Konsolenfehler, 12 Kombinationen |
| CTA im ersten Bildschirm | ✅ 1440×900: Unterkante „Keynote anfragen“ 870 px (vorher 950+, korrigiert); 390×844: im Fold |
| Tastatur | ✅ Reihenfolge Skip-Link → Logo → Nav → Hero-CTAs → Sprungleiste …; Fokusring 3 px auf allen Zielen; Ziele ≥ 44 px (Ausnahme: Hauptnav-Einträge 36 px, Bestand) |
| Reduzierte Bewegung | ✅ Formular sofort sichtbar (clip 150 %) |
| Themen-Vorauswahl aus Keynote-Karte | ✅ „Wem gehört deine KI?“ gesetzt |
| Leeres Absenden | ✅ Browser-Validierung stoppt bei „name“ |
| Ausgefüllt ohne SMTP | ✅ Ersatzweg mit E-Mail + Telefon, kein falscher Erfolg |
| Doppelformular | ✅ Speaker-Seite 1 Formular (Footer verweist), Über uns weiterhin Footer-Formular |
| Startseite | ✅ Teaser sichtbar und im Rhythmus; 1 Heading der MagicRingScene nach Scroll nicht voll sichtbar — Bestand, nicht berührt |

## Kontrast

Nachgerechnet (WCAG-Formel), Details in `DESIGN_SYSTEM.md`. Zwei Erstfehler (kleine blaue Labels 3,6–4,3:1, Ziffern 2,3:1) behoben → alle Texte ≥ 4,5:1, große Headline in Neonblau 4,33:1 (Großtext ≥ 3:1).

## Performance (Median aus 3 Läufen, Chromium Performance-API)

Mobil = 390×844, 4× CPU-Drosselung, 1,6 Mbit/s, 150 ms RTT. Lokaler Server, deshalb TTFB nicht aussagekräftig; im Netz kommt die echte Latenz dazu.

| Seite | LCP | CLS | Transfer | JS |
|---|---|---|---|---|
| `/dennis-beichert` mobil | **1,46 s** (erste Fassung 4,0 s, siehe Motion-Audit) | 0 | 580 KB | 262 KB |
| `/dennis-beichert` Desktop | 0,48 s | 0,038 | 597 KB | 262 KB |
| `/` mobil (Vergleich) | 1,29 s | 0 | 899 KB | 423 KB |
| `/` Desktop (Vergleich) | 0,31 s | 0 | 1.932 KB | 429 KB |

Kein Lighthouse-Lauf (nicht installiert). INP nicht gemessen (braucht echte Nutzerinteraktion bzw. Felddaten).

## Behobene Fehler während der QA

1. Kreis-Reveal blieb in Chromium dauerhaft zu → Formular unsichtbar und unklickbar (siehe `MOTION_AUDIT.md` 3.2).
2. Hydration-Mismatch bei reduzierter Bewegung (bedingtes Rendern) → gleiche Struktur, Dauer 0.
3. Mobil-LCP 4,0 s durch gestaffelten Hero → Hero statisch wie Startseite.
4. CTA unter dem Desktop-Fold → H1 und Abstand verkleinert.
5. Zwei konkurrierende Formulare auf der Speaker-Seite → Footer-Verweis.
6. Kontrast kleiner Labels und Ziffern → Text-Tokens.

## Nicht geprüft

Safari/Firefox (nur Chromium), echte Screenreader (nur Struktur: Labels, `aria-live`, Landmarken, H-Hierarchie), echter Mailversand, Live-Server.

## Optik-Audit

Frage aus dem Auftrag: eigene Speaker-Website oder weitere KI-Landingpage? Befund: kein Verlauf, kein Glas, kein Roboter/Gehirn, keine Kartentapete, kein Lime-Textmarker. Redaktionelles Raster, Nummerierung, eckige Knöpfe, echte Fotos, Projekte mit Status und Fehlschläge. Grenze: Ohne Video und Veranstalterstimmen wirkt die Seite inhaltlich stärker als die Belegseite. Das ist kein Designproblem, sondern fehlendes Material (`CONTENT_NEEDED.md` B).
