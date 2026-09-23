import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root. Without this, Turbopack walks up looking for a
    // lockfile and finds a stray one in the home directory, which makes it
    // guess the wrong root.
    root: import.meta.dirname,
  },
};

export default nextConfig;
