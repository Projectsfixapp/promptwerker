# promptwerker.de — Projekt-Brief

Stand: 2026-06-21. Lebendes Dokument, wird pro Phase ergänzt.

## Entschieden

- **CMS:** WordPress, Custom Block-Theme + ACF Pro (kein Page-Builder)
- **Shop:** WooCommerce + WooCommerce Subscriptions (Einmalkauf + Abo)
- **Payment:** Stripe
- **Buchhaltung:** noch offen — austauschbare Abstraktionsschicht bauen, kein Tool fest verdrahtet
- **Hosting:** Render (Docker, bestehender Account/Workflow wie competitor-website-builder), MySQL via PlanetScale Free-Tier, Medien via Cloudflare R2 (aktuell 403, vor Launch klären)
- **CRM-Anbindungen (SAP/Salesforce/HubSpot, weitere):** keine Live-Zugänge vorhanden → als REST-Endpoints/Webhooks vorbereitet, direkte API (kein Zapier/Make), Live-Schaltung später

## Design-Richtung

- Hell, weiß/hellgrau Hintergrund, Königsblau als einzige Akzentfarbe
- Editorial-Minimalismus (Vorbild-Tonfall: links.centigrade.de) statt generischem AI-SaaS-Look
- Zurückhaltende Animation: dünne Linien, kein Neon/Glow/Glassmorphism — wirkt wie Präzisionstechnik, nicht wie AI-Template
- Großzügige, konsistente Abstände bei Text/Karten/Buttons (Spacing-Skala vorher festlegen, nicht ad-hoc)

## Tonfall (aus centigrade.de-Analyse)

Selbstbewusst-beratend, nicht laut-verkäuferisch. Mix aus kurzen Statements und erklärenden Sätzen. Gehobenes, jargonarmes Vokabular. Problemlösung wird narrativ erzählt, nicht als Feature-Liste gepredigt. Verboten: "Willkommen auf unserer Website", "Lösungen der Zukunft", generische KI-Buzzword-Sätze.

## Hero-Animation: Glasfaser-Netzwerk

- Blaues Geflecht aus glasartigen Strängen, helle Lichtimpulse schießen durch
- Dichte/Breite des Geflechts nimmt zur Seitenmitte hin zu, Lichtimpulse werden dort schneller; zu den Rändern (oben/unten) nimmt beides wieder ab
- Von der Mitte aus laufen Stränge zu den einzelnen Sektionen; sobald eine Sektion beim Scrollen erreicht wird, verdichten sich die Lichtimpulse an dieser Stelle (Scroll-Trigger-Kopplung)
- Muss auf Mobile fehlerfrei laufen (Performance-Budget, `prefers-reduced-motion`-Fallback)
- Technik: Canvas/SVG + GSAP ScrollTrigger (kein Three.js — Overkill für 2D-Effekt, schlechter für Mobile-Performance)
- Vorarbeit existiert bereits in der alten React-Version (`MeshBackground.tsx` aus dem Manus-Export) — Konzept (Knoten/Linien, scroll-abhängige Helligkeit) wiederverwendbar, Umsetzung wird komplett neu in der Theme-Engine gebaut

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
