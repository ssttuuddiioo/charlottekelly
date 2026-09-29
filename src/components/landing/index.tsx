import { LandingShell } from "./LandingShell";
import { PortfolioGrid } from "./PortfolioGrid";
import { RecentPosts } from "./RecentPosts";
import { SiteFooter } from "./SiteFooter";

/**
 * The whole landing page, composed once and rendered by every version's root
 * (/v1, /v2), so the versions differ in their case studies and nowhere else.
 * `base` is that version's prefix, so every link on it stays inside it.
 *
 * The grid and the footer are passed as children rather than imported inside
 * LandingShell: that keeps them server components, so the project copy stays in
 * the RSC payload instead of being pulled into the client bundle with the
 * animation code.
 *
 * The writing goes through the grid rather than after it — the grid breaks for
 * it after the third row — so it is passed in the same way, and this file stays
 * the one place the landing's running order is written down.
 */
export function Landing({ base }: { base: string }) {
  return (
    <LandingShell>
      <PortfolioGrid base={base} interlude={<RecentPosts base={base} />} />
      <SiteFooter base={base} />
    </LandingShell>
  );
}
