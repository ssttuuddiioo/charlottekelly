import { ProjectCard } from "@/components/work/ProjectCard";
import { PROJECTS, type Project } from "@/lib/projects";

/**
 * Proportions measured off the mock: three equal columns and ~10px gutters.
 * The card itself — crop, type, link — lives in ProjectCard, shared with the
 * "more work" row on a project page.
 */

/** Explicit column counts rather than auto-fit. Uncapped, auto-fit would keep
    adding columns on a wide display (5 at 1920px); the cards are meant to
    scale, not multiply. Gutters stay put.

    The run takes three quarters of the width, centred, so the cards are 75%
    of their full-width size with as much room either side. The bio above
    sits in the same centred column (LandingShell), so the two share an
    edge. */
const COLUMNS = "mx-auto grid w-3/4 grid-cols-1 gap-x-2xs gap-y-xl md:grid-cols-2 xl:grid-cols-3";

/** The grid is uncapped, so the columns are a fixed share of the viewport and
    sizes is expressed in vw: three quarters of 84vw is 63vw, so 3-up is ~21vw,
    2-up is ~32vw, 1-up is 66vw. */
const SIZES = "(min-width: 80rem) 21vw, (min-width: 48rem) 32vw, 66vw";

function Run({ projects, base }: { projects: Project[]; base: string }) {
  return (
    <ul className={COLUMNS}>
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} sizes={SIZES} base={base} />
        </li>
      ))}
    </ul>
  );
}

export function PortfolioGrid({ base }: { base: string }) {
  return (
    /* Full page width — no max-width cap — so the columns keep growing with
       the viewport. Padding matches the bio copy above it exactly. */
    <div className="bg-alt-paper text-alt-ink px-[6vw] pb-3xl md:px-[8vw]">
      <section id="work" aria-labelledby="work-heading">
        <h2 id="work-heading" className="sr-only">
          Selected work
        </h2>
        <Run projects={PROJECTS} base={base} />
      </section>
    </div>
  );
}
