"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { topics } from "@/lib/topics";
import MainView from "./MainView";
import DetailView from "./DetailView";
import NeuralBackground, { type NeuralBackgroundHandle } from "./NeuralBackground";
import Logo from "./Logo";
import ContactFormReveal from "./ContactFormReveal";

export default function SiteShell() {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [contactOrigin, setContactOrigin] = useState<{ x: number; y: number } | null>(null);
  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? null;
  const backgroundRef = useRef<NeuralBackgroundHandle>(null);

  function handleOpenContact() {
    setContactOrigin(backgroundRef.current?.getCtaOrigin() ?? null);
    setShowContact(true);
  }

  useEffect(() => {
    document.documentElement.style.overflow = activeTopicId || showContact ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [activeTopicId, showContact]);

  function handleBack() {
    if (activeTopicId) backgroundRef.current?.highlightTopic(activeTopicId);
    setActiveTopicId(null);
  }

  return (
    <div className="relative">
      <NeuralBackground ref={backgroundRef} />
      <Logo />
      <div className="relative z-10">
        <MainView onSelectTopic={setActiveTopicId} onOpenContact={handleOpenContact} />
        <AnimatePresence>
          {activeTopic && (
            <DetailView key={activeTopic.id} topic={activeTopic} onBack={handleBack} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showContact && (
            <ContactFormReveal origin={contactOrigin} onClose={() => setShowContact(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
