"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import type { Topic } from "@/lib/topics";
import BackButton from "./BackButton";

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.22 + i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

export default function DetailView({
  topic,
  onBack,
}: {
  topic: Topic;
  onBack: () => void;
}) {
  const fromSide = topic.side === "left" ? "-100%" : "100%";

  return (
    <motion.div
      key={topic.id}
      initial={{ x: fromSide }}
      animate={{ x: 0 }}
      exit={{ x: fromSide }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-30 overflow-y-auto"
    >
      <div className="glass-panel min-h-full px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <BackButton onClick={onBack} />

          <motion.span
            custom={0}
            initial="hidden"
            animate="show"
            variants={contentVariants}
            className="mt-10 block text-xs font-semibold uppercase tracking-wider text-accent"
          >
            {topic.eyebrow}
          </motion.span>
          <motion.h2
            custom={1}
            initial="hidden"
            animate="show"
            variants={contentVariants}
            className="mt-3 text-3xl sm:text-4xl"
          >
            {topic.title}
          </motion.h2>

          <div className="mt-8 flex flex-col gap-5">
            {topic.detail.map((paragraph, i) => (
              <motion.p
                key={i}
                custom={2 + i}
                initial="hidden"
                animate="show"
                variants={contentVariants}
                className="font-card-body text-base leading-relaxed text-body"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.a
            href={`/leistungen/${topic.id}`}
            custom={2 + topic.detail.length}
            initial="hidden"
            animate="show"
            variants={contentVariants}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
          >
            {topic.cta}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
