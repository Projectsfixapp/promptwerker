import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/legal";

/* KI-Crawler bewusst ausdrücklich erlaubt: Sichtbarkeit in
   Antwortmaschinen (ChatGPT, Claude, Perplexity, Google AI Overviews) ist
   für ein KI-Beratungsangebot ein Vertriebskanal, kein Risiko.
   /api und der Plasmic-Editor bleiben draußen — dort gibt es nichts zu
   indexieren. */

const KI_CRAWLER = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "cohere-ai",
  "meta-externalagent",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/plasmic-host", "/portal/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...KI_CRAWLER.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
