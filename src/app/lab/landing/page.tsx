import type { Metadata } from "next";
import { LandingLab } from "./LandingLab";
import { PortfolioGrid } from "./PortfolioGrid";
import { SiteFooter } from "./SiteFooter";

export const metadata: Metadata = {
  title: "Landing — Charlotte Kelly",
  description: "Landing page direction for review.",
  robots: { index: false, follow: false },
};

export default function LandingLabPage() {
  return (
    <LandingLab>
      <PortfolioGrid />
      <SiteFooter />
    </LandingLab>
  );
}
