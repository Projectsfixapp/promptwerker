# Terminbuchung einrichten (Google Kalender + Meet) — Anleitung für Dennis

Kunden können sich auf der Seite direkt einen 30-Min-Termin für ein
Kennenlerngespräch aussuchen. Der Termin landet automatisch in deinem
Google Kalender, inklusive Google-Meet-Link — der Kunde bekommt die
Einladung direkt von Google per E-Mail, ohne dass wir selbst E-Mails
verschicken müssen.

Einmalige Einrichtung (ca. 10 Minuten), dann läuft es von selbst.

---

## 1. Google-Cloud-Projekt vorbereiten

Du hast bereits ein Google-Cloud-Projekt namens **`gkerze`** (aus dem
GA4/Search-Console-Setup für geilstekerze.de). Das nutzen wir mit:

1. Geh auf https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=gkerze
2. Klick auf **Aktivieren** (falls noch nicht aktiv).

## 2. OAuth-Zugangsdaten holen

Im selben Projekt gibt es bereits einen OAuth-"Desktop"-Client aus dem
GA4-Setup. Den verwenden wir wieder:

1. Geh auf https://console.cloud.google.com/apis/credentials?project=gkerze
2. Unter **OAuth 2.0-Client-IDs** den vorhandenen Desktop-Client anklicken
   (falls keiner da ist: **+ Anmeldedaten erstellen** → **OAuth-Client-ID** →
   Typ **Desktop-App** → Name z.B. "promptwerker-kalender").
3. **Client-ID** und **Client-Secret** kopieren.

## 3. Werte eintragen

1. Im Ordner `web/` die Datei `.env.local.example` kopieren und die Kopie
   `.env.local` nennen (falls noch nicht vorhanden).
2. Dort eintragen:
   ```
   GOOGLE_CALENDAR_CLIENT_ID=<deine Client-ID>
   GOOGLE_CALENDAR_CLIENT_SECRET=<dein Client-Secret>
   ```

## 4. Einmal dein Google-Konto verbinden (Refresh-Token holen)

Das ist der einzige Schritt, bei dem du selbst kurz im Browser bestätigen musst:

1. Terminal im Ordner `web/` öffnen.
2. Ausführen: `node scripts/get-google-refresh-token.mjs`
3. Das Skript fragt nach Client-ID/Secret (aus Schritt 3, oder Enter drücken
   wenn schon in `.env.local` gesetzt und per `.env`-Datei geladen) und
   druckt einen Link ins Terminal.
4. Den Link im Browser öffnen, mit dem Google-Konto anmelden, das deinen
   echten Kalender führt, und **Zugriff erlauben**.
5. Zurück im Terminal steht dann eine Zeile wie:
   ```
   GOOGLE_CALENDAR_REFRESH_TOKEN=1//0g...
   ```
   Diese Zeile 1:1 in `.env.local` einfügen.

**Wichtig:** Falls das Skript meldet "Kein Refresh-Token erhalten" — das
passiert, wenn dieses Google-Konto der App schon einmal zugestimmt hat.
Fix: auf https://myaccount.google.com/permissions den Zugriff der App
einmal entfernen, Skript erneut ausführen.

## 5. Fertig — testen

Seite neu starten (`npm run dev` bzw. Live-Deploy neu ausrollen), auf der
Startseite "Kostenloses Analysegespräch buchen" → Termin auswählen → mit
Test-Name/-Mail buchen. Der Termin sollte sofort in deinem Google Kalender
auftauchen, inklusive Meet-Link, und die Test-Mail-Adresse bekommt eine
Einladung von Google.

---

## Wie die Termine berechnet werden (aktuell fest im Code)

- Mo–Fr, 9:00–17:00 Uhr (Europe/Berlin), 30-Minuten-Slots
- Nächste 14 Tage, frühestens 2 Stunden ab jetzt buchbar
- Automatisch geblockt: alles, was schon in deinem Google Kalender steht

Anpassbar in `src/lib/businessHours.ts` (Konstanten oben in der Datei) —
sag einfach Bescheid, wenn sich deine Arbeitszeiten ändern sollen.
