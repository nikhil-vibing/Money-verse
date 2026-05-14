import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@money-verse/finance-sim",
    "@money-verse/shared",
    "@money-verse/ui",
  ],
  typedRoutes: true,
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default config;
