import Image from "next/image";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Facts, Gallery, Paragraphs } from "@/components/work/CaseStudy";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ProjectFooter } from "@/components/work/ProjectFooter";
import { PROJECTS, type Project } from "@/lib/projects";

/**
 * v1's case study: title and tags, a 16/9 hero, the copy, the gallery, and
 * three more projects, all under the fixed blue bar.
 */
export function V1Project({ project, base }: { project: Project; base: string }) {
  // Three others, in running order from the current one, so the row differs
  // from project to project instead of always showing the same three.
  const index = PROJECTS.indexOf(project);
  const more = [1, 2, 3].map((n) => PROJECTS[(index + n) % PROJECTS.length]);

  return (
    <div className="bg-alt-paper text-alt-ink font-display min-h-dvh pt-[var(--header-h)]">
      {/* The mock's blue band across the top, now carrying the name lockup at
          mark size and a menu, and fixed rather than scrolling away — a project
          page used to be a dead end with one way out of it. The padding above
          is what the fixed bar would otherwise sit on top of. */}
      <SiteHeader base={base} />

      <main className="px-[6vw] md:px-[2.5vw]">
        {/* Title and tags lead the page, above the hero image.

            Sized as literally twice the title token rather than a hand-picked
            clamp, so it keeps tracking the type scale if that token is ever
            retuned. The token's own 1.35 leading is far too loose at double
            the size, hence the override. */}
        <h1 className="pt-l text-[length:calc(var(--text-title)*2)] leading-[1.05] tracking-[-0.02em]">
          {project.title}
        </h1>
        <p className="text-alt-muted pt-xs text-fine">{project.services}</p>

        {/* 16/9 per the mock. The current images are portfolio thumbs of mixed
            aspect, so this crops some of them hard — see the handoff note about
            dedicated hero assets. */}
        <div className="bg-alt-ink/5 relative mt-l aspect-[16/9] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(min-width: 48rem) 95vw, 88vw"
            className="object-cover"
          />
        </div>

        <Paragraphs
          body={project.body}
          className="max-w-[58ch] pt-l text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-[1.4] font-medium"
        />
        <Facts project={project} className="text-fine grid grid-cols-[auto_minmax(0,1fr)] gap-x-s pt-m" term="text-alt-muted" />

        <Gallery
          project={project}
          sizes={{ full: "(min-width: 48rem) 95vw, 88vw", half: "(min-width: 48rem) 47vw, 88vw" }}
          className="pt-l"
        />

        <section className="pt-3xl">
          <h2 className="sr-only">More work</h2>
          <ul className="grid grid-cols-1 gap-x-2xs gap-y-xl sm:grid-cols-3">
            {more.map((other) => (
              <li key={other.slug}>
                <ProjectCard
                  project={other}
                  sizes="(min-width: 40rem) 32vw, 88vw"
                  base={base}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <ProjectFooter />
    </div>
  );
}
