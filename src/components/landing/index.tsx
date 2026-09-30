import { ProjectFooter } from "@/components/work/ProjectFooter";
import { LandingShell } from "./LandingShell";
import { PortfolioGrid } from "./PortfolioGrid";

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
 * Her recent writing is not on it: v1's menu brings that up (SiteHeader).
 */
export function Landing({ base }: { base: string }) {
  return (
    <LandingShell base={base}>
      <PortfolioGrid base={base} />
      <ProjectFooter />
    </LandingShell>
  );
}
