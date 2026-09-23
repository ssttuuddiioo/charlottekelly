import type { Metadata } from "next";
import { googleSans, sans, serif } from "@/lib/fonts";
import "./globals.css";

// Placeholder. Real metadata helpers arrive in phase 3.
export const metadata: Metadata = {
  title: "Charlotte Kelly",
  description: "Copywriter and associate creative director.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${googleSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
