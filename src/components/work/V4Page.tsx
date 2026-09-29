import { FloatingMark } from "@/components/site/FloatingMark";
import { V3Page } from "@/components/work/V3Page";
import { V4HeroMotion } from "@/components/work/V4HeroMotion";

/**
 * v4: v3 with a hero above the project list. The list, the blue column and
 * everything about opening a project are v3's own, so the two can only
 * differ in the hero.
 *
 * The hero is a block of amber for now, a placeholder for whatever comes to
 * sit there: it fills the first screen, so the page opens on it and the list
 * begins just below the fold. On /v4/work/[slug] the page scrolls past it to
 * the open project, as v3 does.
 *
 * The floating name sits in the middle of it in cream, drawn larger than the
 * sidebar's. The lockup is ~22em wide, so the letter size tracks the
 * viewport to keep it on one line at phone width, and steps down from lg,
 * where the hero only has the two-thirds column.
 *
 * On scroll it stays pinned while the list comes up over it, the name rising
 * out over the top and the amber fading to the cream, and from lg the name
 * is tied to the one in the blue column, which drops in as this one leaves
 * (V4HeroMotion). The amber is its own layer so it can fade without the name.
 * Nothing in it takes a click, so it never catches one meant for the list.
 */
export function V4Hero() {
  return (
    <section
      aria-label="Introduction"
      data-hero
      className="text-alt-paper font-display pointer-events-none relative -mx-[6vw] flex h-dvh items-center justify-center lg:-mx-[4vw] [&_.site-mark]:[--letter:clamp(0.75rem,3vw,2.25rem)] lg:[&_.site-mark]:[--letter:clamp(0.75rem,2vw,2.25rem)]"
    >
      <div data-hero-ground className="bg-alt-amber absolute inset-0" />
      <div className="relative">
        <FloatingMark />
      </div>
      <V4HeroMotion />
    </section>
  );
}

export function V4Page({ base, open }: { base: string; open?: string }) {
  return <V3Page base={base} open={open} hero={<V4Hero />} />;
}
