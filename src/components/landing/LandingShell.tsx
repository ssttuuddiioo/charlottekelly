"use client";

import { useRef } from "react";
import { HashScroll } from "@/components/site/HashScroll";
import { BIO } from "@/lib/site";
import { LandingHeader } from "./LandingHeader";
import { ScatteredName } from "./ScatteredName";

export function LandingShell({ base, children }: { base: string; children?: React.ReactNode }) {
  const hero = useRef<HTMLElement>(null);

  return (
    <div className="bg-alt-blue text-alt-paper font-display">
      {/* No visible output. In-page links get their smooth scrolling from
          here, because the CSS property that would otherwise do it also
          animates ScrollTrigger's own corrections. */}
      <HashScroll />

      {/* relative so the name's offsets are measured from here
          (LandingHeader), pinned or not. */}
      <section id="top" ref={hero} className="relative flex min-h-dvh flex-col">
        {/* The name is rendered twice: scattered and aria-hidden for the eye,
            flat and visually hidden for screen readers and crawlers. */}
        <h1 className="sr-only">Charlotte Kelly</h1>

        <main className="flex flex-1 items-center justify-center px-[6vw] py-2xl">
          <ScatteredName trigger={hero} />
        </main>
      </section>

      {/* The menu button, fixed top right, and the motion of the name as
          the hero leaves. After the hero rather than before it, fixed as
          it is, because
          React sets refs and runs layout effects in tree order: here the
          hero ref is set, and ScatteredName's pin made, by the time this
          measures against them. */}
      <LandingHeader base={base} hero={hero} />

      {/* Sized to its copy, not to the viewport. It used to be min-h-dvh to
          give the scroll-driven align somewhere to run; the grid below supplies
          that now, and holding a full viewport just left dead space. */}
      <section id="about" className="bg-alt-paper text-alt-blue px-[6vw] pt-3xl pb-2xl md:px-[8vw]">
        {/* The portfolio's centred column, three quarters of the width:
            the same share and the same section padding as PortfolioGrid
            below, so the copy's edges land on the cards' by construction.
            Full width on a phone, where a quarter less of a narrow column
            would leave the copy a few words a line. */}
        <div className="text-[clamp(1.5rem,1.3143rem+0.7619vw,2rem)] leading-[1.3] font-normal md:mx-auto md:w-3/4">
          {BIO.map((paragraph, i) => (
            <p key={i} className={i ? "mt-[0.9em]" : undefined}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Passed in from the server component so the project copy stays in the
          RSC payload rather than being pulled into this client bundle. */}
      {children}
    </div>
  );
}
