// next.config.ts
import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
} as unknown as NextConfig;

export default nextConfig;