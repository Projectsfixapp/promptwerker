import Link from "next/link";
import { bottomCards } from "@/lib/bottomCards";

/* Logos und Überschrift sind in die Zauberring-Szene (MagicRingScene)
   gewandert, die direkt über dieser Sektion läuft. Hier bleiben die
   Themenkarten, die den Übergang zum Seitenfuß bilden. */

export default function LogoMarquee() {
  const visibleCards = bottomCards.filter((card) => card.enabled);

  return (
    <section className="overflow-hidden pb-24 pt-8">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Weitere Themen
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Womit wir sonst noch weiterhelfen</h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-3 px-6 sm:grid-cols-2">
        {visibleCards.map((card) => (
          <Link
            key={card.id}
            href={card.hasPage ? `/leistungen/${card.id}` : "/?kontakt=1"}
            className="glass-panel block rounded-2xl p-5 transition-colors hover:border-accent/60"
          >
            <h3 className="text-sm">{card.title}</h3>
            <p className="mt-2 font-card-body text-xs leading-relaxed text-body">{card.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
