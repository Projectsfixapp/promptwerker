"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/lib/topics";
import { bottomCards } from "@/lib/bottomCards";

/* Hauptmenü.
   Vorher öffnete das Leistungen-Untermenü ausschließlich per onMouseEnter —
   per Tastatur war es damit nicht erreichbar (WCAG 2.1.1) und auf
   Touch-Geräten unzuverlässig. Jetzt: echter Button mit aria-expanded, der
   auf Klick reagiert, Escape schließt, Klick nach außen schließt. Hover
   öffnet weiterhin — nur nicht mehr als einziger Weg. */

type MenuEintrag = { href: string; label: string };

export default function Nav() {
  const menuId = useId();
  const [leistungenOpen, setLeistungenOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const leistungen: MenuEintrag[] = topics
    .filter((topic) => topic.enabled)
    .map((topic) => ({ href: `/leistungen/${topic.id}`, label: topic.title }));

  const weitereThemen: MenuEintrag[] = bottomCards
    .filter((card) => card.enabled && card.hasPage)
    .map((card) => ({ href: `/leistungen/${card.id}`, label: card.title }));

  // Menüs schließen, wenn darin ein Link geklickt wurde — sonst bleibt das
  // Mobilmenü nach dem Klick offen über der neuen Seite stehen. Bewusst als
  // Klick-Handler am Container statt als Effekt auf `pathname`: setState im
  // Effektkörper löst Kaskadenrenders aus (react-hooks/set-state-in-effect).
  function schliesseBeiLinkKlick(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      setLeistungenOpen(false);
      setMobileOpen(false);
    }
  }

  useEffect(() => {
    if (!leistungenOpen && !mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setLeistungenOpen(false);
      setMobileOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (navRef.current?.contains(event.target as Node)) return;
      setLeistungenOpen(false);
      setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [leistungenOpen, mobileOpen]);

  const istAktiv = (href: string) => pathname === href;
  const eintragKlasse =
    "block rounded-xl px-4 py-3 text-sm text-body transition-colors hover:bg-white/10 hover:text-ink aria-[current=page]:text-accent";

  return (
    <nav
      ref={navRef}
      aria-label="Hauptmenü"
      className="fixed right-4 top-6 z-50 sm:right-8 sm:top-8"
    >
      {/* Desktop */}
      <div
        onClick={schliesseBeiLinkKlick}
        className="glass-panel hidden items-center gap-1 rounded-full px-2 py-2 sm:flex"
        style={{ background: "rgba(10, 18, 38, 0.72)" }}
      >
        <div
          className="relative"
          onMouseEnter={() => setLeistungenOpen(true)}
          onMouseLeave={() => setLeistungenOpen(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setLeistungenOpen(false);
            }
          }}
        >
          <button
            type="button"
            aria-expanded={leistungenOpen}
            aria-controls={menuId}
            onClick={() => setLeistungenOpen((offen) => !offen)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:text-accent"
          >
            Leistungen
            <span aria-hidden="true" className="text-[10px] leading-none">
              {leistungenOpen ? "▲" : "▼"}
            </span>
          </button>

          {leistungenOpen && (
            <div
              id={menuId}
              className="glass-panel absolute right-0 top-full mt-2 w-72 rounded-2xl p-2"
              style={{ background: "rgba(10, 18, 38, 0.94)" }}
            >
              <ul className="flex flex-col">
                {leistungen.map((eintrag) => (
                  <li key={eintrag.href}>
                    <Link
                      href={eintrag.href}
                      aria-current={istAktiv(eintrag.href) ? "page" : undefined}
                      className={eintragKlasse}
                    >
                      {eintrag.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-1 border-t border-white/10" />
              <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Weitere Themen
              </p>
              <ul className="flex flex-col">
                {weitereThemen.map((eintrag) => (
                  <li key={eintrag.href}>
                    <Link
                      href={eintrag.href}
                      aria-current={istAktiv(eintrag.href) ? "page" : undefined}
                      className={eintragKlasse}
                    >
                      {eintrag.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link
          href="/ueber-uns"
          aria-current={istAktiv("/ueber-uns") ? "page" : undefined}
          className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:text-accent aria-[current=page]:text-accent"
        >
          Über uns
        </Link>
        <Link
          href="/?kontakt=1"
          className="ml-1 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
        >
          Kontakt
        </Link>
      </div>

      {/* Mobil */}
      <div className="sm:hidden" onClick={schliesseBeiLinkKlick}>
        <button
          type="button"
          onClick={() => setMobileOpen((offen) => !offen)}
          aria-expanded={mobileOpen}
          aria-controls={`${menuId}-mobil`}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-ink"
          style={{ background: "rgba(10, 18, 38, 0.72)" }}
        >
          <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
        </button>

        {mobileOpen && (
          <div
            id={`${menuId}-mobil`}
            className="glass-panel absolute right-0 top-14 max-h-[75vh] w-72 overflow-y-auto rounded-2xl p-3"
            style={{ background: "rgba(10, 18, 38, 0.94)" }}
          >
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Leistungen
            </p>
            <ul className="flex flex-col">
              {leistungen.map((eintrag) => (
                <li key={eintrag.href}>
                  <Link
                    href={eintrag.href}
                    aria-current={istAktiv(eintrag.href) ? "page" : undefined}
                    className="block rounded-xl px-3 py-2.5 text-sm text-body hover:bg-white/10 hover:text-ink aria-[current=page]:text-accent"
                  >
                    {eintrag.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Weitere Themen
            </p>
            <ul className="flex flex-col">
              {weitereThemen.map((eintrag) => (
                <li key={eintrag.href}>
                  <Link
                    href={eintrag.href}
                    aria-current={istAktiv(eintrag.href) ? "page" : undefined}
                    className="block rounded-xl px-3 py-2.5 text-sm text-body hover:bg-white/10 hover:text-ink aria-[current=page]:text-accent"
                  >
                    {eintrag.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-2 border-t border-white/10 pt-2">
              <Link
                href="/ueber-uns"
                aria-current={istAktiv("/ueber-uns") ? "page" : undefined}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-white/10 aria-[current=page]:text-accent"
              >
                Über uns
              </Link>
              <Link
                href="/?kontakt=1"
                className="mt-2 block rounded-full bg-accent px-4 py-2.5 text-center text-sm font-semibold text-accent-ink"
              >
                Kontakt
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
