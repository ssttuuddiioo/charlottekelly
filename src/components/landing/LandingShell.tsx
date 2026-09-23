"use client";

import { useRef } from "react";
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
        {/* Measure is set in ch on this wrapper so it resolves against the copy
            size, not the inherited one. 44ch rather than the site's 68ch: that
            figure is for 16–18px body text, and bold copy at 24–32px needs a
            much shorter line to stay readable. */}
        <div className="max-w-[44ch] text-[clamp(1.5rem,1.3143rem+0.7619vw,2rem)] leading-[1.3] font-bold">
          <p>
            Charlotte Kelly is an independent senior copywriter. She has been
            partnering with agencies, studios, and friends on brand strategy,
            verbal identity, and all kinds of writing since 2015. Before then, she
            worked for literary agents and publishing houses. Her projects have
            ranged from groundbreaking startups to established global brands
            across beauty, wellness, tech, fashion, and more.
          </p>
          <p className="mt-[0.9em]">
            After many years in NYC, she’s currently based in San Diego, CA,
            working with teams everywhere.
          </p>
        </div>
      </section>

      {/* Passed in from the server component so the project copy stays in the
          RSC payload rather than being pulled into this client bundle. */}
      {children}
    </div>
  );
}
