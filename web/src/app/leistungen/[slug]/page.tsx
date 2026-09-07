import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { topics } from "@/lib/topics";
import { bottomCards } from "@/lib/bottomCards";
import { serviceContent } from "@/lib/serviceContent";
import { baseUrl } from "@/lib/legal";

type PageMeta = {
  id: string;
  eyebrow: string;
  title: string;
  short: string;
  detail: string[];
  cta: string;
  demoHref?: string;
  demoLabel?: string;
};

function getAllPageMetas(): PageMeta[] {
  const fromTopics: PageMeta[] = topics
    .filter((t) => t.enabled)
    .map((t) => ({ id: t.id, eyebrow: t.eyebrow, title: t.title, short: t.short, detail: t.detail, cta: t.cta }));

  const fromCards: PageMeta[] = bottomCards
    .filter((c) => c.enabled && c.hasPage)
    .map((c) => ({
      id: c.id,
      eyebrow: c.eyebrow ?? "",
      title: c.title,
      short: c.blurb,
      detail: c.detail ?? [],
      cta: c.cta ?? "Kostenloses Analysegespräch buchen",
      demoHref: c.demoHref,
      demoLabel: c.demoLabel,
    }));

  return [...fromTopics, ...fromCards];
}

export async function generateStaticParams() {
  return getAllPageMetas().map((meta) => ({ slug: meta.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const meta = getAllPageMetas().find((m) => m.id === slug);
  if (!meta) return {};
  const url = `${baseUrl}/leistungen/${meta.id}`;
  return {
    title: `${meta.title} — promptwerker`,
    description: meta.short,
    alternates: { canonical: `/leistungen/${meta.id}` },
    openGraph: {
      title: `${meta.title} — promptwerker`,
      description: meta.short,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} — promptwerker`,
      description: meta.short,
    },
  };
}

export default async function LeistungPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const allMetas = getAllPageMetas();
  const meta = allMetas.find((m) => m.id === slug);
  const content = serviceContent[slug];
  if (!meta || !content) notFound();

  const otherMetas = allMetas.filter((m) => m.id !== meta.id);
  const url = `${baseUrl}/leistungen/${meta.id}`;

  /* Strukturierte Daten je Leistungsseite: Service beschreibt das Angebot,
     FAQPage macht die vorhandenen Fragen für Antwortmaschinen zitierfähig,
     BreadcrumbList zeigt die Einordnung in der Trefferliste. */
  const strukturierteDaten = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: meta.title,
        description: meta.short,
        url,
        serviceType: meta.eyebrow || meta.title,
        provider: { "@id": `${baseUrl}/#organisation` },
        areaServed: { "@type": "Country", name: "Deutschland" },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Leistungen", item: `${baseUrl}/#leistungen` },
          { "@type": "ListItem", position: 3, name: meta.title, item: url },
        ],
      },
    ],
  };

  return (
    <main id="inhalt" className="relative">
      <script type="application/ld+json">{JSON.stringify(strukturierteDaten)}</script>
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-36 sm:pt-44">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-accent"
        >
          ← Alle Leistungen
        </Link>

        <span className="mt-8 block text-xs font-semibold uppercase tracking-wider text-accent">
          {meta.eyebrow}
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">{meta.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-body">{meta.short}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/?kontakt=1"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            {meta.cta}
          </Link>
          {/* Nur bei Leistungen mit Live-Demo (demoHref in bottomCards.ts) */}
          {meta.demoHref && (
            <Link
              href={meta.demoHref}
              className="glass-button-liquid inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              {meta.demoLabel ?? "Live-Demo ansehen"}
            </Link>
          )}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Kennst du das?
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Der Alltag ohne {meta.title}</h2>
        <ul className="mt-8 flex flex-col gap-4">
          {content.painPoints.map((point, i) => (
            <li key={i} className="glass-panel flex items-start gap-4 rounded-2xl p-5">
              <span className="mt-0.5 shrink-0 text-accent">✕</span>
              <span className="font-card-body text-sm leading-relaxed text-body sm:text-base">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lösung */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          So lösen wir das
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">{meta.title}, konkret umgesetzt</h2>
        <div className="mt-8 flex flex-col gap-5">
          {meta.detail.map((paragraph, i) => (
            <p key={i} className="font-card-body text-base leading-relaxed text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Prozess */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Ablauf
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">So läuft die Zusammenarbeit</h2>
        <div className="mt-8 flex flex-col gap-4">
          {content.process.map((step, i) => (
            <div key={step.title} className="glass-panel flex gap-5 rounded-2xl p-6">
              <span className="font-heading shrink-0 text-2xl text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base">{step.title}</h3>
                <p className="mt-2 font-card-body text-sm leading-relaxed text-body">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Vorteile
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Was sich für dich ändert</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {content.benefits.map((benefit) => (
            <div key={benefit.title} className="glass-panel rounded-2xl p-6">
              <h3 className="text-base">{benefit.title}</h3>
              <p className="mt-2 font-card-body text-sm leading-relaxed text-body">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Case */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Aus der Praxis
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl">{content.useCase.title}</h2>
        <div className="glass-panel mt-8 flex flex-col gap-4 rounded-2xl p-7">
          {content.useCase.text.map((paragraph, i) => (
            <p key={i} className="font-card-body text-sm leading-relaxed text-body sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">FAQ</span>
        <h2 className="mt-3 text-2xl sm:text-3xl">Häufige Fragen</h2>
        <div className="mt-8 flex flex-col gap-4">
          {content.faq.map((item) => (
            <div key={item.q} className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-semibold text-ink sm:text-base">{item.q}</h3>
              <p className="mt-2 font-card-body text-sm leading-relaxed text-body">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl">{content.finalCta.headline}</h2>
          <p className="mx-auto mt-4 max-w-xl font-card-body text-sm leading-relaxed text-body sm:text-base">
            {content.finalCta.text}
          </p>
          <Link
            href="/?kontakt=1"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
          >
            {content.finalCta.button}
          </Link>
        </div>
      </section>

      {/* Weitere Themen */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Weitere Themen
        </span>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {otherMetas.map((m) => (
            <Link
              key={m.id}
              href={`/leistungen/${m.id}`}
              className="glass-panel rounded-2xl p-5 text-sm transition-colors hover:border-accent/60"
            >
              {m.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
