"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type PanInfo } from "motion/react";
import type { BottomCard } from "@/lib/bottomCards";

const ROTATE_STEP = 22;
const SPREAD = 230;
const DEPTH = 150;
const AUTO_ADVANCE_MS = 3800;

function circularOffset(i: number, active: number, n: number) {
  let raw = i - active;
  if (raw > n / 2) raw -= n;
  if (raw < -n / 2) raw += n;
  return raw;
}

export default function CardCarousel3D({ cards }: { cards: BottomCard[] }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = cards.length;

  useEffect(() => {
    if (paused || n === 0) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % n);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, n]);

  if (n === 0) return null;

  function goTo(index: number) {
    setActiveIndex(((index % n) + n) % n);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const distanceThreshold = 50;
    const velocityThreshold = 400;
    const flickLeft =
      info.offset.x < -distanceThreshold || info.velocity.x < -velocityThreshold;
    const flickRight =
      info.offset.x > distanceThreshold || info.velocity.x > velocityThreshold;
    if (flickLeft) goTo(activeIndex + 1);
    else if (flickRight) goTo(activeIndex - 1);
    setPaused(false);
  }

  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-4xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Themen im Überblick
        </span>
      </div>

      <div
        className="relative mt-10 flex h-[400px] items-center justify-center"
        style={{ perspective: "1600px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragStart={() => setPaused(true)}
          onDragEnd={handleDragEnd}
          className="relative h-full w-full cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
        >
          {cards.map((card, i) => {
            const offset = circularOffset(i, activeIndex, n);
            const abs = Math.abs(offset);
            const isActive = offset === 0;

            return (
              <div
                key={card.id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  onClick={() =>
                    isActive ? router.push(`/seite/${card.id}`) : goTo(i)
                  }
                  animate={{
                    x: offset * SPREAD,
                    z: -abs * DEPTH,
                    rotateY: offset * -ROTATE_STEP,
                    scale: 1 - abs * 0.1,
                    opacity: 1 - abs * 0.13,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  className={`glass-panel w-80 cursor-pointer rounded-2xl p-7 sm:w-96 ${
                    isActive
                      ? "border-accent/70 shadow-[0_0_60px_16px_rgba(56,217,255,0.35)]"
                      : ""
                  }`}
                >
                  <h3 className="text-lg">{card.title}</h3>
                  <p className="mt-3 font-card-body text-sm leading-relaxed text-body">
                    {card.blurb}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
