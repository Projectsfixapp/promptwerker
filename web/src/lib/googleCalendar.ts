import { google } from "googleapis";
import { TIME_ZONE } from "@/lib/businessHours";

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google-Kalender ist noch nicht konfiguriert (GOOGLE_CALENDAR_* Umgebungsvariablen fehlen — siehe KALENDER-SETUP.md)."
    );
  }
  const client = new google.auth.OAuth2(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

export async function getBusyIntervals(timeMin: Date, timeMax: Date) {
  const auth = getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIME_ZONE,
      items: [{ id: CALENDAR_ID }],
    },
  });
  const busy = res.data.calendars?.[CALENDAR_ID]?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: new Date(b.start as string), end: new Date(b.end as string) }));
}

export async function createBookingEvent(opts: {
  start: Date;
  end: Date;
  name: string;
  email: string;
  note?: string;
}) {
  const auth = getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    sendUpdates: "all",
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Kennenlernen: promptwerker <> ${opts.name}`,
      description: opts.note
        ? `Gebucht über promptwerker.de.\n\nNachricht von ${opts.name}:\n${opts.note}`
        : "Gebucht über promptwerker.de.",
      start: { dateTime: opts.start.toISOString(), timeZone: TIME_ZONE },
      end: { dateTime: opts.end.toISOString(), timeZone: TIME_ZONE },
      attendees: [{ email: opts.email, displayName: opts.name }],
      conferenceData: {
        createRequest: {
          requestId: `promptwerker-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  return {
    meetLink: res.data.hangoutLink ?? null,
    eventLink: res.data.htmlLink ?? null,
  };
}
