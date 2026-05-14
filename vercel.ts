import { type VercelConfig, routes } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "pnpm turbo run build --filter=@money-verse/web",
  installCommand: "pnpm install --frozen-lockfile",
  outputDirectory: "apps/web/.next",
  rewrites: [
    routes.rewrite("/realtime/(.*)", `${process.env.COLYSEUS_URL ?? ""}/$1`),
  ],
  headers: [
    routes.cacheControl("/play/(.*)", {
      public: true,
      maxAge: "1 hour",
      immutable: false,
    }),
    routes.cacheControl("/atlases/(.*)", {
      public: true,
      maxAge: "1 year",
      immutable: true,
    }),
    routes.cacheControl("/maps/(.*)", {
      public: true,
      maxAge: "1 month",
      immutable: false,
    }),
  ],
  crons: [
    {
      path: "/api/jobs/daily-streak-tick",
      schedule: "30 18 * * *",
    },
    {
      path: "/api/jobs/market-day-open",
      schedule: "30 3 * * 1-5",
    },
  ],
};

export default config;
