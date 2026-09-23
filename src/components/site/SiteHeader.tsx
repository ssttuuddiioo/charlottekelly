"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EMAIL, NAV, SOCIAL } from "@/lib/site";
import { FloatingMark } from "./FloatingMark";

/**
 * The project pages' top bar: the name lockup at mark size on the left, the
 * menu on the right, nothing in between.
 *
 * Not on the landing, deliberately. The landing opens on the lockup filling the
 * viewport and resolving as you scroll; a second, smaller copy of the same name
 * in the corner would be competing with the thing it is a miniature of. A
 * project page has no lockup of its own, so this is where the mark earns its
 * place — and where a way back and a way around are actually needed.
 *
 * It keeps the blue band from the mock, now fixed rather than scrolling away,
 * which also means the bar never has to work out what it is sitting on: the
 * ground is always this blue.
 */
export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    toggle.current?.focus();
  }, []);

  // Escape closes, and Tab cycles inside <header> — which holds both the panel
  // and the button that closes it, so the header is exactly the open menu and
  // nothing else. Worth the dozen lines: without it Tab walks straight out of
  // an open menu into a page the menu is covering.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !header.current) return;

      const focusable = header.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Hold the page still behind the menu. `scrollbar-gutter: stable` on <html>
  // means the gutter is already reserved, so hiding overflow shifts nothing.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the panel, so a keyboard lands in the menu rather than
  // carrying on from the button into the page behind it.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [open]);

  return (
    <header
      ref={header}
      className="text-alt-paper font-display fixed inset-x-0 top-0 z-50"
    >
      {/* Without JS the panel can never open, so the control would be a lie.
          The footer carries the same links and is in the page either way. */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: "[data-menu-toggle]{display:none}" }} />
      </noscript>

      <div className="bg-alt-blue relative z-10 flex h-[var(--header-h)] items-center justify-between px-[6vw] md:px-[2.5vw]">
        <Link
          href="/"
          aria-label="Charlotte Kelly — home"
          className="min-h-tap inline-flex items-center no-underline"
        >
          <FloatingMark />
        </Link>

        <button
          ref={toggle}
          type="button"
          data-menu-toggle
          data-open={open}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => (open ? close() : setOpen(true))}
          className="group min-h-tap min-w-tap -mr-[0.5rem] inline-flex items-center justify-end"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <Hamburger />
        </button>
      </div>

      {/* Always rendered rather than mounted on open: the panel has to be in
          the DOM for the slide to have somewhere to come from, and `inert`
          takes the closed state out of both the tab order and the
          accessibility tree without a second mechanism. */}
      <div
        data-open={open}
        inert={!open}
        className="pointer-events-none fixed inset-0 z-0 data-[open=true]:pointer-events-auto"
      >
        <div
          data-open={open}
          aria-hidden="true"
          onClick={close}
          // A neutral dim rather than a tint: the panel supplies the colour,
          // and the page behind should just recede.
          className="bg-alt-ink/50 absolute inset-0 opacity-0 backdrop-blur-[3px] transition-opacity duration-300 data-[open=true]:opacity-100"
        />

        <div
          id="site-menu"
          ref={panel}
          data-open={open}
          aria-label="Menu"
          // Every link in here leaves this page, so closing on click is about
          // the moment before the navigation lands rather than about the menu
          // itself — without it the panel sits open over the outgoing page.
          onClick={(event) => {
            if ((event.target as Element).closest("a")) setOpen(false);
          }}
          className="bg-alt-amber text-alt-ink pb-l absolute top-0 right-0 flex h-dvh w-full max-w-[34rem] translate-x-full flex-col justify-between overflow-y-auto overscroll-contain px-[6vw] pt-[var(--header-h)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[open=true]:translate-x-0 md:px-[3.5rem]"
        >
          <MenuBody />
        </div>
      </div>
    </header>
  );
}

/** Three rules that fold into a cross. Colour is inherited from the header. */
function Hamburger() {
  const bar =
    "absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <span aria-hidden="true" className="relative block h-[0.75rem] w-[1.5rem]">
      <span
        className={`${bar} top-0 group-data-[open=true]:translate-y-[0.375rem] group-data-[open=true]:rotate-45`}
      />
      <span
        className={`${bar} top-[0.375rem] transition-opacity group-data-[open=true]:opacity-0`}
      />
      <span
        className={`${bar} top-[0.75rem] group-data-[open=true]:-translate-y-[0.375rem] group-data-[open=true]:-rotate-45`}
      />
    </span>
  );
}

/**
 * The footer's contents at the footer's weights, restacked for a column a
 * third of the page wide. Same source lists as the footer, so the two cannot
 * drift apart.
 */
function MenuBody() {
  return (
    <>
      <nav aria-label="Menu">
        <ul className="pt-2xl flex flex-col">
          {NAV.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="min-h-tap inline-flex items-center text-[clamp(1.75rem,1.2rem+2.4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.01em] uppercase no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-2xl">
        <h2 className="text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[0.92] font-bold tracking-[-0.02em] uppercase">
          Charlotte
          <br />
          Kelly{" "}
          <span className="align-baseline text-[0.26em] font-medium tracking-[0.02em] whitespace-nowrap">
            (Copywriter)
          </span>
        </h2>

        <ul className="pt-l flex flex-col">
          {SOCIAL.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="min-h-tap inline-flex items-center text-[0.95rem] font-bold tracking-[0.02em] uppercase no-underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${EMAIL}`}
          // decoration-current because the base rule underlines links in the
          // cyanotype accent blue, which on this ochre is a third colour doing
          // nothing. The underline should just be the word's own.
          className="min-h-tap mt-2xs flex max-w-full items-start gap-[0.5em] text-[0.95rem] font-medium underline decoration-current underline-offset-[0.25em]"
        >
          <span aria-hidden="true" className="no-underline">
            ↳
          </span>
          <span className="min-w-0 [overflow-wrap:anywhere]">{EMAIL}</span>
        </a>

        <p className="text-fine pt-l font-bold tracking-[0.02em] uppercase">
          © {new Date().getFullYear()} Charlotte Kelly
        </p>
      </div>
    </>
  );
}
