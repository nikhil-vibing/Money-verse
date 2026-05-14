import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@dhaniverse/finance-sim",
    "@dhaniverse/shared",
    "@dhaniverse/ui",
  ],
  typedRoutes: true,
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default config;
