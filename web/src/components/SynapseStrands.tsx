"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

// Organische Synapsen-Stränge: starten an den Kartenrändern, bahnen sich
// ihren Weg zum CTA-Punkt in der Kartenmitte und werden dabei heller. Der
// Aufbau ist an den Scroll-Fortschritt gekoppelt, mit dem auch die Karte
// wächst (siehe AuditSection.tsx) — Stränge und Karte entstehen gemeinsam.

const CTA_X = 500;
const CTA_Y = 460;

const STRANDS = [
  { d: `M0,40 C 160,20 300,140 ${CTA_X},${CTA_Y}`, start: 0.01, end: 0.09 },
  { d: `M0,150 C 140,180 280,260 ${CTA_X},${CTA_Y}`, start: 0.02, end: 0.11 },
  { d: `M0,280 C 120,300 260,360 ${CTA_X},${CTA_Y}`, start: 0.015, end: 0.1 },
  { d: `M0,430 C 140,430 280,440 ${CTA_X},${CTA_Y}`, start: 0.03, end: 0.12 },
  { d: `M0,560 C 140,520 280,500 ${CTA_X},${CTA_Y}`, start: 0.025, end: 0.115 },
  { d: `M0,660 C 160,600 300,520 ${CTA_X},${CTA_Y}`, start: 0.04, end: 0.13 },
  { d: `M1000,40 C 840,20 700,140 ${CTA_X},${CTA_Y}`, start: 0.015, end: 0.1 },
  { d: `M1000,150 C 860,180 720,260 ${CTA_X},${CTA_Y}`, start: 0.02, end: 0.11 },
  { d: `M1000,280 C 880,300 740,360 ${CTA_X},${CTA_Y}`, start: 0.03, end: 0.12 },
  { d: `M1000,430 C 860,430 720,440 ${CTA_X},${CTA_Y}`, start: 0.01, end: 0.09 },
  { d: `M1000,560 C 860,520 720,500 ${CTA_X},${CTA_Y}`, start: 0.035, end: 0.125 },
  { d: `M1000,660 C 840,600 700,520 ${CTA_X},${CTA_Y}`, start: 0.02, end: 0.105 },
];

function Strand({
  d,
  start,
  end,
  gradientId,
  progress,
}: {
  d: string;
  start: number;
  end: number;
  gradientId: string;
  progress: MotionValue<number>;
}) {
  const dashoffset = useTransform(progress, [start, end], [900, 0]);
  const opacity = useTransform(progress, [start, end], [0, 0.55]);

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="900"
      style={{ strokeDashoffset: dashoffset, opacity }}
    />
  );
}

export default function SynapseStrands({ progress }: { progress: MotionValue<number> }) {
  const nodeScale = useTransform(progress, [0.1, 0.15], [0, 1]);
  const nodeOpacity = useTransform(progress, [0.1, 0.15], [0, 0.9]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMin slice"
        className="h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="synapseLeft" x1="0" y1="0" x2={CTA_X} y2={CTA_Y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent-deep)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="synapseRight" x1="1000" y1="0" x2={CTA_X} y2={CTA_Y} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-accent-deep)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {STRANDS.map((s, i) => (
          <Strand
            key={i}
            d={s.d}
            start={s.start}
            end={s.end}
            gradientId={i < 6 ? "synapseLeft" : "synapseRight"}
            progress={progress}
          />
        ))}

        <motion.circle
          cx={CTA_X}
          cy={CTA_Y}
          r="7"
          fill="var(--color-accent)"
          style={{ scale: nodeScale, opacity: nodeOpacity }}
        />
      </svg>
    </div>
  );
}
