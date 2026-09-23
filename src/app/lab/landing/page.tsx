import type { Metadata } from "next";
import { Landing } from "@/components/landing";

/**
 * Review URL. Renders exactly what `/` renders — same component, no copy —
 * so sharing this link always shows the live landing. Kept noindex so the two
 * routes never compete as duplicate content.
 */
export const metadata: Metadata = {
  title: "Landing — Charlotte Kelly",
  description: "Landing page direction for review.",
  robots: { index: false, follow: false },
};

export default function LandingLabPage() {
  return <Landing />;
}
