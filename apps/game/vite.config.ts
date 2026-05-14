import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@dhaniverse/shared": resolve(__dirname, "../../packages/shared/src"),
      "@dhaniverse/finance-sim": resolve(__dirname, "../../packages/finance-sim/src"),
      "@dhaniverse/game-protocol": resolve(__dirname, "../../packages/game-protocol/src"),
      "@dhaniverse/content": resolve(__dirname, "../../packages/content/src"),
    },
  },
  optimizeDeps: {
    include: ["phaser"],
  },
});
