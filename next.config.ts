import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Un pnpm-lock.yaml parasite dans le home fait sinon deviner la mauvaise racine.
    root: __dirname,
  },
};

export default nextConfig;
