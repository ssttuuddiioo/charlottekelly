import { ProjectCard } from "@/components/work/ProjectCard";
import { PROJECTS } from "@/lib/projects";

/**
 * Proportions measured off the mock: three equal columns and ~10px gutters.
 * The card itself — crop, type, link — lives in ProjectCard, shared with the
 * "more work" row on a project page.
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
              {/* Now that the grid is uncapped the columns are a fixed share
                  of the viewport, so sizes is expressed in vw: 3-up inside
                  84vw is ~28vw, 2-up is ~42vw, 1-up is 88vw. */}
              <ProjectCard
                project={project}
                sizes="(min-width: 80rem) 28vw, (min-width: 48rem) 42vw, 88vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
