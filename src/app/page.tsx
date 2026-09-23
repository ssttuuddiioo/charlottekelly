import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  title: "Charlotte Kelly",
  description:
    "Charlotte Kelly is an independent senior copywriter working on brand strategy, verbal identity, and all kinds of writing.",
};

export default function Home() {
  return <Landing />;
}
