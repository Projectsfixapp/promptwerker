"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { auditQuestions, AUDIT_CATEGORIES, auditSources } from "@/lib/audit";
import SynapseStrands from "./SynapseStrands";

type Stage = "intro" | "question" | "result";

// Reifegrad-Audit nutzt das bereits im Rest der Seite verwendete Blau
// (--color-accent) statt Magenta — ACCENT für Flächen/Buttons/Ränder,
// ACCENT_TEXT (dunkler) für Text/Icons auf hellem Grund (Kontrast).
const ACCENT = "var(--color-accent)";
const ACCENT_TEXT = "var(--color-accent-deep)";
const PAPER_INK = "var(--color-paper-ink)";
const PAPER_BODY = "var(--color-paper-body)";

function MethodologyDisclosure({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mx-auto mt-6 max-w-md text-left">
      <button
        type="button"
        onClick={onToggle}
        className="mx-auto flex items-center gap-1.5 text-xs font-semibold"
        style={{ color: PAPER_BODY }}
      >
        Basis unseres Reifegrad-Modells
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <div
          className="mt-3 rounded-2xl border p-4"
          style={{ borderColor: "rgba(21,18,27,0.1)", background: "white" }}
        >
          <p className="font-card-body text-xs leading-relaxed" style={{ color: PAPER_BODY }}>
            Unsere 4 Kategorien sind an öffentlich dokumentierten Dimensionen aus den folgenden
            Quellen orientiert — wir stehen in keiner Partnerschaft, Zertifizierung oder
            Zusammenarbeit mit diesen Organisationen, sondern nutzen nur deren frei zugängliche
            Konzepte als fachliche Referenz.
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {auditSources.map((s, i) => (
              <li key={`${s.framework}-${i}`} className="text-xs">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ background: "var(--color-accent-soft)", color: ACCENT_TEXT }}
                  >
                    {s.category}
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold underline-offset-2 hover:underline"
                    style={{ color: PAPER_INK }}
                  >
                    {s.framework} ({s.year})
                  </a>
                </div>
                <p className="mt-1 font-card-body leading-relaxed" style={{ color: PAPER_BODY }}>
                  {s.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AuditSection({
  onOpenContact,
}: {
  onOpenContact: (meta?: { heading?: string; subject?: string }) => void;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(auditQuestions.length).fill(null),
  );
  const [showWhy, setShowWhy] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  // Karte wächst beim Reinscrollen (0 → 0.14), bleibt beim Nutzen voll da
  // (0.14 → 0.86) und schrumpft beim Weiterscrollen wieder weg (0.86 → 1) —
  // in beide Richtungen, weil scrollYProgress rein positionsbasiert ist.
  const cardScale = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0.4, 1, 1, 0.4]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  // CTA wirkt "hinterleuchtet", sobald die Synapsen ihn erreicht haben.
  const ctaGlow = useTransform(scrollYProgress, [0.1, 0.16], [0, 1]);

  const total = auditQuestions.length;
  const question = auditQuestions[index];
  const selected = answers[index];

  function selectOption(score: number) {
    const next = [...answers];
    next[index] = score;
    setAnswers(next);
  }

  function goNext() {
    setShowWhy(false);
    if (index === total - 1) {
      setStage("result");
      return;
    }
    setIndex(index + 1);
  }

  function goBack() {
    setShowWhy(false);
    if (index === 0) {
      setStage("intro");
      return;
    }
    setIndex(index - 1);
  }

  function skipToTopics() {
    document.getElementById("topics-section")?.scrollIntoView({ behavior: "smooth" });
  }

  const totalScore = answers.reduce((sum: number, s) => sum + (s ?? 0), 0);
  const maxScore = total * 4;
  const score10 = Math.round((totalScore / maxScore) * 100) / 10;

  const categoryBreakdown = AUDIT_CATEGORIES.map((cat) => {
    const qs = auditQuestions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.category === cat);
    const sum = qs.reduce((s, { i }) => s + (answers[i] ?? 0), 0);
    const max = qs.length * 4;
    return { category: cat, pct: max ? Math.round((sum / max) * 100) : 0 };
  });

  return (
    <div id="audit-section" ref={wrapperRef} className="relative mx-4 mb-10 sm:mx-8">
      <motion.div
        className="glass-panel-liquid relative overflow-hidden rounded-[2rem]"
        style={{ scale: cardScale, opacity: cardOpacity, transformOrigin: "top center", color: PAPER_INK }}
      >
        <SynapseStrands progress={scrollYProgress} />
        <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 sm:py-20">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <span
                className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "var(--color-accent-soft)", color: ACCENT_TEXT }}
              >
                KI-Reifegrad-Audit · 10 Fragen · Kostenlos
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl">
                Wo steht dein Unternehmen wirklich auf dem Weg zur KI?
              </h2>
              <p className="mx-auto mt-4 max-w-lg font-card-body text-base leading-relaxed" style={{ color: PAPER_BODY }}>
                Eine ehrliche Standortbestimmung in unter 5 Minuten. Am Ende bekommst du einen
                Reifegrad-Score und eine klare Empfehlung, wie es weitergeht.
              </p>

              <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left">
                {[
                  "Score 0–10 mit Aufschlüsselung nach Kategorie",
                  "Keine Anmeldung, keine versteckten Verkaufsschleifen",
                  "Am Ende: konkrete Empfehlung statt Buzzwords",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 font-card-body text-sm" style={{ color: PAPER_BODY }}>
                    <span className="mt-0.5 shrink-0" style={{ color: ACCENT_TEXT }}>
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col items-center gap-3">
                <div className="relative">
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ background: ACCENT, opacity: ctaGlow, scale: 1.4 }}
                  />
                  <button
                    type="button"
                    onClick={() => setStage("question")}
                    className="relative rounded-full px-8 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
                    style={{ background: ACCENT }}
                  >
                    Audit jetzt starten →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={skipToTopics}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  style={{ color: PAPER_BODY }}
                >
                  Überspringen und weiterscrollen
                </button>
              </div>

              <MethodologyDisclosure
                open={showMethodology}
                onToggle={() => setShowMethodology((v) => !v)}
              />
            </motion.div>
          )}

          {stage === "question" && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider" style={{ color: PAPER_BODY }}>
                <span>
                  Schritt {index + 1} / {total}
                </span>
                <button type="button" onClick={skipToTopics} className="hover:underline">
                  Überspringen
                </button>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${((index + 1) / total) * 100}%`, background: ACCENT }}
                />
              </div>

              <span
                className="mt-6 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "var(--color-accent-soft)", color: ACCENT_TEXT }}
              >
                {question.category}
              </span>
              <h3 className="mt-4 text-2xl sm:text-3xl">{question.prompt}</h3>

              <button
                type="button"
                onClick={() => setShowWhy((v) => !v)}
                className="mt-3 flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: ACCENT_TEXT }}
              >
                Warum wir das fragen
                <span className={`transition-transform ${showWhy ? "rotate-180" : ""}`}>⌄</span>
              </button>
              {showWhy && (
                <p className="mt-2 font-card-body text-sm leading-relaxed" style={{ color: PAPER_BODY }}>
                  {question.why}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                {question.options.map((opt) => {
                  const isSelected = selected === opt.score;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => selectOption(opt.score)}
                      className="flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors"
                      style={{
                        borderColor: isSelected ? ACCENT : "rgba(21,18,27,0.1)",
                        background: isSelected ? "var(--color-accent-soft)" : "white",
                      }}
                    >
                      <span
                        className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2"
                        style={{
                          borderColor: isSelected ? ACCENT : "rgba(21,18,27,0.25)",
                          background: isSelected ? ACCENT : "transparent",
                        }}
                      />
                      <span>
                        <span className="block text-sm font-semibold" style={{ color: PAPER_INK }}>
                          {opt.label}
                        </span>
                        <span className="mt-0.5 block text-xs" style={{ color: PAPER_BODY }}>
                          {opt.sublabel}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm font-semibold"
                  style={{ color: PAPER_BODY }}
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  disabled={selected === null}
                  onClick={goNext}
                  className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-30"
                  style={{ background: ACCENT }}
                >
                  {index === total - 1 ? "Ergebnis ansehen" : "Weiter →"}
                </button>
              </div>
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <span
                className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "var(--color-accent-soft)", color: ACCENT_TEXT }}
              >
                Dein Ergebnis
              </span>
              <div className="mt-6 flex items-center justify-center gap-1">
                <span className="text-6xl font-bold" style={{ color: PAPER_INK }}>
                  {score10.toFixed(1)}
                </span>
                <span className="text-2xl" style={{ color: PAPER_BODY }}>
                  / 10
                </span>
              </div>
              <p className="mx-auto mt-3 max-w-md font-card-body text-sm leading-relaxed" style={{ color: PAPER_BODY }}>
                Dein KI-Reifegrad im Überblick — nach Kategorie aufgeschlüsselt.
              </p>

              <div className="mx-auto mt-8 flex max-w-md flex-col gap-4 text-left">
                {categoryBreakdown.map((c) => (
                  <div key={c.category}>
                    <div className="flex items-center justify-between text-xs font-semibold" style={{ color: PAPER_INK }}>
                      <span>{c.category}</span>
                      <span style={{ color: PAPER_BODY }}>{c.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.pct}%`, background: ACCENT }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    onOpenContact({
                      heading: "Kostenloses Gespräch für deine Roadmap",
                      subject: `Audit-Ergebnis: ${score10.toFixed(1)}/10`,
                    })
                  }
                  className="flex-1 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                  style={{ background: ACCENT }}
                >
                  Kostenloses Gespräch für meine Roadmap
                </button>
                <Link
                  href="/portal/login"
                  className="flex-1 rounded-full border px-6 py-3.5 text-center text-sm font-semibold transition-colors"
                  style={{ borderColor: ACCENT_TEXT, color: ACCENT_TEXT }}
                >
                  Fertige Automatisierungen ansehen
                </Link>
              </div>

              <MethodologyDisclosure
                open={showMethodology}
                onToggle={() => setShowMethodology((v) => !v)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
