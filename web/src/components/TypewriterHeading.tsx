"use client";

import { useEffect, useRef, useState } from "react";

/* className ist optional: ohne Angabe bleibt die Startseiten-Optik exakt
   wie vorher. Die Speaker-Seite übergibt ihre eigene Typografie, Tempo
   (35 ms je Zeichen) und Auslöser (50 % sichtbar) bleiben gleich. */
export default function TypewriterHeading({
  text,
  className = "text-center text-2xl sm:text-3xl",
  id,
}: {
  text: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (count >= text.length) return;
    const timeout = setTimeout(() => setCount((c) => c + 1), 35);
    return () => clearTimeout(timeout);
  }, [started, count, text.length]);

  return (
    <h2 ref={ref} id={id} className={className}>
      {/* Volltext für Suchmaschinen und Screenreader schon im Server-HTML;
          das getippte Fragment ist nur Optik. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block w-[2px] animate-pulse bg-accent align-middle"
        style={{ height: "1em", opacity: count >= text.length ? 0 : 1 }}
      />
    </h2>
  );
}
