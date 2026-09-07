"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { topics } from "@/lib/topics";
import MainView from "./MainView";
import DetailView from "./DetailView";
import type { NeuralBackgroundHandle } from "./NeuralBackground";
import ContactFormReveal from "./ContactFormReveal";
import AppointmentFormReveal from "./AppointmentFormReveal";

// Code-split: three.js + postprocessing don't belong in the initial bundle that
// gates hydration/TTI — this pulls NeuralBackground into its own chunk, loaded
// client-side only, so it stops competing with critical-path JS on first load.
const NeuralBackground = dynamic(() => import("./NeuralBackground"), { ssr: false });

export default function SiteShell() {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [contactOrigin, setContactOrigin] = useState<{ x: number; y: number } | null>(null);
  const [contactMeta, setContactMeta] = useState<{ heading?: string; subject?: string }>({});
  const [showAppointment, setShowAppointment] = useState(false);
  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? null;
  const backgroundRef = useRef<NeuralBackgroundHandle>(null);

  function handleOpenContact(meta?: { heading?: string; subject?: string }) {
    setContactOrigin(backgroundRef.current?.getCtaOrigin() ?? null);
    setContactMeta(meta ?? {});
    setShowContact(true);
  }

  function handleOpenAppointment() {
    setShowAppointment(true);
  }

  useEffect(() => {
    document.documentElement.style.overflow =
      activeTopicId || showContact || showAppointment ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [activeTopicId, showContact, showAppointment]);

  /* Erlaubt Unterseiten und dem Footer, Overlays per Link zu öffnen:
     /?kontakt=1 (Kontaktformular) bzw. /?termin=1 (Terminbuchung).
     Das setState läuft im rAF-Callback statt synchron im Effect-Rumpf
     (react-hooks/set-state-in-effect). */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kontakt = params.get("kontakt") === "1";
    const termin = params.get("termin") === "1";
    if (!kontakt && !termin) return;
    const id = requestAnimationFrame(() => {
      if (kontakt) {
        setContactOrigin(null);
        setShowContact(true);
      }
      if (termin) setShowAppointment(true);
      window.history.replaceState(null, "", "/");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* Die Ansprechpartner-Karte im Footer feuert "pw-termin": hier abfangen
     und das Buchungs-Overlay weich öffnen statt die Seite neu zu laden. */
  useEffect(() => {
    function beiTermin(e: Event) {
      e.preventDefault();
      setShowAppointment(true);
    }
    window.addEventListener("pw-termin", beiTermin);
    return () => window.removeEventListener("pw-termin", beiTermin);
  }, []);

  function handleBack() {
    if (activeTopicId) backgroundRef.current?.highlightTopic(activeTopicId);
    setActiveTopicId(null);
  }

  return (
    <div className="relative">
      <NeuralBackground ref={backgroundRef} />
      <div className="relative z-10">
        <MainView
          onSelectTopic={setActiveTopicId}
          onOpenContact={handleOpenContact}
          onOpenAppointment={handleOpenAppointment}
        />
        <AnimatePresence>
          {activeTopic && (
            <DetailView key={activeTopic.id} topic={activeTopic} onBack={handleBack} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showContact && (
            <ContactFormReveal
              origin={contactOrigin}
              onClose={() => setShowContact(false)}
              heading={contactMeta.heading}
              subject={contactMeta.subject}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showAppointment && (
            <AppointmentFormReveal onClose={() => setShowAppointment(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
