# Motion-Audit — gleiche Bewegungs-DNA wie promptwerker.de

Stand 09.11.2026. Grundsatz: Die Speaker-Seite erfindet keine eigenen Bewegungswerte. Alle Parameter stehen seit diesem Umbau **einmal** in `web/src/lib/motion.ts` und werden von Startseite und Speaker-Seite gemeinsam importiert. Vorher standen sie als Literale in den Startseiten-Komponenten, die Werte selbst wurden nicht verändert.

## 1. Inventur des Bestands (aus dem Quelltext, nicht geschätzt)

Bibliotheken im Repo nachgewiesen: `motion` 12.40 (motion/react), `gsap` 3.15 + ScrollTrigger, `three` 0.184. Keine weitere Animationsbibliothek installiert.

| Bestandsanimation | Quelle | Parameter |
|---|---|---|
| Themenkarte: seitlicher Eintritt | `TopicCard.tsx` | x ±48 → 0, opacity 0 → 1, Feder stiffness 90 / damping 18, einmalig bei 40 % Sichtbarkeit |
| Themenkarte: Hover | `TopicCard.tsx` | y −4, scale 1,015, 0,25 s easeOut; Glow-Schatten `transition-[box-shadow,border-color] duration-300` |
| Roadmap-Karte: Fade-up | `RoadmapCard.tsx` | y 24 → 0, opacity, 0,6 s, cubic-bezier(0.22, 1, 0.36, 1), einmalig 40 % |
| Detail-Panel: Slide | `DetailView.tsx` | x ±100 % → 0, 1,2 s, gleiche Kurve |
| Detail-Panel: Inhalt gestaffelt | `DetailView.tsx` | y 14, Verzögerung 0,22 s + 0,06 s je Element, 0,4 s easeOut |
| Kontakt-/Termin-Overlay: Kreis-Reveal | `ContactFormReveal.tsx`, `AppointmentFormReveal.tsx` | clip-path circle 0 % → 150 %, 1,4 s, gleiche Kurve |
| Schreibmaschinen-Überschrift | `TypewriterHeading.tsx` | 35 ms je Zeichen, Start bei 50 % Sichtbarkeit, blinkender Cursor |
| CTA-Hover | alle Startseiten-CTAs | `hover:scale-[1.03]`, `transition-transform` (150 ms) |
| Logo schrumpft beim Scrollen | `Logo.tsx` (global) | scale 1 → 0,34 über 300 px |
| Zurück-Knopf magnetisch | `BackButton.tsx` | Feder 300/20/0,4 — nur in Overlays |
| Ansprechpartner-Karte, Energie-Ringe, laufender Rand | `AnsprechpartnerCard.tsx` + `globals.css` (GSAP + Keyframes) | im globalen Footer |
| 3D-Szenen (Neuronetz, Zauberring) | `NeuralBackground.tsx`, `MagicRingScene.tsx` | three.js + GSAP ScrollTrigger, nur Startseite |
| Startseiten-Hero | `MainView.tsx` | **keine Eintrittsanimation** — Text sofort sichtbar |

## 2. Zuordnung auf der Speaker-Seite

| Bestandsanimation | Original | Einsatz Speaker-Seite | Mobil | Test | Abweichung |
|---|---|---|---|---|---|
| Hero statisch | MainView | Hero ohne Eintritt | gleich | LCP-Messung | keine |
| Fade-up | RoadmapCard → `Auftritt` | alle Abschnittsköpfe, Fotos, Nutzen, Ablauf, FAQ-Kopf | gleich | Browser, Opacity nach Scroll = 1 | keine |
| Seitlicher Feder-Eintritt | TopicCard → `SeitenEintritt` | Projekte [01], Keynote-Karten [02], Logbuch [03] — abwechselnd links/rechts wie die Themenkarten | gleich | Browser | keine |
| Hover-Anheben + Glow | TopicCard → `SeitenEintritt anheben` | Keynote-Karten; Glow-Farbe Lime bzw. Blau statt Cyan | Hover entfällt auf Touch, wie Startseite | Browser | nur Farbe |
| Schreibmaschine | TypewriterHeading (direkt importiert) | „Geschichten aus dem Kaninchenbau“ | gleich | Browser | Typografie per neuem optionalem `className`; ohne Angabe Startseite unverändert. Zusätzlich `aria-label` auf dem h2, damit Screenreader den ganzen Titel lesen statt Teilstände |
| CTA-Hover scale 1,03 | Startseiten-CTAs | alle Speaker-Knöpfe | — | Browser | keine |
| Kreis-Reveal | ContactFormReveal → `KreisReveal` | Anfrageformular [07] | gleich | Browser, clip-path nach Scroll = 150 % | **Ableitung:** gleiche Dauer und Kurve, aber beim Hineinscrollen statt beim Klick ausgelöst. Kein exaktes Gegenstück |
| Logo-Schrumpfen, Nav, Footer-Animationen | global | automatisch identisch | gleich | Browser | keine |
| Gestaffelter Inhalt | DetailView | **bewusst nicht** im Hero (siehe 3.) | — | Messung | — |
| 3D-Szenen, magnetischer Zurück-Knopf | Startseite/Overlays | nicht verwendet | — | — | kein passendes Element, kein WebGL-Upgrade (Auflage 0A.8) |

## 3. Zwei Befunde aus der Prüfung

1. **Gestaffelter Hero verworfen.** Die erste Fassung ließ den Hero mit der DetailView-Staffel einlaufen. Gemessen (Mobil, 4× CPU, 1,6 Mbit/s): LCP 4,0 s, weil der Hero-Absatz bis zur Hydration `opacity: 0` hat. Der Startseiten-Hero ist statisch. Mit statischem Hero sinkt die LCP (Wert in `QA_REPORT.md`), und die Parität ist sogar genauer.
2. **Kreis-Reveal + whileInView bricht in Chromium.** Ein Element, das selbst `clip-path: circle(0%)` trägt, gilt für den IntersectionObserver als unsichtbar, `whileInView` feuert nie. Das Formular wäre unsichtbar und unklickbar geblieben (gemessen: 55 % im Viewport, Clip bleibt 0 %). Fix: ungeclippter Außenrahmen beobachtet, Clip innen. Die Startseiten-Overlays sind nicht betroffen (sie animieren beim Mount, ohne Observer).

## 4. Reduzierte Bewegung

- Global (Bestand): CSS-Regel kürzt alle CSS-Übergänge auf 0,01 ms.
- Speaker-Seite zusätzlich: `<MotionConfig reducedMotion="user">` schaltet Transformationen der motion-Animationen ab, Deckkraft bleibt; Kreis-Reveal mit Dauer 0. Gemessen: Formular bei `reduced_motion=reduce` sofort sichtbar (clip 150 %).
- **Befund Bestand (nicht geändert):** Die Startseite setzt kein `MotionConfig`. Ihre motion-Animationen (Feder-Eintritt, Fade-up) laufen auch bei „Bewegung reduzieren“ mit Bewegung. Empfehlung: dieselbe Zeile in `SiteShell` ergänzen. Nicht gemacht, weil Auflage 0A.8 Nebenwirkungen auf andere Seiten ausschließt.

## 5. Regression der Bestandsanimation

Werte unverändert (nur Import statt Literal): `TopicCard`, `RoadmapCard`, `DetailView`, `ContactFormReveal`, `AppointmentFormReveal`. Build + TypeScript grün; Startseite und Schulungsseite im Browser bei 390 und 1440 px ohne Konsolenfehler und ohne Überlauf. Ein Startseiten-Heading („Wir binden die Tools an …“) ist nach dem Durchscrollen nicht voll sichtbar. Es gehört zur scrollgesteuerten MagicRingScene (Bestand) und ist von diesem Umbau nicht berührt.
