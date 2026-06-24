"use client";

import { topics } from "@/lib/topics";
import { bottomCards } from "@/lib/bottomCards";
import TopicCard from "./TopicCard";
import CardCarousel3D from "./CardCarousel3D";

export default function MainView({
  onSelectTopic,
  onOpenContact,
}: {
  onSelectTopic: (id: string) => void;
  onOpenContact: () => void;
}) {
  const visibleTopics = topics.filter((topic) => topic.enabled);
  const visibleBottomCards = bottomCards.filter((card) => card.enabled);

  return (
    <main className="relative">
      <section className="flex min-h-[92vh] items-center px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            KI Lösungen für den Mittelstand
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl">
            Wir bauen deinen KI-Mitarbeiter,
            <br />
            der in deinem System lebt und arbeitet.
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-accent">
            Stabil, skalierbar und DSGVO-konform.
          </p>
          <p className="mt-6 text-base leading-relaxed text-body">
            Voice-Agenten am Telefon, automatisierte Workflows, Leads im Autopilot: Wir bauen die
            KI-Systeme, die dein Unternehmen tatsächlich entlastet. Keine Theorie, sondern ein
            fertiges System in Wochen statt Monaten.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenContact}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
            >
              Kostenloses Analysegespräch buchen
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-24">
        {visibleTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onOpen={onSelectTopic} />
        ))}
      </section>

      <CardCarousel3D cards={visibleBottomCards} />
    </main>
  );
}
