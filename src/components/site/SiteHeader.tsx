"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EMAIL, NAV, SOCIAL } from "@/lib/site";
import { FloatingMark } from "./FloatingMark";
import { EnquiryForm } from "./ProjectEnquiry";
import { PostList } from "@/components/blog/PostList";
import { POSTS } from "@/lib/posts";

/**
 * The project pages' top bar: the name lockup at mark size on the left, the
 * menu on the right, nothing in between.
 *
 * The landing has only the menu button, `bare`: no bar and no mark. There
 * the page opens on the name filling a blue hero that scrolls away, and the
 * button stays in the top right corner over whatever passes under it
 * (LandingHeader recolours it as the blue goes).
 *
 * It keeps the blue band from the mock, now fixed rather than scrolling away,
 * which also means the bar never has to work out what it is sitting on: the
 * ground is always this blue.
 */
export function SiteHeader({ base, bare = false }: { base: string; bare?: boolean }) {
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // What the cream beside the open panel holds: her flower print, or, once
  // chosen from the panel, her recent work or the ways to reach her. Each
  // open starts on the print.
  const [aside, setAside] = useState<Aside>("print");

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
      // Bare, the header lets clicks through too: it spans the top of the
      // page with nothing of its own to show there. Its button and open
      // menu take them back.
      className={`text-alt-paper font-display fixed inset-x-0 top-0 z-50 ${bare ? "pointer-events-none" : ""}`}
    >
      {/* Without JS the panel can never open, so the control would be a lie.
          The footer carries her accounts and is in the page either way. */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: "[data-menu-toggle]{display:none}" }} />
      </noscript>

      {/* The same padding both sides, the button's included: it has no
          pull into the right-hand padding, so the rules of the icon end as
          far in from the right edge as the mark starts from the left.

          Bare, the row is still there to place the button, but has no
          ground and lets clicks through to the page everywhere but the
          button. */}
      <div
        className={`relative z-10 flex h-[var(--header-h)] items-center justify-between px-[9vw] md:px-[3.75vw] ${bare ? "pointer-events-none" : "bg-alt-blue"}`}
      >
        {bare ? null : (
          <Link
            href={base}
            aria-label="Charlotte Kelly — home"
            className="min-h-tap inline-flex items-center no-underline"
          >
            <FloatingMark />
          </Link>
        )}

        <button
          ref={toggle}
          type="button"
          data-menu-toggle
          data-open={open}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => {
            if (open) return close();
            setAside("print");
            setOpen(true);
          }}
          // ml-auto holds it right when, bare, it is alone in the row.
          className="group min-h-tap min-w-tap pointer-events-auto ml-auto inline-flex items-center justify-end"
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
          // Solid cream rather than a dim: the page behind goes altogether,
          // into the ground it is set on, and the panel supplies the colour.
          className="bg-alt-paper absolute inset-0 opacity-0 transition-opacity duration-300 data-[open=true]:opacity-100"
        />

        {/* Beside the panel, in the middle of the cream it leaves — under
            the bar and left of the panel — her flower print, or what was
            chosen from the panel: her recent work or the ways to reach her.
            The three are stacked and cross fade. The whole follows the cream
            in, later and slower, so the ground is there before it; closing,
            it goes at once with the rest. A link followed from it closes the
            menu, as one in the panel does.

            Below lg the panel is the whole width and leaves no cream: there
            the print is left out, and Recent or Contact is laid over the
            panel instead, on its own cream, the close button still above it.
            From lg only what is set in it takes clicks: anywhere else a
            click lands on the cream and closes the menu. */}
        <div
          data-open={open}
          onClick={(event) => {
            if ((event.target as Element).closest("a")) setOpen(false);
          }}
          className={`absolute top-[var(--header-h)] bottom-0 left-0 opacity-0 transition-opacity duration-200 data-[open=true]:opacity-100 data-[open=true]:delay-200 data-[open=true]:duration-700 lg:pointer-events-none lg:right-[34rem] ${aside === "print" ? "pointer-events-none hidden lg:block" : "bg-alt-paper right-0 z-10 lg:z-auto lg:bg-transparent"}`}
        >
          {/* flower.png is the painting cut out of flower.jpg, the canvas
              made transparent, so it sits on the cream at every step of a
              fade. A blend mode could not: under a layer that is fading it
              has nothing to blend with, and only reaches the cream as the
              fade ends. */}
          <div
            aria-hidden="true"
            data-shown={aside === "print"}
            className={`${LAYER} items-center`}
          >
            {/* Sized by height, the print's own proportions giving the
                width: about the size the painting was within the photo. */}
            <div className="relative aspect-[484/671] h-[min(45vh,70%)]">
              <Image
                src="/flower.png"
                alt=""
                fill
                sizes="(min-width: 64rem) 25vw, 0px"
                // Eager: lazy, it only starts loading on the first open, and
                // the fade runs over nothing.
                loading="eager"
                className="object-contain"
              />
            </div>
          </div>

          <div data-shown={aside === "recent"} inert={aside !== "recent"} className={LAYER}>
            <section
              aria-labelledby="menu-recent"
              // Ink, as the list is set on the page: inherited, its credits
              // and dates would take the header's cream and vanish.
              className="text-alt-ink pointer-events-auto my-auto w-full max-w-[40rem]"
            >
              <h2 id="menu-recent" className={`text-alt-blue pb-m ${HEADING}`}>
                Recent
              </h2>
              <PostList posts={POSTS} limit={3} base={base} />
            </section>
          </div>

          <div data-shown={aside === "contact"} inert={aside !== "contact"} className={LAYER}>
            <ContactBlock active={open && aside === "contact"} />
          </div>
        </div>

        <div
          id="site-menu"
          ref={panel}
          data-open={open}
          aria-label="Menu"
          // Every link in here leaves this page, so closing on click is about
          // the moment before the navigation lands rather than about the menu
          // itself — without it the panel sits open over the outgoing page.
          // Except Contact from lg, which stays and prevents its navigation.
          onClick={(event) => {
            if (event.defaultPrevented) return;
            if ((event.target as Element).closest("a")) setOpen(false);
          }}
          className="bg-alt-amber text-alt-paper pb-l absolute top-0 right-0 flex h-dvh w-full max-w-[34rem] translate-x-full flex-col justify-between overflow-y-auto overscroll-contain px-[6vw] pt-[var(--header-h)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[open=true]:translate-x-0 md:px-[3.5rem]"
        >
          <MenuBody base={base} aside={aside} onAside={setAside} />
        </div>
      </div>
    </header>
  );
}

/**
 * Three rules that fold into a cross. Colour is inherited from the header,
 * and back to it whenever the menu is open, over anything a rule has been
 * given in between (the landing turns each blue as the hero leaves it).
 * data-bar is what that finds them by.
 */
function Hamburger() {
  const bar =
    "absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[open=true]:text-alt-paper";

  return (
    <span aria-hidden="true" className="relative block h-[0.75rem] w-[1.5rem]">
      <span
        data-bar
        className={`${bar} top-0 group-data-[open=true]:translate-y-[0.375rem] group-data-[open=true]:rotate-45`}
      />
      <span
        data-bar
        className={`${bar} top-[0.375rem] transition-opacity group-data-[open=true]:opacity-0`}
      />
      <span
        data-bar
        className={`${bar} top-[0.75rem] group-data-[open=true]:-translate-y-[0.375rem] group-data-[open=true]:-rotate-45`}
      />
    </span>
  );
}

/**
 * The panel: the page's sections, then her accounts, address and colophon.
 * The lists come from lib/site, as the footer's and the contact block's do,
 * so none of them can drift apart.
 */
function MenuBody({
  base,
  aside,
  onAside,
}: {
  base: string;
  aside: Aside;
  onAside: (aside: Aside) => void;
}) {
  return (
    <>
      <nav aria-label="Menu">
        <ul className="pt-2xl flex flex-col">
          {NAV.map((item) => (
            <li key={item.label}>
              <Link href={`${base}${item.hash}`} className={ITEM}>
                {item.label}
              </Link>
            </li>
          ))}
          {/* Not links: they leave nothing, but bring what they name up
              beside the panel (over it, below lg). */}
          {SHOWN.map((item) => (
            <li key={item.aside}>
              <button
                type="button"
                aria-pressed={aside === item.aside}
                onClick={() => onAside(item.aside)}
                className={`${ITEM} cursor-pointer`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-2xl">
        <ul className="flex flex-col">
          {SOCIAL.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="min-h-tap inline-flex items-center text-[0.95rem] font-bold no-underline"
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

        <p className="text-fine pt-l font-bold">
          © {new Date().getFullYear()} Charlotte Kelly
        </p>
      </div>
    </>
  );
}

type Aside = "print" | "recent" | "contact";

/** The panel items that bring something up beside it rather than leave. */
const SHOWN = [
  { label: "Recent", aside: "recent" },
  { label: "Contact", aside: "contact" },
] as const;

const ITEM =
  "min-h-tap inline-flex items-center text-[clamp(1.75rem,1.2rem+2.4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.01em] no-underline";

/** The panel's item size, for the headings of what it brings up. */
const HEADING = "text-[clamp(1.75rem,1.2rem+2.4vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.01em]";

/** One of the stacked layers beside the panel, shown by data-shown. Below
    lg, laid over the panel, it scrolls if what it holds runs long. */
const LAYER =
  "absolute inset-0 flex justify-center overflow-y-auto px-[6vw] py-l opacity-0 transition-opacity duration-500 data-[shown=true]:opacity-100 lg:px-[8%]";

/**
 * The ways to reach her, beside the open menu: her address, her accounts,
 * and the enquiry form. Set in the site's blue, as the copy on the cream
 * is elsewhere on the landing.
 */
function ContactBlock({ active }: { active: boolean }) {
  return (
    <section
      aria-labelledby="menu-contact"
      className="text-alt-blue pointer-events-auto my-auto w-full max-w-[28rem] text-[1.125rem]"
    >
      <h2 id="menu-contact" className={HEADING}>
        Contact
      </h2>

      <a
        href={`mailto:${EMAIL}`}
        className="min-h-tap mt-s inline-flex items-center underline decoration-current underline-offset-[0.25em]"
      >
        {EMAIL}
      </a>

      <ul className="flex gap-m">
        {SOCIAL.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="min-h-tap inline-flex items-center underline decoration-current underline-offset-[0.25em]"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <EnquiryForm active={active} className="pt-l" />
    </section>
  );
}
