import type { Metadata } from "next";
import { googleSans, sans, serif } from "@/lib/fonts";
import "./globals.css";

/**
 * Absolute base for OG/Twitter image URLs, which have to be absolute to
 * resolve for a crawler. Vercel supplies the production host at build; the
 * localhost fallback keeps dev quiet. Set NEXT_PUBLIC_SITE_URL once the real
 * domain is attached.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Placeholder. Real metadata helpers arrive in phase 3.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Charlotte Kelly",
  description: "Copywriter and associate creative director.",
};

/**
 * Open every fresh load at the top.
 *
 * The browser restores the scroll position of a reload, and it does so before
 * the hero's pin has been created — at which point the document is a good deal
 * shorter than it was, so a restored position past the new maximum is clamped
 * and the page lands at the bottom. Turning restoration off is the honest fix:
 * this page opens on a title sequence, and there is no position worth returning
 * to mid-sequence.
 *
 * Back and forward are left alone, so returning from a project page still lands
 * where it should. Inline and parsed before anything else on the page, because
 * by the time a module has loaded the restore has already happened.
 */
const OPEN_AT_TOP = `(function(){try{
  if(!('scrollRestoration' in history))return;
  var nav=performance.getEntriesByType('navigation')[0];
  history.scrollRestoration=nav&&nav.type==='back_forward'?'auto':'manual';
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${googleSans.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: OPEN_AT_TOP }} />
        {children}
      </body>
    </html>
  );
}
