"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { MouseEvent } from "react";

export default function BackButton({ onClick }: { onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className="glass-panel inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/60"
    >
      <span aria-hidden>←</span> Zurück
    </motion.button>
  );
}
