# Designsystem — Speaker-Seite `/dennis-beichert`

Stand 09.11.2026. Grundlage: `research/benchmark.md`, `research/strategie.md`, `research/design-referenz.md`.

## 1. Drei Konzepte innerhalb Anthrazit × Lime × Blau

| | A — „Live Stage“ | B — „Digital Editorial“ ✅ gewählt | C — „Industrial Console“ |
|---|---|---|---|
| Idee | Vollflächige Bühnenfotos, Licht-Kegel, große Zahlen | Zeitungs-/Magazinraster: monumentale Headlines, nummerierte Abschnitte `[01]`, Linien statt Karten, Projekte als Reportage | Terminal-/Leitstand-Ästhetik: Mono überall, Statusleuchten, Raster-Panels |
| Marktunterscheidung | schwach — Buchholz, Klug, Gondlach arbeiten genau so | stark — kein Wettbewerber nutzt ein redaktionelles Raster; Ratheiser (dunkel + Lime) ist ein Einseiter mit Textmarkern und Graustufenfotos | mittel — wirkt schnell wie „Hacker-Template“, widerspricht „kein Informatiker“ |
| Persönlichkeit | Bühne, aber austauschbar | Unternehmer mit Haltung, Humor in Headlines („Kein Folien-Karaoke“) | technisch, kühl |
| Vertrauen | braucht viele echte Bühnenfotos (es gibt 3) | trägt über Inhalt: Projektstatus, Fehlschläge, Ablauf | Gefahr „Spielerei“ |
| Conversion | gut | gut: CTA im Hero über dem Fold (1440×900: Unterkante 870 px), Anfrage in Nav-Leiste, Karten-CTAs mit Themen-Vorauswahl | mittel |
| Umsetzbarkeit | hoch, aber Bildbedarf | hoch, kommt mit vorhandenem Material aus | mittel |

**Entscheidung B**, weil sie mit dem vorhandenen, belegten Material am meisten Eigenständigkeit erzeugt und die Lücke aus dem Benchmark besetzt (niemand zeigt echte Projekte mit Status). Elemente aus C fließen sparsam ein (Disket-Mono-Labels, Statusplaketten), A nur im Hero-Foto.

## 2. Tokens (`src/app/globals.css`, Block `.sp-buehne`)

| Token | Wert | Einsatz | Kontrast (WCAG) |
|---|---|---|---|
| `--sp-bg` | `#242A32` | Grundfläche (kein Schwarz) | — |
| `--sp-bg-raised` | `#303740` | Keynote- und Ablauf-Abschnitte, Felder | — |
| `--sp-bg-soft` | `#3A414A` | Nutzen-Abschnitt, Formularfläche | — |
| `--sp-text` | `#F0F3F5` | Text | 12,98:1 auf bg |
| `--sp-muted` | `#B9C3CD` | Fließtext sekundär | 8,09 / 6,73 / 5,77 :1 (bg/raised/soft) |
| `--sp-lime` | `#B8FF35` | Primär-CTA, Akzentzeilen, Labels | 11,98:1 auf bg |
| `--sp-ink-on-lime` | `#1B2026` | Schrift auf Lime | 13,58:1 |
| `--sp-blue` | `#168DFF` | Rahmen, Sekundär-CTA, **nur Großtext** | 4,33:1 (≥ 3:1 Großtext) |
| `--sp-blue-text` | `#6BB5FF` | kleine blaue Schrift | ≥ 4,76:1 auf allen Flächen |
| `--sp-stroke` | `#59616B` | Linien, Feldrahmen (nicht für Text) | 2,3:1 → nur Deko |
| `--sp-ziffer` | `#98A1AB` | gedämpfte Ziffern/Trenner | ≥ 4,59:1 |

Kontraste mit der WCAG-Formel nachgerechnet (09.11.2026). Zwei Erstversionen fielen durch (kleine Labels in `#168DFF`, Ziffern in `#59616B`) und wurden auf die Text-Tokens umgestellt.

## 3. Typografie

| Rolle | Schrift | Begründung / Lizenz |
|---|---|---|
| Display (H1–H3 der Speaker-Seite) | **Archivo Black** über `next/font/google`, nur auf dieser Route geladen | Plakativ, breit, eng gesetzt; Verwandtschaft zur bestehenden Archivo der Karten. SIL OFL 1.1, selbst gehostet durch next/font |
| Fließtext | IBM Plex Sans (Bestand) | Markenklammer zu promptwerker |
| Labels, Nummern `[01]` | Disket Mono (Bestand, Lizenz `docs/licenses/Disket-Mono-EULA.pdf`) | Markenklammer, sparsam |
| Karten-/UI-Text | Archivo 600/700 (Bestand) | Knöpfe, Formular |

Bewusst **nicht**: Poppins (Ratheiser), Kanit (Gondlach), Arial (Eilers).

## 4. Knöpfe (keine Pillen)

- **Primär `KEYNOTE ANFRAGEN`**: Lime-Fläche mit 14-px-Chamfer oben rechts + abgesetzte Pfeil-Zelle (4 px Abstand). Chamfer liegt auf `::before`, damit `clip-path` den globalen Fokusring nicht abschneidet. Höhe 48 px.
- **Sekundär `VORTRÄGE ANSEHEN`**: Blau-Rahmen, links 5 px, sonst 1,5 px (asymmetrisch), Hover Blau-Tönung 200 ms.
- **Text-CTA**: Unterstrich in Lime, Pfeil rückt bei Hover/Fokus 4 px nach rechts (200 ms).
- Hover-Skalierung aller CTAs = Startseite (`hover:scale-[1.03]`, `transition-transform`, 150 ms).
- Fokus: globaler Ring (3 px Cyan + dunkler Saum) bleibt unangetastet, gemessen sichtbar auf allen 14 ersten Tab-Zielen.

## 5. Raster und Rhythmus

12-Spalten-Raster, Abschnittskopf immer `Label 3 Spalten | Headline 9 Spalten`. Rhythmus: Hero → Unternavigation → [01] Praxis → [02] Keynotes (Signatur als Split-Panel + 4 Karten) → [03] Logbuch → [04] Nutzen → [05] Über mich → [06] Ablauf + FAQ → [07] Anfrage. Flächenwechsel bg / raised / soft statt Kartentapete. Mobil: eigene Reihenfolge durch Stapelung, Hero-Bild nach den CTAs, damit der Anfrageknopf im ersten Bildschirm liegt.

## 6. Hero-Varianten (Copy-Test)

| | Variante | Bewertung aus Veranstaltersicht |
|---|---|---|
| 1 ✅ | „WENIGER BLA BLA. MEHR MACHEN.“ + Zeile „Heavy User. Early Adopter. Crazy Vision Guy.“ + Ich-Text mit Agententeam | Haltung in 4 Wörtern, Nutzen im Absatz, Persönlichkeit in der Zeile. Positiv formuliert, die Abgrenzung „kein Informatiker“ steht erst in [05] |
| 2 | „KI-EXPERTE AUS DER PRAXIS. KEIN INFORMATIKSTUDIUM.“ | ehrlich, aber im ersten Moment defensiv — Veranstalter lesen zuerst, was fehlt |
| 3 | „ICH BAUE MIT KI-AGENTEN. UND ZEIGE, WAS DAVON KLAPPT.“ | sehr konkret, aber weniger plakativ, schwächer als Wiedererkennung |

## 7. Bilder

| Datei | Einsatz | Begründung |
|---|---|---|
| `03_promptwerker_keynote.jpg` | Hero (4:5-Ausschnitt), Startseiten-Teaser, OG-Bild | stärkstes Bühnenmotiv, Markenbezug |
| `01_workshop_promptwerker.jpg` | [01] Praxis | dokumentarisch, „mitten im Raum“ |
| `02_ki_keynote_blue.jpg` | **nicht eingesetzt** | zeigt das KI-Kopf-mit-Chip-Motiv, das die Art Direction ausschließt, und Statistiken („Statista/McKinsey/Bitkom 2024“, +21,7 % CAGR, 55 %, 32 %) ohne geprüfte Quelle — als Sachbeleg unzulässig |

Originale 01 und 03 unverändert in `web/public/speaker/` (MD5 identisch mit dem ZIP). 02 liegt bewusst nicht in `public/`, sonst wäre es nach einem Deploy öffentlich abrufbar; das Original bleibt im ZIP. Responsive Derivate (AVIF/WebP, mehrere Breiten) erzeugt `next/image` zur Laufzeit. Keine Datei hat native 4K-Maße; es wurde nichts hochskaliert.
