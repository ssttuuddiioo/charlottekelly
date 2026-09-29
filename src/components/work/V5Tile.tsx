"use client";

import Image from "next/image";

/**
 * v5's print, the orange tile, as the way into the page. It is on the blue
 * from the first screen, while the rest of the column waits for the name,
 * and a click scrolls to the top of the list: the list comes up over the
 * hero, the name drops into the column and the about fades up after it —
 * all V4HeroMotion's, driven by the scroll as a wheel would drive it.
 *
 * Smooth unless the reader asks for reduced motion, where it jumps.
 */
export function V5Tile({ className = "" }: { className?: string }) {
  const toList = () => {
    // The list's heading where it has one, so the scroll lands on it rather
    // than just under it.
    const list =
      document.querySelector<HTMLElement>("[data-list-head]") ??
      document.querySelector<HTMLElement>("main ol");
    if (!list) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: list.getBoundingClientRect().top + window.scrollY,
      behavior: still ? "auto" : "smooth",
    });
  };

  return (
    <button type="button" onClick={toList} aria-label="See the work" className="cursor-pointer">
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
