"use client";

import dynamic from "next/dynamic";
import { topics } from "@/lib/topics";
import TopicCard from "./TopicCard";
import FooterZone from "./FooterZone";
import RoadmapCard from "./RoadmapCard";
import AuditSection from "./AuditSection";
import TypewriterHeading from "./TypewriterHeading";

// three.js + GSAP gehören nicht ins hydrations-kritische Bundle — gleiche
// Behandlung wie NeuralBackground.
const MagicRingScene = dynamic(() => import("./MagicRingScene"), { ssr: false });

export default function MainView({
  onSelectTopic,
  onOpenContact,
  onOpenAppointment,
}: {
  onSelectTopic: (id: string) => void;
  onOpenContact: (meta?: { heading?: string; subject?: string }) => void;
  onOpenAppointment: () => void;
}) {
  const visibleTopics = topics.filter((topic) => topic.enabled);

  return (
    <main id="inhalt" className="relative">
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
        </div>
      </section>

      <AuditSection onOpenContact={onOpenContact} />

      <section id="topics-section" className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-24">
        <RoadmapCard onOpenContact={onOpenContact} onOpenAppointment={onOpenAppointment} />
        <div className="mt-16">
          <TypewriterHeading text="Anwendungsbereiche für deinen ersten KI-Mitarbeiter" />
        </div>
        {visibleTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onOpen={onSelectTopic} />
        ))}
      </section>

      <MagicRingScene />

      <FooterZone />
    </main>
  );
}
