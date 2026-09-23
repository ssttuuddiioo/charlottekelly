import Image from "next/image";
import { PROJECTS } from "./projects";

/**
 * Proportions measured off the mock: three equal columns, ~10px gutters, and a
 * 6/7 portrait crop on every card.
 *
 * The source images range from 0.675 to 1.922 in aspect, so the crop is what
 * makes the grid read as a grid. A fixed-aspect box plus `fill` is also what
 * keeps this CLS-free — intrinsic width/height would give every card a
 * different height and defeat the layout.
 */
export function PortfolioGrid() {
  return (
    <section id="work" className="bg-alt-paper text-alt-ink px-[6vw] pb-3xl md:px-[8vw]">
      {/* Full page width — no max-width cap — so the columns keep growing with
          the viewport. Padding matches the bio copy above it exactly. */}
      <div>
        <h2 className="sr-only">Selected work</h2>

        {/* Explicit column counts rather than auto-fit. Uncapped, auto-fit
            would keep adding columns on a wide display (5 at 1920px); the
            cards are meant to scale, not multiply. Gutters stay put. */}
        <ul className="grid grid-cols-1 gap-x-2xs gap-y-xl md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project) => (
            <li key={project.slug}>
              <article>
                <div className="bg-alt-ink/5 relative aspect-[6/7] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    // Now that the grid is uncapped the columns are a fixed
                    // share of the viewport, so sizes is expressed in vw:
                    // 3-up inside 84vw is ~28vw, 2-up is ~42vw, 1-up is 88vw.
                    sizes="(min-width: 80rem) 28vw, (min-width: 48rem) 42vw, 88vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="pt-2xs text-[clamp(1.0625rem,0.98rem+0.38vw,1.25rem)] leading-[1.25]">
                  {project.title}
                </h3>
                {/* 12px floor rather than the mock's ~10px — below that the
                    services line stops being readable. */}
                <p className="text-alt-muted pt-3xs text-fine">{project.services}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
