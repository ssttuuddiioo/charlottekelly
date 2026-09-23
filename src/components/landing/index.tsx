import { LandingShell } from "./LandingShell";
import { PortfolioGrid } from "./PortfolioGrid";
import { RecentPosts } from "./RecentPosts";
import { SiteFooter } from "./SiteFooter";

/**
 * The whole landing page, composed once and rendered by both `/` and the
 * review URL at `/lab/landing`, so the two can never drift apart.
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
export function Landing() {
  return (
    <LandingShell>
      <PortfolioGrid interlude={<RecentPosts />} />
      <SiteFooter />
    </LandingShell>
  );
}
