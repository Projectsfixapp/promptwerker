# promptwerker.de — Projekt-Brief

Stand: 2026-06-21. Lebendes Dokument, wird pro Phase ergänzt.

## Entschieden

- **CMS:** WordPress, Custom Block-Theme + ACF Pro (kein Page-Builder)
- **Shop:** WooCommerce + WooCommerce Subscriptions (Einmalkauf + Abo)
- **Payment:** Stripe
- **Buchhaltung:** noch offen — austauschbare Abstraktionsschicht bauen, kein Tool fest verdrahtet
- **Hosting:** Render (Docker, bestehender Account/Workflow wie competitor-website-builder), MySQL via PlanetScale Free-Tier, Medien via Cloudflare R2 (aktuell 403, vor Launch klären)
- **CRM-Anbindungen (SAP/Salesforce/HubSpot, weitere):** keine Live-Zugänge vorhanden → als REST-Endpoints/Webhooks vorbereitet, direkte API (kein Zapier/Make), Live-Schaltung später
- **Animation-Tech (Update 2026-06-22, kippt frühere "kein Three.js"-Entscheidung):** Hero bekommt echte 3D-Szene (Three.js + GSAP ScrollTrigger), Grund: Dennis fand die alte Canvas-2D-Punktwolke ("Glasfaser-Netzwerk") über die ganze Seite zu unruhig/"wirr warr" und wollte etwas Spektakuläres mit echtem 3D-Scroll-Effekt. Three.js + GSAP/ScrollTrigger laufen als selbst gehostete ES-Module (kein npm-Build-Schritt im Docker-Image, passt zu vanilla PHP/Apache-Setup) — Dateien liegen unter `preview/js/vendor/three/` und `preview/js/vendor/gsap/`, geladen über `<script type="importmap">` (Browser-natives Import-Resolving, kein Bundler). Three-Version 0.184.0, GSAP 3.15.0.

## Design-Richtung (Update 2026-06-22: Kurswechsel zu dunklem PCB-Theme)

**Überholt:** ursprünglicher Plan war hell/weiß mit zurückhaltender Animation. Dennis hat per Referenz-Video (Screenrecording seiner eigenen Preview, durch einen Circuit-Board-Animationsgenerator gejagt) explizit ein **dunkles Navy-Theme mit Leiterbahn-Optik** bestätigt — bewusste Kursänderung, kein Missverständnis.

- Seitenhintergrund: dunkles Navy (`#060b18`)
- **Überholt durch Update 2026-06-22 (siehe Abschnitt "Hero-Animation" unten):** Die hier ursprünglich beschriebene ganzseitige Leiterbahn-Punktwolke (Branches vom Header zu jeder Section-Karte, Scroll-Spotlight-Gradient über die ganze Seite) ist verworfen — ersetzt durch eine auf den Hero begrenzte echte 3D-Szene. Sections nach dem Hero sind jetzt schlicht dunkel ohne Hintergrund-Geflecht.
- Section-Inhalte als weiße Karten (`.card`) mit Hover-Glow (Cyan-Schatten) — Karten selbst bleiben hell, nur der Seitenhintergrund ist dunkel
- Jede Karte hat einen CTA-Button mit gleichem Hover-Glow
- Logo (schwarz/grau-Wordmark) wird im dunklen Header per `filter: invert` auf Weiß umgefärbt — Platzhalter-Lösung, ein echtes weißes Logo-Asset wäre saubererer

### Typografie (Update)

- Headlines: **Disket Mono** Bold, All-Caps Display-Mono-Font (Mariano Diez/Rostype) — selbst gehostet (`preview/assets/fonts/`), Lizenz geprüft: frei für privat+kommerziell, Web-Font-Nutzung explizit erlaubt (`docs/licenses/Disket-Mono-EULA.pdf`)
- Card-Body-Text: Dennis wollte **Okomito Bold** — nur die Medium-Gewichtung ist kostenlos, Bold ist kostenpflichtig (Hanken Design Co./MyFonts). Übergangsweise **Archivo** (Google Fonts, ähnlicher industrieller Grotesk-Charakter, frei) eingesetzt. Offen: Dennis entscheidet ob Okomito-Lizenz gekauft wird oder Archivo bleibt.
- Fließtext außerhalb Karten (Hero-Lede, Nav): weiterhin IBM Plex Sans

### Tonfall (centigrade.de) bleibt unverändert gültig — betrifft nur Text, nicht Optik.

### Offene Interaktions-Entscheidung für spätere Phasen

Dennis will: Klick auf CTA einer Produktkarte öffnet Detailinfos **nicht** durch vertikales Scrollen zu einer neuen Seite, sondern als **seitliches Slide-Panel** (rechts oder links, je nachdem auf welcher Seite die Karte liegt). Technische Implikation für Phase 3/4: echte WP-Permalinks pro Detailseite (SEO/GEO-Pflicht), aber Klicks werden per JS abgefangen (PJAX-artig: fetch() + History-API + CSS-Transform-Slide), Fallback auf normale Navigation ohne JS. Noch nicht gebaut, nur entschieden — einplanen für Phase 3 (Use-Cases/Angebote) und Phase 4 (Produktseiten Shop).

## Tonfall (aus centigrade.de-Analyse)

Selbstbewusst-beratend, nicht laut-verkäuferisch. Mix aus kurzen Statements und erklärenden Sätzen. Gehobenes, jargonarmes Vokabular. Problemlösung wird narrativ erzählt, nicht als Feature-Liste gepredigt. Verboten: "Willkommen auf unserer Website", "Lösungen der Zukunft", generische KI-Buzzword-Sätze.

## Hero-Animation: 3D-Knoten-Netzwerk (Update 2026-06-22, ersetzt alte Canvas-2D-Version)

**Vorgänger verworfen:** Die ganzseitige Canvas-2D-Punktwolke (PCB-Gitter, von Header bis Footer durchgezogen, jede Section bekam einen "Branch") wirkte laut Dennis zu chaotisch/generisch ("wirr warr"). Ersetzt durch eine auf den Hero begrenzte echte 3D-Szene — sobald der Hero aus dem Viewport scrollt, verschwindet das Netzwerk komplett, restliche Sections bleiben clean (dunkler Hintergrund, weiße Karten, kein Background-Lärm).

- **Aufbau:** ~130 Knoten (mobil 60) zufällig in einer Kugel verteilt (dichter zur Mitte), je Knoten mit den 3 nächsten Nachbarn verbunden (Edges) → ein zusammenhängendes, organisch wirkendes 3D-Drahtgitter, kein Zufalls-Gewusel
- **Lichtimpulse:** ~50 helle Punkte (mobil 18) laufen kontinuierlich entlang zufälliger Kanten, biegen am Ende auf eine neue Kante ab — das ist der "Glasfaser-Lichtimpuls"-Effekt aus dem ursprünglichen Konzept, jetzt in echtem 3D statt auf einer flachen Canvas
- **Glow:** UnrealBloomPass (Three.js Postprocessing) auf Pulses+Knoten, Knoten selbst bewusst dunkel/klein gehalten (Schaltungs-Charakter), Pulses sind die hellen Akzente — sonst übersteuert der Bloom den Text (siehe Tuning-Historie unten)
- **Scroll-Kopplung:** GSAP ScrollTrigger (scrub) bewegt die Kamera während der Hero-Scrollstrecke nach vorn (Dolly-Effekt, "in die Szene hineinfliegen"), Netzwerk rotiert leicht mit; Canvas faded in der zweiten Hälfte der Hero-Scrollstrecke komplett aus
- **Textlesbarkeit:** `.hero-overlay` (radialer dunkler Vignetten-Gradient, zentriert) zwischen Canvas und Text-Container — ohne das war der erste Wurf mit hohem Bloom/großen Knotenpunkten direkt hinter dem zentrierten Headline-Text praktisch unlesbar; Vignette + kleinere/dimmere Knoten + niedrigere Bloom-Stärke haben das gelöst
- **Idle-Rotation:** Netzwerk dreht sich auch ohne Scroll langsam weiter (wirkt "lebendig")
- **Performance/Fallbacks (alle umgesetzt):**
  - `prefers-reduced-motion`: ein statisches Frame, kein Scroll-Camera-Move, kein Auto-Rotate, keine Pulse-Bewegung
  - Kein WebGL: Canvas bleibt leer, `.hero` hat einen CSS-Radial-Gradient als Basis-Hintergrund (kein Totalausfall)
  - Mobile: weniger Knoten/Pulses, `devicePixelRatio` auf 1 gecappt
  - Rendering pausiert komplett (IntersectionObserver), sobald der Hero nicht im Viewport ist — kein dauerhaft laufender WebGL-Loop auf der ganzen Seite
- **Technik:** Three.js 0.184.0 + GSAP/ScrollTrigger 3.15.0, beide selbst gehostet als ES-Module (`preview/js/vendor/`), kein npm-Build-Schritt im Deploy (passt zu vanilla PHP/Apache-Docker-Setup), Browser-natives Import-Map statt Bundler
- **Getestet:** Playwright-Screenshots bei Scroll 0/50%/110% der Hero-Höhe, Mobile-Viewport (390×844), `reducedMotion: 'reduce'`-Kontext, Konsolen-/Page-Error-Check, Hash-Diff über 3 Frames zur Animations-Bestätigung — alle ohne Fehler
- **Vor Launch noch offen:** vendorte Dateien sind unminifizierte Dev-Builds (drei.module.js ~650KB, three.core.js ~1.4MB, gsap-core.js ~170KB) — vor Production-Deploy auf minifizierte Builds wechseln; aktuell nur in `preview/`, Port in `wp-theme/promptwerker` steht noch aus (Arbeitsweise: erst hier visuell freigeben lassen)

## Themen-Abdeckung (Pflicht laut Dennis)

- KI-Voice-Agenten am Telefon
- Workflow-Automatisierung mit Praxisbeispielen
- Lead- und Sales-Autopilot
- CRM-Anbindung: SAP, Salesforce, HubSpot, weitere
- CTAs an möglichst vielen Stellen (jede Section braucht einen klaren nächsten Schritt)

## Site-Struktur (IA, aus altem Export übernommen + erweitert)

Hero → Problem/Pain → Stats → Services (4 Themen oben) → Process → Use-Cases (Praxisbeispiele) → Angebote/Preise (Einmalkauf/Abo) → Über uns → FAQ → Kontakt
Zusätzlich: Shop (Produktseiten, Warenkorb, Checkout), Kundenkonto/Login, Rechtsseiten (Impressum, Datenschutz, AGB, Widerruf)

## Realismus-Scope-Hinweis

"Backend-Dashboard, das die ganze Firma steuert" + Live-CRM/Buchhaltung ist Enterprise-Umfang. V1 liefert die integrationsfertige Architektur (Webhook-Empfänger, API-Client-Gerüste, Admin-UI-Platzhalter), Live-Verdrahtung folgt sobald echte Zugänge/Verträge existieren.

## Arbeitsweise

Section für Section, jede Section erst nach visueller Prüfung/Freigabe abgeschlossen, dann nächste (explizite Vorgabe von Dennis).
