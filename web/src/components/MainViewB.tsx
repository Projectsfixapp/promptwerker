"use client";

import dynamic from "next/dynamic";
import { topics } from "@/lib/topics";
import TopicCard from "./TopicCard";
import FooterZone from "./FooterZone";
import RoadmapCard from "./RoadmapCard";
import AuditSection from "./AuditSection";
import TypewriterHeading from "./TypewriterHeading";
import ScrollAssemblyItem from "./ScrollAssemblyItem";

/* Alternative Startseite (/start-b): gleiche Inhalte wie MainView, aber
   - eigene H1 im Hero,
   - kompakter Reifegrad-Audit (AuditSection compact),
   - Audit-Block und Themenkarten setzen sich beim Scrollen aus
     verstreuten Positionen zusammen (ScrollAssemblyItem, DOM-basiert). */

// three.js + GSAP gehören nicht ins hydrations-kritische Bundle — gleiche
// Behandlung wie NeuralBackground.
const MagicRingScene = dynamic(() => import("./MagicRingScene"), { ssr: false });

export default function MainViewB({
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
          <h1 className="mt-4 text-4xl sm:text-5xl">Wir werden diesen Weg gemeinsam gehen!</h1>
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

      <ScrollAssemblyItem index={0}>
        <AuditSection compact onOpenContact={onOpenContact} />
      </ScrollAssemblyItem>

      <section id="topics-section" className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-24">
        <ScrollAssemblyItem index={1}>
          <RoadmapCard onOpenContact={onOpenContact} onOpenAppointment={onOpenAppointment} />
        </ScrollAssemblyItem>
        <ScrollAssemblyItem index={2} className="mt-16">
          <TypewriterHeading text="Anwendungsbereiche für deinen ersten KI-Mitarbeiter" />
        </ScrollAssemblyItem>
        {visibleTopics.map((topic, i) => (
          <ScrollAssemblyItem key={topic.id} index={3 + i}>
            <TopicCard topic={topic} onOpen={onSelectTopic} />
          </ScrollAssemblyItem>
        ))}
      </section>

      <MagicRingScene />

      <FooterZone />
    </main>
  );
}
