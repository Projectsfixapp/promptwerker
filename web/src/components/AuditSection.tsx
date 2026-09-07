"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { auditQuestions, AUDIT_CATEGORIES, auditSources } from "@/lib/audit";
import SynapseStrands from "./SynapseStrands";

/* "teaser" ersetzt die frühere große Intro-Stufe: die Karte startet als
   kompakter Anriss und klappt erst beim Start mit Effekt zur vollen
   Fragestrecke auf. */
type Stage = "teaser" | "question" | "result";

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
  compact = false,
}: {
  onOpenContact: (meta?: { heading?: string; subject?: string }) => void;
  /** Schlanke Variante für die alternative Startseite (/start-b): gleiche
      Fragen, gleicher Score, gleiche CTAs — nur gedrängtere Typografie und
      weniger Höhe. Ohne die Prop rendert alles exakt wie bisher. */
  compact?: boolean;
}) {
  const [stage, setStage] = useState<Stage>("teaser");
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
      setStage("teaser");
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
    <div
      id="audit-section"
      ref={wrapperRef}
      className={compact ? "relative mx-auto mb-8 w-full max-w-3xl px-4" : "relative mx-4 mb-10 sm:mx-8"}
    >
      {/* layout: animiert den Größensprung der Karte beim Aufklappen vom
          Teaser zur Fragestrecke, statt hart umzubrechen. */}
      <motion.div
        layout
        transition={{ layout: { type: "spring", stiffness: 120, damping: 20 } }}
        className={`glass-panel-liquid relative overflow-hidden ${compact ? "rounded-3xl" : "rounded-[2rem]"}`}
        style={{ scale: cardScale, opacity: cardOpacity, transformOrigin: "top center", color: PAPER_INK }}
      >
        <SynapseStrands progress={scrollYProgress} />
        <div
          className={
            stage === "teaser"
              ? "relative z-10 mx-auto max-w-3xl px-6 py-7"
              : compact
                ? "relative z-10 mx-auto max-w-xl px-5 py-9 sm:py-11"
                : "relative z-10 mx-auto max-w-2xl px-6 py-12 sm:py-14"
          }
        >
        <AnimatePresence mode="wait">
          {stage === "teaser" && (
            <motion.div
              key="teaser"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:text-left"
            >
              {/* flex-1 + min-w-0: der Textblock gibt nach, statt den Knopf
                  in die zweite Zeile zu drücken. */}
              <div className="sm:min-w-0 sm:flex-1 sm:pr-4">
                <span
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: "var(--color-accent-soft)", color: ACCENT_TEXT }}
                >
                  KI-Reifegrad-Audit · 10 Fragen · Kostenlos
                </span>
                <h2 className="mt-2 text-lg sm:text-xl">
                  Wo steht dein Unternehmen auf dem Weg zur KI?
                </h2>
                <p className="mt-1 font-card-body text-xs" style={{ color: PAPER_BODY }}>
                  Unter 5 Minuten · Score 0–10 · keine Anmeldung.{" "}
                  <button
                    type="button"
                    onClick={() => setShowMethodology((v) => !v)}
                    className="underline-offset-2 hover:underline"
                    style={{ color: ACCENT_TEXT }}
                  >
                    Basis des Modells
                  </button>
                </p>
              </div>

              <div className="relative shrink-0">
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{ background: ACCENT, opacity: ctaGlow, scale: 1.4 }}
                />
                <button
                  type="button"
                  onClick={() => setStage("question")}
                  className="ansprechpartner-glow relative rounded-full px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.04]"
                  style={{ background: ACCENT }}
                >
                  Audit jetzt starten →
                </button>
              </div>

              {showMethodology && (
                <div className="w-full sm:col-span-full">
                  <MethodologyDisclosure open onToggle={() => setShowMethodology(false)} />
                </div>
              )}
            </motion.div>
          )}

          {stage === "question" && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 22, scale: 0.94 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 160, damping: 18 },
              }}
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
              <h3 className={compact ? "mt-3 text-xl sm:text-2xl" : "mt-4 text-2xl sm:text-3xl"}>{question.prompt}</h3>

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

              <div className={`flex flex-col ${compact ? "mt-4 gap-2" : "mt-6 gap-3"}`}>
                {question.options.map((opt) => {
                  const isSelected = selected === opt.score;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => selectOption(opt.score)}
                      className={`flex items-start gap-3 rounded-2xl border text-left transition-colors ${compact ? "p-3" : "p-4"}`}
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

              <div className={`flex items-center justify-between ${compact ? "mt-5" : "mt-7"}`}>
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
              <div className={`flex items-center justify-center gap-1 ${compact ? "mt-4" : "mt-6"}`}>
                <span className={`font-bold ${compact ? "text-5xl" : "text-6xl"}`} style={{ color: PAPER_INK }}>
                  {score10.toFixed(1)}
                </span>
                <span className="text-2xl" style={{ color: PAPER_BODY }}>
                  / 10
                </span>
              </div>
              <p className="mx-auto mt-3 max-w-md font-card-body text-sm leading-relaxed" style={{ color: PAPER_BODY }}>
                Dein KI-Reifegrad im Überblick — nach Kategorie aufgeschlüsselt.
              </p>

              <div className={`mx-auto flex max-w-md flex-col text-left ${compact ? "mt-6 gap-3" : "mt-8 gap-4"}`}>
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

              <div className={`mx-auto flex max-w-lg flex-col gap-3 sm:flex-row ${compact ? "mt-7" : "mt-10"}`}>
                <button
                  type="button"
                  onClick={() =>
                    onOpenContact({
                      heading: "Kostenloses Gespräch für deine Roadmap",
                      subject: `Audit-Ergebnis: ${score10.toFixed(1)}/10`,
                    })
                  }
                  className={`flex-1 rounded-full px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03] ${compact ? "py-2.5" : "py-3.5"}`}
                  style={{ background: ACCENT }}
                >
                  Kostenloses Gespräch für meine Roadmap
                </button>
                <Link
                  href="/portal/login"
                  className={`flex-1 rounded-full border px-6 text-center text-sm font-semibold transition-colors ${compact ? "py-2.5" : "py-3.5"}`}
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
