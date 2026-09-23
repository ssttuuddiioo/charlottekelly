"use client";

import { useRef } from "react";
import { HashScroll } from "@/components/site/HashScroll";
import { DevelopingTile } from "./DevelopingTile";
import { ScatteredName } from "./ScatteredName";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Work", href: "#work" },
];
const CONTACT = [
  { label: "Email", href: "mailto:hello@charlottekelly.com" },
  { label: "Linkedin", href: "https://www.linkedin.com/" },
];

export function LandingShell({ children }: { children?: React.ReactNode }) {
  const hero = useRef<HTMLElement>(null);

  return (
    <div className="bg-alt-blue text-alt-paper font-display">
      {/* No visible output. In-page links get their smooth scrolling from
          here, because the CSS property that would otherwise do it also
          animates ScrollTrigger's own corrections. */}
      <HashScroll />

      <section id="top" ref={hero} className="flex min-h-dvh flex-col">
        {/* The name is rendered twice: scattered and aria-hidden for the eye,
            flat and visually hidden for screen readers and crawlers. */}
        <h1 className="sr-only">Charlotte Kelly</h1>

        <main className="flex flex-1 items-center justify-center px-[6vw] py-2xl">
          <ScatteredName trigger={hero} />
        </main>

        <footer className="px-[6vw] pb-l md:px-[8vw]">
          <nav
            aria-label="Site"
            className="flex flex-wrap items-center justify-between gap-x-l gap-y-2xs text-[0.95rem]"
          >
            <ul className="flex items-center gap-m">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="min-h-tap inline-flex items-center no-underline opacity-90 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex items-center gap-m">
              {CONTACT.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="min-h-tap inline-flex items-center no-underline opacity-90 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </section>

      {/* Sized to its copy, not to the viewport. It used to be min-h-dvh to
          give the scroll-driven align somewhere to run; the grid below supplies
          that now, and holding a full viewport just left dead space. */}
      <section id="about" className="bg-alt-paper text-alt-blue px-[6vw] pt-3xl pb-2xl md:px-[8vw]">
        {/* Same track definition and gutter as PortfolioGrid below, and the
            section padding matches it too, so the copy's left edge lands
            exactly on the grid's second column. Done as a real grid rather
            than a measured indent: the two stay aligned by construction if
            the column count or gutter ever changes.

            items-start keeps the print at its own height instead of being
            stretched to the height of the copy beside it. */}
        <div className="grid grid-cols-1 items-start gap-x-2xs gap-y-l md:grid-cols-2 xl:grid-cols-3">
          {/* The print has a whole column to itself and sits at the top left
              of it. It develops in on scroll rather than simply being there —
              see DevelopingTile. */}
          <DevelopingTile className="w-[34vw] max-w-[150px] md:w-[18vw] md:max-w-[200px]" />

          {/* Starts on column 2 and runs the full remaining width of the grid,
              so its right edge lands on the same page padding as the last
              portfolio column. It has to span the remaining two columns at xl,
              not sit inside one: a single column there is ~400px, which at
              32px type is about 25 characters a line.

              No max-width: the measure is set by the grid now, which puts it
              around 50 characters at 1440 and 56 at 1920 — wider than the 44ch
              the copy had before. */}
          <div className="text-[clamp(1.5rem,1.3143rem+0.7619vw,2rem)] leading-[1.3] font-normal md:col-start-2 xl:col-span-2">
            <p>
              Charlotte Kelly is an independent senior copywriter. She has been
              partnering with agencies, studios, and friends on brand strategy,
              verbal identity, and all kinds of writing since 2015. Before then,
              she worked for literary agents and publishing houses. Her projects
              have ranged from groundbreaking startups to established global
              brands across beauty, wellness, tech, fashion, and more.
            </p>
            <p className="mt-[0.9em]">
              After many years in NYC, she’s currently based in San Diego, CA,
              working with teams everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Passed in from the server component so the project copy stays in the
          RSC payload rather than being pulled into this client bundle. */}
      {children}
    </div>
  );
}
