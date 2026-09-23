import { LandingShell } from "./LandingShell";
import { PortfolioGrid } from "./PortfolioGrid";
import { SiteFooter } from "./SiteFooter";

/**
 * The whole landing page, composed once and rendered by both `/` and the
 * review URL at `/lab/landing`, so the two can never drift apart.
 *
 * The grid and the footer are passed as children rather than imported inside
 * LandingShell: that keeps them server components, so the project copy stays in
 * the RSC payload instead of being pulled into the client bundle with the
 * animation code.
 */
export function Landing() {
  return (
    <LandingShell>
      <PortfolioGrid />
      <SiteFooter />
    </LandingShell>
  );
}
