import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root. Without this, Turbopack walks up looking for a
    // lockfile and finds a stray one in the home directory, which makes it
    // guess the wrong root.
    root: import.meta.dirname,
  },

  // Hide the "N" badge in dev. Compile and runtime errors still show.
  devIndicators: false,

  // The site moved under /v1 when the root became the index of versions.
  // Links made before that carry on to the version they were made in.
  // Temporary, because which version ends up at the root is still open.
  redirects() {
    return [
      { source: "/work/:slug", destination: "/v1/work/:slug", permanent: false },
      { source: "/blog/:slug", destination: "/v1/blog/:slug", permanent: false },
    ];
  },
};

export default nextConfig;
