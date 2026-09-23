import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

/**
 * The list as a ruled table: who it was made with and when on the left, the
 * title on the right, a hairline between every row.
 *
 * Column proportions are measured off the reference layout — the left cell
 * takes just under a third, the title starts at 31% of the page — hence
 * `5fr / 11fr` rather than a rounder `1fr / 2fr`. Written as fractions so the
 * split holds at any width instead of being a percentage that has to be
 * re-checked.
 */
const ROW = "grid md:grid-cols-[5fr_11fr] md:gap-x-s";

function Row({ post }: { post: Post }) {
  return (
    <li className="border-alt-ink/15 border-b">
      {/* One link across the whole row, as on a project card: a much larger
          target than the title alone, and one stop in the tab order. The meta
          reads first in the accessible name, which is also the order it is
          read in on screen. */}
      <Link
        href={`/blog/${post.slug}`}
        className={`group items-start gap-y-2xs py-m no-underline ${ROW}`}
      >
        <p className="text-small flex items-center gap-[0.6em] pt-[0.35em]">
          <span className="font-bold">{post.credit}</span>
          {/* A drawn rule, not a "|" — a pipe sits on the baseline and takes
              the font's own weight; this stays a hairline. */}
          <span aria-hidden="true" className="bg-alt-ink/30 h-[1.3em] w-px" />
          <span>{formatDate(post.date)}</span>
        </p>

        <h3 className="text-alt-blue text-[length:var(--text-title)] leading-[1.1] font-bold tracking-[-0.01em] group-hover:underline">
          {post.title}
        </h3>
      </Link>
    </li>
  );
}

/**
 * `limit` rows are shown; the rest fold away behind a "View more" that opens
 * them in place.
 *
 * A plain `<details>` rather than state and a button: it opens, closes, is
 * keyboard operable and is announced as a disclosure with no JavaScript at
 * all, which matters here because this list sits inside the landing's client
 * component and would otherwise be a reason to ship more of it.
 *
 * The consequence is that the control stays where it is when the list opens,
 * between the third row and the fourth, rather than moving to the bottom. That
 * reads as a hinge, which is what it is.
 */
export function PostList({ posts, limit }: { posts: Post[]; limit?: number }) {
  const shown = limit ? posts.slice(0, limit) : posts;
  const rest = limit ? posts.slice(limit) : [];

  return (
    <div>
      {/* The rule above row one is the list's own top edge; every row then
          carries the rule beneath it, so the run closes under the last row
          whether or not the fold follows. */}
      <ul className="border-alt-ink/15 border-t">
        {shown.map((post) => (
          <Row key={post.slug} post={post} />
        ))}
      </ul>

      {rest.length ? (
        <details className="group">
          {/* list-none and the webkit rule between them drop the disclosure
              triangle in every engine. The label sits in the title column, on
              the left edge the titles all start from. */}
          <summary
            className={`text-small cursor-pointer list-none py-2xs font-bold [&::-webkit-details-marker]:hidden ${ROW}`}
          >
            <span className="text-alt-blue min-h-tap inline-flex items-center underline decoration-current underline-offset-[0.4em] md:col-start-2">
              <span className="group-open:hidden">View more</span>
              <span className="hidden group-open:inline">View less</span>
            </span>
          </summary>

          <ul className="border-alt-ink/15 border-t">
            {rest.map((post) => (
              <Row key={post.slug} post={post} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
