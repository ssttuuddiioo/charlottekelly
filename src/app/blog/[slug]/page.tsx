import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectFooter } from "@/components/work/ProjectFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { formatDate, POSTS } from "@/lib/posts";

const bySlug = (slug: string) => POSTS.find((post) => post.slug === slug);

/** Every entry is known at build time, so every page is prerendered. */
export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = bySlug((await params).slug);
  if (!post) return {};

  return {
    title: `${post.title} — Charlotte Kelly`,
    description: `${post.title}, with ${post.credit}.`,
  };
}

/**
 * PLACEHOLDER BODY — one paragraph, identical on all eleven entries, until
 * Charlotte writes them. It is written to say so: the point of it is to hold
 * the measure and the rhythm of the column for review, not to be read twice.
 */
const BODY =
  "Placeholder copy, the same on every entry until the real writing lands. One paragraph goes here, under the image: what the brief was, who it was for, and what the work turned into. Fifty or sixty words is the length this column is measured for — long enough to say something, short enough that the whole page stays a single glance rather than a case study.";

/** Shared so the two links at the foot of the page cannot drift apart. */
const LINK =
  "text-alt-blue min-h-tap inline-flex items-center gap-[0.4em] underline decoration-current underline-offset-[0.4em]";

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = bySlug(slug);
  if (!post) notFound();

  // Nothing to open in a new tab until there is a real URL, so the attributes
  // that would do it are withheld rather than pointed at "#".
  const external = Boolean(post.clientUrl);

  return (
    <div className="bg-alt-paper text-alt-ink font-display min-h-dvh pt-[var(--header-h)]">
      <SiteHeader />

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

        {/* PLACEHOLDER. A labelled empty frame rather than one of the images
            in /public, every one of which belongs to a named client — putting
            Dame's photograph at the top of the Gusto entry is a mistake that
            looks fine right up until it ships. */}
        <div className="bg-alt-ink/5 text-alt-muted text-fine mt-l flex aspect-[3/2] items-center justify-center">
          Image
        </div>

        <p className="pt-l">{BODY}</p>

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

          <Link href="/" className={LINK}>
            Home
          </Link>
        </div>
      </main>

      <ProjectFooter />
    </div>
  );
}
