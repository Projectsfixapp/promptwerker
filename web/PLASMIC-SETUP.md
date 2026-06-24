# Eigene Unterseiten bearbeiten (Plasmic) — Anleitung für Dennis

Mit Plasmic kannst du **eigene Unterseiten** (z.B. Leistungen, Über mich, Blog)
per Drag-and-Drop selbst bauen — ganz ohne Code. Die Startseite mit der
3D-Animation bleibt Code (die lässt sich nicht sinnvoll in einen Editor packen).

Unterseiten erscheinen unter `deine-domain.de/seite/...`, z.B.
`deine-domain.de/seite/leistungen`.

---

## Einmalige Einrichtung (ca. 10 Minuten)

### 1. Plasmic-Konto anlegen
- Geh auf https://studio.plasmic.app und registriere dich (kostenlos).
- Erstelle ein neues, leeres Projekt. Name egal, z.B. "promptwerker".

### 2. Die zwei Zugangswerte holen
- Im Projekt oben rechts: **Settings** (Zahnrad) → Bereich **Code** → **Next.js**.
- Dort stehen zwei Werte:
  - **Project ID** (kurze ID)
  - **API token** (längerer Schlüssel)
- Beides ist öffentlich (kein Passwort), darf in den Code.

### 3. Werte einsetzen
- Im Ordner `web/` liegt die Datei `.env.local.example`.
- Kopiere sie und nenne die Kopie `.env.local`.
- Trage die zwei Werte ein:
  ```
  NEXT_PUBLIC_PLASMIC_PROJECT_ID=<deine Project ID>
  NEXT_PUBLIC_PLASMIC_PROJECT_TOKEN=<dein API token>
  ```
- Speichern. (Sag mir Bescheid, ich mach das auch gern für dich.)

### 4. Den Editor mit der Seite verbinden ("App host")
- Starte die Seite lokal (oder nutze die Live-Domain).
- In Plasmic: **Settings → Code → App host / Host URL**.
- Trage die Adresse der Host-Seite ein:
  - lokal: `http://localhost:3000/plasmic-host`
  - live: `https://deine-domain.de/plasmic-host`
- Jetzt sieht der Editor deine Seite und deinen Baustein **"Promptwerker Logo"**.

---

## Eine Unterseite bauen

1. In Plasmic: **+ New page**.
2. Wichtig — beim Pfad der Seite **mit `/seite/` anfangen**, z.B.
   `/seite/leistungen`. (Sonst wird die Seite auf der Website nicht gefunden.)
3. Inhalte reinziehen: Texte, Bilder, Buttons, dein Logo.
4. Oben rechts auf **Publish** klicken.
5. Fertig — die Seite ist live unter `deine-domain.de/seite/leistungen`.

Farben, Schriften und Hintergrund der Hauptseite gelten automatisch auch für
deine Unterseiten — sie sehen also wie aus einem Guss aus.

---

## Was im Code passiert (nur zur Info)

- `src/lib/plasmic-init.ts` — Verbindung zu Plasmic + registrierte Bausteine.
- `src/lib/plasmic-init-client.tsx` — technischer Wrapper.
- `src/app/seite/[...catchall]/page.tsx` — zeigt deine Plasmic-Unterseiten an.
- `src/app/plasmic-host/page.tsx` — die "App host"-Seite für den Editor.

Solange keine Tokens gesetzt sind, ist alles inaktiv und die Website läuft
normal weiter (Unterseiten geben dann einfach 404 zurück).
