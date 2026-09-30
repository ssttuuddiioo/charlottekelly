import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { heroOf, Masonry } from "@/components/work/CaseStudy";
import { ProjectFooter } from "@/components/work/ProjectFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ALL_POSTS, formatDate } from "@/lib/posts";
import { PROJECTS } from "@/lib/projects";

const bySlug = (slug: string) => ALL_POSTS.find((post) => post.slug === slug);

/** Every entry is known at build time, so every page is prerendered. */
export function generateStaticParams() {
  return ALL_POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[version]/blog/[slug]">): Promise<Metadata> {
  const post = bySlug((await params).slug);
  if (!post) return {};

  return {
    title: `${post.title} — Charlotte Kelly`,
    description: `${post.title}, with ${post.credit}.`,
  };
}

/**
 * PLACEHOLDER BODY — lorem ipsum, identical on every entry, until Charlotte
 * writes them. It holds the measure and the rhythm of the column for review.
 */
const BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

/** Shared so the two links at the foot of the page cannot drift apart. */
const LINK =
  "text-alt-blue min-h-tap inline-flex items-center gap-[0.4em] underline decoration-current underline-offset-[0.4em]";

export default async function PostPage({ params }: PageProps<"/[version]/blog/[slug]">) {
  const { version, slug } = await params;
  const post = bySlug(slug);
  if (!post) notFound();

  // Posts are the same page in every version; only where its links lead
  // changes, so reading one never drops you into another version.
  const base = `/${version}`;

  // Nothing to open in a new tab until there is a real URL, so the attributes
  // that would do it are withheld rather than pointed at "#".
  const external = Boolean(post.clientUrl);

  // v5's entries are the landing's projects, so they share a slug with one
  // and can show its pictures: the case study's lead image up top, the rest
  // of its gallery under the copy. POSTS entries have none and keep the frame.
  const project = PROJECTS.find((p) => p.slug === slug);
  const hero = project ? heroOf(project) : null;

  return (
    <div className="bg-alt-paper text-alt-ink font-display min-h-dvh pt-[var(--header-h)]">
      <SiteHeader base={base} />

      {/* One centred column at the reading measure, not the full-bleed width
          the work pages use. A post is read straight down; the portfolio is
          scanned across. */}
      <main className="max-w-measure pt-2xl pb-3xl mx-auto px-[6vw]">
        {/* The same left cell as the row this page was reached from, so the
            two read as the same record seen twice. */}
        <p className="text-small flex items-center gap-[0.6em]">
          <span className="font-bold">{post.credit}</span>
          <span aria-hidden="true" className="bg-alt-ink/30 h-[1.3em] w-px" />
          <span>{formatDate(post.date)}</span>
        </p>

        {/* text-heading rather than the double-title size the index and the
            project pages use: these titles are whole sentences, and at that
            size the longest of them fills this column six lines deep. */}
        <h1 className="text-heading pt-2xs font-bold">{post.title}</h1>

        {/* The project's own lead image where there is one. Otherwise a
            PLACEHOLDER: a labelled empty frame rather than one of the images
            in /public, every one of which belongs to a named client — putting
            Dame's photograph at the top of the Gusto entry is a mistake that
            looks fine right up until it ships. */}
        {hero && project ? (
          <div className="bg-alt-ink/5 mt-l relative aspect-[3/2] overflow-hidden">
            <Image
              src={hero.src}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 48rem) 40rem, 88vw"
              unoptimized={hero.src.endsWith(".gif")}
              className={`object-cover ${hero.width / hero.height < 1.2 ? "object-top" : ""}`}
            />
          </div>
        ) : (
          <div className="bg-alt-ink/5 text-alt-muted text-fine mt-l flex aspect-[3/2] items-center justify-center">
            Image
          </div>
        )}

        <p className="pt-l">{BODY}</p>

        {project ? <Masonry project={project} exclude={hero?.src} className="pt-l" /> : null}

        {/* Two ways out, side by side: on to the client's own site, or back to
            the start. Wraps to two lines on a narrow phone rather than
            crushing the gap, which is why the gap is set on one axis only. */}
        <div className="pt-l text-small flex flex-wrap items-center gap-x-l gap-y-2xs font-bold">
          <a
            href={post.clientUrl ?? "#"}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={LINK}
          >
            View project
            {external ? <span className="sr-only">(opens in a new tab)</span> : null}
            {/* Only the outbound link carries the arrow — it is the one that
                leaves the site, and marking both would stop it meaning that. */}
            <span aria-hidden="true" className="no-underline">
              ↗
            </span>
          </a>

          <Link href={base} className={LINK}>
            Home
          </Link>
        </div>
      </main>

      <ProjectFooter />
    </div>
  );
}
