"use client";

import { motion } from "motion/react";
import type { Topic } from "@/lib/topics";

export default function TopicCard({
  topic,
  onOpen,
}: {
  topic: Topic;
  onOpen: (id: string) => void;
}) {
  const offsetX = topic.side === "right" ? 48 : -48;

  return (
    <motion.div
      initial={{ opacity: 0, x: offsetX }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.25, ease: "easeOut" } }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className={`glass-panel w-full max-w-md rounded-2xl p-7 transition-[box-shadow,border-color] duration-300 hover:border-accent/60 hover:shadow-[0_0_55px_14px_rgba(56,217,255,0.32)] ${
        topic.side === "right" ? "ml-auto" : "mr-auto"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
        {topic.eyebrow}
      </span>
      <h3 className="mt-2 text-xl">{topic.title}</h3>
      <p className="mt-3 font-card-body text-sm leading-relaxed text-body">{topic.short}</p>
      <button
        type="button"
        onClick={() => onOpen(topic.id)}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
      >
        {topic.cta}
      </button>
    </motion.div>
  );
}
