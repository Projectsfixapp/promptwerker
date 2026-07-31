// Einmaliges Setup-Skript für die Google-Kalender-Anbindung.
// Ausführen mit: node scripts/get-google-refresh-token.mjs
// Siehe KALENDER-SETUP.md für die vollständige Anleitung.

import http from "node:http";
import { google } from "googleapis";
import readline from "node:readline";

const PORT = 3999;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/calendar";

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer.trim());
  }));
}

async function main() {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || (await ask("Google OAuth Client ID: "));
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || (await ask("Google OAuth Client Secret: "));

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [SCOPE],
  });

  console.log("\nOeffne diesen Link im Browser und melde dich mit deinem Google-Konto an:\n");
  console.log(authUrl);
  console.log("\nWarte auf Bestaetigung im Browser ...\n");

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      const authCode = url.searchParams.get("code");
      if (authCode) {
        res.end("Fertig! Du kannst dieses Fenster jetzt schliessen und zum Terminal zurueckgehen.");
        server.close();
        resolve(authCode);
      } else {
        res.end("Kein Code erhalten, bitte Terminal pruefen.");
        server.close();
        reject(new Error("Kein 'code'-Parameter im Redirect erhalten."));
      }
    });
    server.listen(PORT);
  });

  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.refresh_token) {
    console.error(
      "\nKein Refresh-Token erhalten. Meist hilft: den App-Zugriff unter " +
        "https://myaccount.google.com/permissions einmal entfernen und dieses Skript erneut ausfuehren " +
        "(Google gibt einen Refresh-Token nur beim ALLERERSTEN Consent eines Kontos fuer diese App zurueck)."
    );
    process.exit(1);
  }

  console.log("\nGeschafft! Trag diesen Wert in web/.env.local ein:\n");
  console.log(`GOOGLE_CALENDAR_REFRESH_TOKEN=${tokens.refresh_token}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
