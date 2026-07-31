import type { MetadataRoute } from "next";
import { topics } from "@/lib/topics";
import { bottomCards } from "@/lib/bottomCards";
import { baseUrl } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ueber-uns`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${baseUrl}/leistungen/workshop-roadmap`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Rechtstexte gehören in die Sitemap: sie sind indexierbar und werden
    // von Interessenten aktiv gesucht ("AVV", "Auftragsverarbeitung").
    { url: `${baseUrl}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/agb`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/avv`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/barrierefreiheit`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/ki-transparenz`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const leistungenRoutes: MetadataRoute.Sitemap = [
    ...topics.filter((t) => t.enabled).map((t) => t.id),
    ...bottomCards.filter((c) => c.enabled && c.hasPage).map((c) => c.id),
  ].map((id) => ({
    url: `${baseUrl}/leistungen/${id}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...leistungenRoutes];
}
