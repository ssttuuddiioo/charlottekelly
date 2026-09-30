"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SiteHeader } from "@/components/site/SiteHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The landing's header: only the menu button, fixed in the top right corner
 * from the first screen, over the blue hero and then over everything after
 * it. No bar — the hero scrolls off the top like the rest of the page.
 *
 * As the hero leaves, the name in it is held in the middle of what is left
 * of the blue — halfway between the top of the window and the hero's foot —
 * and fades out as that foot reaches the top. The button's rules are cream
 * on the blue and turn blue one by one as the foot passes each, so each is
 * cream exactly while it is over blue.
 *
 * All of it is tied to the scroll with no smoothing, so it moves with the
 * page's own scrolling, frame for frame.
 */
export function LandingHeader({
  base,
  hero,
}: {
  base: string;
  hero: RefObject<HTMLElement | null>;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = hero.current;
    const row = section?.querySelector<HTMLElement>("[data-name-row]");
    // The section after the hero: its top is the hero's foot whether or not
    // the hero is pinned, since the pin's spacer sits between the two.
    const next = document.getElementById("about");
    const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", wrap.current);
    if (!section || !row || !next) return;

    // How far the row's middle sits below the hero's top. Offsets rather
    // than rects: neither the pin nor the tween below moves them.
    const within = () => row.offsetTop + row.offsetHeight / 2;

    // From the hero's foot at the bottom of the window to the foot at the
    // top, the name at the middle of the blue between: by the end the
    // hero's top is a full height above the window and the name at 0.
    const follow = gsap.fromTo(
      row,
      { y: 0 },
      {
        y: () => section.offsetHeight - within(),
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );

    // Gone by the time the blue is: out over the last fifth of the window.
    const fade = gsap.fromTo(
      row,
      { opacity: 1 },
      {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top 20%",
          end: "top top",
          scrub: true,
        },
      },
    );

    // Each rule turns blue as the hero's foot passes its middle, and back
    // as it comes down over it again. The rules are fixed, so where they
    // sit in the window is where they sit on the page's first screen.
    const turns = bars.map((bar) =>
      ScrollTrigger.create({
        trigger: next,
        start: () => {
          const r = bar.getBoundingClientRect();
          return `top ${r.top + r.height / 2}px`;
        },
        end: "+=1000000",
        invalidateOnRefresh: true,
        toggleClass: { targets: bar, className: "text-alt-blue" },
      }),
    );

    return () => {
      follow.scrollTrigger?.kill();
      follow.kill();
      fade.scrollTrigger?.kill();
      fade.kill();
      turns.forEach((t) => t.kill());
      gsap.set(row, { clearProps: "transform,opacity" });
    };
  }, [hero]);

  return (
    <div ref={wrap}>
      <SiteHeader base={base} bare />
    </div>
  );
}
