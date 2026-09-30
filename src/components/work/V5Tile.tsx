"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

/** How long, in seconds, the click's scroll to the list takes. Slower than
    the browser's own smooth scroll, so the hero's motion has time to play. */
const DURATION = 2.4;

/**
 * v5's print, the orange tile, as the way into the page. It is on the blue
 * from the first screen, while the rest of the column waits for the name,
 * and a click scrolls to the top of the list: the list comes up over the
 * hero, the name drops into the column and the about fades up after it —
 * all V4HeroMotion's, driven by the scroll as a wheel would drive it.
 *
 * The tile fades out over the same scroll, its job done, and comes back once
 * the reader is at the top of the page again. A wheel or a touch during the
 * scroll hands it back to the reader where it is.
 *
 * With reduced motion it jumps, and the tile just goes.
 */
export function V5Tile({ className = "" }: { className?: string }) {
  const tile = useRef<HTMLButtonElement>(null);

  // Back at the top, the tile is the way in again.
  useEffect(() => {
    const onScroll = () => {
      const el = tile.current;
      if (!el || window.scrollY > 1 || gsap.isTweening(window)) return;
      if (Number(gsap.getProperty(el, "opacity")) < 1) {
        gsap.to(el, { autoAlpha: 1, duration: 0.6, ease: "power2.out", overwrite: true });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toList = () => {
    // The list's heading where it has one, so the scroll lands on it rather
    // than just under it.
    const list =
      document.querySelector<HTMLElement>("[data-list-head]") ??
      document.querySelector<HTMLElement>("main ol");
    if (!list) return;
    const top = list.getBoundingClientRect().top + window.scrollY;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = still ? 0 : DURATION;

    gsap.to(tile.current, { autoAlpha: 0, duration: duration * 0.5, ease: "power2.out", overwrite: true });
    gsap.to(window, {
      scrollTo: { y: top, autoKill: true },
      duration,
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  return (
    <button ref={tile} type="button" onClick={toList} aria-label="See the work" className="cursor-pointer">
      <Image
        src="/tile.png"
        alt=""
        width={543}
        height={714}
        priority
        sizes="7.5rem"
        className={`block h-auto ${className}`}
      />
    </button>
  );
}
