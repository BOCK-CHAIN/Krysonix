import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turn off linting for the entire project
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
