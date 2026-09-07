"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "gsap";

/* Ansprechpartner-Inszenierung im Footer.

   Akt 1 — Zusammenbau: Wer unten ankommt, sieht Glasscherben aus der
   Tiefe des Raums (translateZ bis -620) einfliegen und sich zum Feld
   fügen; danach zeichnet sich der Rahmen selbst, Synapsen-Stränge ziehen
   zum Knopf, und der Knopf zündet mit einem Lichtstoß. Spielt bei jedem
   Erreichen des Footers neu (IntersectionObserver).

   Akt 2 — Karte: Ein Klick öffnet die Karte als Kreis-Reveal aus der
   Klickposition heraus. Das Foto wischt sich von Graustufen nach Farbe
   auf, die Textzeilen kommen gestaffelt aus der Unschärfe, der Buchungs-
   CTA zündet zuletzt. Um die Karte läuft ein Lichtsaum (.laufender-rand).

   Alles GSAP-Timelines auf echten DOM-Knoten: Inhalte sind serverseitig
   gerendert und ohne JavaScript sichtbar — die Timelines verstecken sie
   erst in dem Moment, in dem sie sie einfliegen lassen. Bei reduzierter
   Bewegung laufen keine Timelines; die CSS-Animationen stoppt die globale
   prefers-reduced-motion-Regel.

   Der Buchungs-CTA feuert das Ereignis "pw-termin": auf / und /start-b
   fängt die jeweilige Shell es ab und öffnet das Terminbuchungs-Overlay
   direkt (weich, ohne Seitenwechsel). Hört niemand zu — Rechtsseiten,
   Leistungsseiten — navigiert der Fallback voll auf /?termin=1, wo
   SiteShell den Parameter beim Mount liest. */

/* Deterministische Scherbenlage (kein Math.random, gleiche Szene bei
   jedem Laden): Position in Prozent, Größe, Start-Verdrehung. */
const SCHERBEN = [
  { links: 6, oben: 14, b: 90, h: 56, rx: -48, ry: 62, z: -520 },
  { links: 20, oben: 58, b: 56, h: 56, rx: 55, ry: -40, z: -380 },
  { links: 33, oben: 8, b: 70, h: 42, rx: -30, ry: -70, z: -600 },
  { links: 47, oben: 62, b: 100, h: 48, rx: 40, ry: 48, z: -440 },
  { links: 60, oben: 12, b: 52, h: 52, rx: -60, ry: 30, z: -560 },
  { links: 72, oben: 55, b: 82, h: 40, rx: 34, ry: -58, z: -400 },
  { links: 85, oben: 18, b: 62, h: 62, rx: -42, ry: -36, z: -620 },
  { links: 91, oben: 60, b: 48, h: 34, rx: 58, ry: 44, z: -360 },
];

/* Synapsen-Stränge im Feld: von den Rändern zum Knopf (rechts, x≈870).
   Koordinaten im 1000×260-Viewbox des Overlay-SVG. */
const STRAENGE = [
  "M0,30 C 260,10 560,90 870,128",
  "M0,130 C 300,140 600,140 870,132",
  "M0,235 C 260,250 560,180 870,138",
  "M330,0 C 520,40 720,90 870,124",
  "M480,260 C 620,220 760,170 870,140",
];

export default function AnsprechpartnerCard() {
  const [offen, setOffen] = useState(false);
  const [ursprung, setUrsprung] = useState<{ x: number; y: number } | null>(null);

  const feldRef = useRef<HTMLDivElement>(null);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const karteRef = useRef<HTMLDivElement>(null);
  const feldTimeline = useRef<gsap.core.Timeline | null>(null);
  const schliesstGerade = useRef(false);

  // ---------------------------------------------------- Akt 1: Zusammenbau
  useEffect(() => {
    const feld = feldRef.current;
    if (!feld) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (!eintrag.isIntersecting) continue;
          feldTimeline.current?.kill();

          const scherben = feld.querySelectorAll("[data-scherbe]");
          const teile = feld.querySelectorAll("[data-teil]");
          const rahmen = feld.querySelector<SVGRectElement>("[data-rahmen]");
          const straenge = feld.querySelectorAll<SVGPathElement>("[data-strang]");

          const tl = gsap.timeline();
          tl.from(scherben, {
            opacity: 0,
            z: (i: number) => SCHERBEN[i].z,
            rotationX: (i: number) => SCHERBEN[i].rx,
            rotationY: (i: number) => SCHERBEN[i].ry,
            x: (i: number) => (i % 2 === 0 ? -180 : 180),
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.07,
          })
            .from(
              teile,
              {
                opacity: 0,
                y: 42,
                z: -240,
                rotationX: -24,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.14,
              },
              "-=0.7"
            )
            .fromTo(
              rahmen,
              { strokeDashoffset: 2520 },
              { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
              "-=0.45"
            )
            .fromTo(
              straenge,
              { strokeDashoffset: 1000, opacity: 0 },
              {
                strokeDashoffset: 0,
                opacity: 0.6,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.08,
              },
              "-=0.55"
            )
            .fromTo(
              knopfRef.current,
              { scale: 0.82 },
              { scale: 1.1, duration: 0.18, ease: "power2.in" },
              "-=0.15"
            )
            .to(knopfRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" })
            .from(
              feld.querySelectorAll("[data-ring]"),
              { opacity: 0, duration: 0.4 },
              "<"
            );

          feldTimeline.current = tl;
        }
      },
      { threshold: 0.55 }
    );

    beobachter.observe(feld);
    return () => {
      beobachter.disconnect();
      feldTimeline.current?.kill();
    };
  }, []);

  // ------------------------------------------------------- Akt 2: Karte auf
  /* useLayoutEffect statt useEffect: die Timeline setzt den Startzustand
     (clip-path Kreis mit Radius 0) vor dem ersten Paint — mit useEffect
     wäre das Overlay einen Frame lang voll sichtbar. */
  useLayoutEffect(() => {
    if (!offen) return;

    function beiTaste(e: KeyboardEvent) {
      if (e.key === "Escape") schliessen();
    }
    window.addEventListener("keydown", beiTaste);
    document.documentElement.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const karte = karteRef.current;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (overlay && karte && !ruhig) {
      const x = ursprung?.x ?? window.innerWidth / 2;
      const y = ursprung?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const tl = gsap.timeline();
      // Kreis-Reveal aus der Klickposition — das Overlay wächst als Loch
      // in der Dunkelheit, nicht als eingeblendete Fläche.
      tl.fromTo(
        overlay,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: 0.6, ease: "power2.inOut" }
      )
        .from(karte, { scale: 0.9, y: 26, duration: 0.5, ease: "power3.out" }, "-=0.25")
        .fromTo(
          karte.querySelector("[data-foto]"),
          { clipPath: "inset(0 100% 0 0)", filter: "grayscale(1)" },
          {
            clipPath: "inset(0 0% 0 0)",
            filter: "grayscale(0)",
            duration: 0.85,
            ease: "power3.inOut",
          },
          "-=0.3"
        )
        .from(
          karte.querySelector("[data-foto] img"),
          { scale: 1.28, duration: 1.1, ease: "power3.out" },
          "<"
        )
        .from(
          karte.querySelectorAll("[data-zeile]"),
          {
            opacity: 0,
            y: 26,
            filter: "blur(10px)",
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.11,
          },
          "-=0.75"
        )
        .fromTo(
          karte.querySelector("[data-cta]"),
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" },
          "-=0.2"
        );
    }

    return () => {
      window.removeEventListener("keydown", beiTaste);
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offen]);

  function oeffnen() {
    const r = knopfRef.current?.getBoundingClientRect();
    setUrsprung(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
    schliesstGerade.current = false;
    setOffen(true);
  }

  function schliessen() {
    if (schliesstGerade.current) return;
    const overlay = overlayRef.current;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!overlay || ruhig) {
      setOffen(false);
      return;
    }
    schliesstGerade.current = true;
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.22,
      ease: "power1.in",
      onComplete: () => setOffen(false),
    });
  }

  function terminBuchen() {
    // dispatchEvent liefert false, wenn ein Zuhörer preventDefault ruft —
    // dann hat die Shell das Overlay übernommen und die Karte darf zu.
    const abgefangen = !window.dispatchEvent(new Event("pw-termin", { cancelable: true }));
    if (abgefangen) {
      schliessen();
    } else {
      window.location.href = "/?termin=1";
    }
  }

  return (
    <>
      {/* --- Akt 1: das Feld --- */}
      <div
        ref={feldRef}
        className="relative z-10 mx-auto mb-12 max-w-6xl"
        style={{ perspective: "1200px" }}
      >
        {/* Glasscherben hinter dem Inhalt */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {SCHERBEN.map((s, i) => (
            <div
              key={i}
              data-scherbe
              className="absolute rounded-xl border border-white/60 bg-white/40 shadow-[0_8px_28px_rgba(10,18,38,0.12)]"
              style={{
                left: `${s.links}%`,
                top: `${s.oben}%`,
                width: s.b,
                height: s.h,
              }}
            />
          ))}
        </div>

        {/* Rahmen, der sich selbst zeichnet, plus Synapsen zum Knopf */}
        <svg
          aria-hidden
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <rect
            data-rahmen
            x="2"
            y="2"
            width="996"
            height="256"
            rx="26"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeDasharray="2520"
            opacity="0.7"
          />
          {STRAENGE.map((d, i) => (
            <path
              key={i}
              data-strang
              d={d}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="1000"
            />
          ))}
        </svg>

        <div
          className="relative flex flex-col items-center gap-4 rounded-3xl bg-white/60 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div data-teil>
            <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-magenta)]">
              Noch Fragen?
            </span>
            <p className="mt-2 font-heading text-xl uppercase text-[color:var(--color-paper-ink)] sm:text-2xl">
              Hinter promptwerker steht ein Mensch.
            </p>
          </div>

          <p
            data-teil
            className="max-w-xs font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)]"
          >
            Kein Callcenter, kein Chatbot-Labyrinth — du sprichst direkt mit dem, der dein System
            baut.
          </p>

          <div data-teil className="relative shrink-0">
            <span data-ring className="energie-ring" />
            <span data-ring className="energie-ring" style={{ animationDelay: "1.1s" }} />
            <button
              ref={knopfRef}
              type="button"
              onClick={oeffnen}
              className="ansprechpartner-glow relative rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.04]"
            >
              Ihr Ansprechpartner
            </button>
          </div>
        </div>
      </div>

      {/* --- Akt 2: die Karte ---
          Als Portal auf document.body: der Footer hat backdrop-filter und
          wird dadurch zum Containing Block für position:fixed — ohne
          Portal klebte das Overlay im Footer statt am Viewport. */}
      {offen &&
        createPortal(
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-bg)]/85 px-4 py-6 backdrop-blur-sm"
          onClick={schliessen}
        >
          <div
            className="laufender-rand max-h-full w-full max-w-3xl rounded-3xl p-[2px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={karteRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ansprechpartner-titel"
              className="glass-panel-light relative max-h-[calc(100vh-3.5rem)] overflow-y-auto rounded-[calc(1.5rem-2px)]"
            >
              <button
                type="button"
                onClick={schliessen}
                aria-label="Karte schließen"
                autoFocus
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-xl text-[color:var(--color-paper-ink)] transition-colors hover:bg-black/10"
              >
                ×
              </button>

              <div className="flex flex-col sm:flex-row">
                {/* Foto: 1122x1402 aus public/, next/image liefert passend
                    skalierte Varianten statt der 2,2-MB-Quelle. */}
                <div
                  data-foto
                  className="relative h-72 w-full shrink-0 overflow-hidden rounded-t-[calc(1.5rem-2px)] sm:h-auto sm:w-2/5 sm:rounded-l-[calc(1.5rem-2px)] sm:rounded-tr-none"
                >
                  <Image
                    src="/dennis-ansprechpartner.png"
                    alt="Dennis Beichert steht im Büro vor der grünen promptwerker.de-Mooswand"
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover object-top"
                    priority={false}
                  />
                </div>

                <div className="flex flex-col justify-center px-7 py-9 sm:px-9">
                  <span
                    data-zeile
                    className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-magenta)]"
                  >
                    Ich bin Ihr Ansprechpartner!
                  </span>
                  <h2
                    id="ansprechpartner-titel"
                    data-zeile
                    className="mt-3 text-2xl text-[color:var(--color-paper-ink)] sm:text-3xl"
                  >
                    Dennis Beichert
                  </h2>
                  <p
                    data-zeile
                    className="mt-1 font-card-body text-sm font-semibold text-[color:var(--color-paper-body)]"
                  >
                    Inhaber von promptwerker.de
                  </p>
                  <p
                    data-zeile
                    className="mt-4 font-card-body text-sm leading-relaxed text-[color:var(--color-paper-body)]"
                  >
                    KI-Berater, Workflow-Experte und zertifizierter Datenschutzbeauftragter —
                    Ich bin da! Lassen Sie uns diesen spannenden Schritt gemeinsam gehen.
                  </p>

                  <div data-cta className="relative mt-7 self-start">
                    <span className="energie-ring" />
                    <span className="energie-ring" style={{ animationDelay: "1.1s" }} />
                    <button
                      type="button"
                      onClick={terminBuchen}
                      className="ansprechpartner-glow relative inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.04]"
                    >
                      Jetzt kostenloses Erstgespräch buchen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
