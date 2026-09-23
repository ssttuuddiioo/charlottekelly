import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ProjectFooter } from "@/components/work/ProjectFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PROJECTS, type BodyRun } from "@/lib/projects";

const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/** Every project is known at build time, so every page is prerendered. */
export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = bySlug((await params).slug);
  if (!project) return {};

  return {
    title: `${project.title} — Charlotte Kelly`,
    description: project.services,
    openGraph: { images: [{ url: project.image }] },
  };
}

/**
 * A run of body copy. Links open in a new tab because they point at the
 * client's own site, not further reading here.
 */
function Body({ runs }: { runs: BodyRun[] }) {
  return (
    <p className="max-w-[58ch] text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-[1.4] font-medium">
      {runs.map((run, i) =>
        typeof run === "string" ? (
          run
        ) : (
          <a
            key={i}
            href={run.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-[0.2em]"
          >
            {run.text}
          </a>
        ),
      )}
    </p>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();

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
      <SiteHeader />

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

        {project.body ? (
          <div className="pt-l">
            <Body runs={project.body} />
          </div>
        ) : null}

        {project.gallery?.length ? (
          <ul className="flex flex-col gap-m pt-l">
            {project.gallery.map((shot) => (
              <li key={shot.src}>
                <div className="bg-alt-ink/5 relative aspect-[2/1] overflow-hidden">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 48rem) 95vw, 88vw"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <section className="pt-3xl">
          <h2 className="sr-only">More work</h2>
          <ul className="grid grid-cols-1 gap-x-2xs gap-y-xl sm:grid-cols-3">
            {more.map((other) => (
              <li key={other.slug}>
                <ProjectCard project={other} sizes="(min-width: 40rem) 32vw, 88vw" />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <ProjectFooter />
    </div>
  );
}
