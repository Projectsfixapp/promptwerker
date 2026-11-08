# Integrationsbericht — Speaker-Bereich in promptwerker.de

Stand 09.11.2026. Nichts davon ist deployed. Live ist unverändert der Stand vor dieser Arbeit.

## Neue Route

- `web/src/app/dennis-beichert/page.tsx`: statisch vorgerendert, `id="inhalt"` für den Skip-Link, eigene Metadaten (Titel „Dennis Beichert — KI-Speaker aus der Praxis“, Description, Canonical `/dennis-beichert`, OG-Typ profile mit Bühnenbild), JSON-LD `ProfilePage` + `Person` (verknüpft per `worksFor` mit der bestehenden `#organisation`) + `FAQPage` + `BreadcrumbList`.
- Logo, Hauptnavigation, Footer, Rechtslinks und Skip-Link kommen unverändert aus dem Root-Layout. Es gibt keine zweite Hauptnavigation, nur eine Sprung-Leiste innerhalb der Seite (Praxis · Keynotes · Über mich · Anfrage) mit dem Wordmark „Dennis Beichert“ und dem Verweis „Gründer von promptwerker“.
- Unterrouten (`/dennis-beichert/keynotes` usw.) wurden **nicht** angelegt: zu wenig eigene Substanz, sie wären dünne Duplikate. Gemessen: `/dennis-beichert/xyz` → 404.
- Neue Dateien: `lib/motion.ts`, `lib/speaker.ts`, `lib/speakerAnfrage.ts`, `components/speaker/Bewegung.tsx`, `components/speaker/SpeakerAnfrage.tsx`, `components/SpeakerTeaser.tsx`, `public/speaker/*.jpg` (3 Originale, unverändert).

## Änderungen an bestehenden Seiten (alle minimal, alle zurücknehmbar)

| Datei | Änderung | Wirkung |
|---|---|---|
| `components/Nav.tsx` | Eintrag „Speaker“ (Desktop) bzw. „Speaker & Keynotes“ (Mobil), `aria-current` auf der Route | auf allen Seiten |
| `components/Footer.tsx` | Spalte „Unternehmen“: „Dennis als Speaker“ | auf allen Seiten |
| `components/MainView.tsx` | Teaser „KI auf der Bühne. Direkt aus der Praxis.“ nach den Themenkarten, in Startseiten-Optik | nur Startseite |
| `lib/bottomCards.ts` + `app/leistungen/[slug]/page.tsx` | optionales Feld `querverweis`, nur bei Schulungen gesetzt: „Keynote für Konferenz oder Firmenevent gesucht? → Dennis Beichert als Speaker“ | nur Schulungsseite; andere Leistungsseiten unverändert |
| `app/ueber-uns/page.tsx` | im Ansprechpartner-Block: „Dennis auch als Keynote-Speaker erleben →“ | nur Über uns |
| `components/FooterContactForm.tsx` | auf `/dennis-beichert` Verweis statt zweitem Formular | nur Speaker-Seite; überall sonst gemessen unverändert (1 Formular) |
| `app/sitemap.ts`, `public/llms.txt` | Eintrag `/dennis-beichert` | — |
| `app/datenschutz/page.tsx`, `lib/legal.ts` | Absatz zu den Speaker-Formularfeldern in Ziffer 5, `rechtsstand` → 8. November 2026 | Rechtsstand erscheint unter allen Rechtstexten |
| `components/TypewriterHeading.tsx` | optionales `className`/`id`, `aria-label` mit vollem Text | Startseite optisch unverändert |
| `TopicCard`, `RoadmapCard`, `DetailView`, `ContactFormReveal`, `AppointmentFormReveal` | Bewegungswerte aus `lib/motion.ts` importiert statt als Literal | Werte identisch |
| `app/globals.css` | Block `.sp-buehne` + `sp-*`-Klassen | greift nur innerhalb der Speaker-Seite |

Abgrenzung zur Schulungsseite: Schulungen = Team befähigen (mehrstündig, praktisch), Keynote = Impuls für ein Publikum. Gegenseitig verlinkt, kein doppelter Text, eigene Suchintention (Titel „KI-Speaker“ vs. „Schulungen & Fachvorträge“).

## Anfrage-Strecke

- Gleiche Route `POST /api/kontakt`, neuer optionaler `anfrageTyp: "speaker"`. Ohne Typ verhält sich die Route exakt wie vorher (gemessen).
- Pflichtfelder Speaker: Name, Organisation, E-Mail, Art der Veranstaltung, Format, Nachricht, Einwilligung. Optional: Telefon, Ort, Datum, Publikum, Wunschthema. Auswahlfelder nur aus festen Listen (`lib/speakerAnfrage.ts`, Server und Formular teilen sie), Datum nur `JJJJ-MM-TT`.
- Gleicher Schutz: Honigtopf, 5 Anfragen/Stunde/IP, Header-Injection-Schutz (`einzeilig`), HTML-Escape in der Mail.
- Mail: Betreff „Speaker-/Keynote-Anfrage über promptwerker.de — Name (Organisation)“, Eventfelder oben in Text- und HTML-Teil.
- Ohne SMTP (lokal): 503 → Formular zeigt E-Mail und Telefon als Ersatzweg, kein Schein-Erfolg (gemessen).
- **Nicht getestet: echter Versand.** Laut Deploy-Notiz ist SMTP auf dem Server gesetzt. Ein Produktivtest wurde bewusst nicht gemacht (keine Testmails ohne Freigabe).
- Keynote-Karten setzen über `data-thema` das Wunschthema vor (gemessen).

## Domain `dennis-beichert.com`

Read-only geprüft am 08./09.11.2026: NXDOMAIN, nicht erreichbar. Keine Weiterleitung eingerichtet, keine DNS-Änderung. Siehe `CONTENT_NEEDED.md` C.

## Rückweg

Ein Commit auf `main` (lokal), mit `git revert <hash>` vollständig zurücknehmbar. Live-Server unberührt.
