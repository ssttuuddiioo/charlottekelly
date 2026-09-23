import { PostList } from "@/components/blog/PostList";
import { POSTS } from "@/lib/posts";

/**
 * The three most recent pieces of work, dropped into the portfolio grid as an
 * interlude.
 *
 * Deliberately three and not more: the grid is the curated selection, this is
 * what she has been doing lately. The "View more" link PostList draws when it
 * truncates is the way through to the full list at /blog.
 *
 * No horizontal padding of its own — it renders inside PortfolioGrid's padded
 * wrapper, so its edges land on the grid's edges by construction rather than
 * by two files agreeing on a number.
 */
export function RecentPosts() {
  return (
    <section aria-labelledby="recently" className="pt-3xl pb-3xl">
      {/* Same size as the h1 on /blog — twice the title token — so the
          section and the page it leads to are recognisably the same module. */}
      <h2
        id="recently"
        className="pb-xl text-[length:calc(var(--text-title)*2)] leading-[1.05] font-bold tracking-[-0.02em]"
      >
        Recently...
      </h2>

      <PostList posts={POSTS} limit={3} />
    </section>
  );
}
