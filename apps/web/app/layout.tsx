import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// Turbopack rejects `axes` when `weight` is set to a non-`variable`
// value. Either set weight: "variable" (and lose the explicit list),
// or drop axes — we drop axes since the design tokens only style with
// concrete weights.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ninja-money-verse.app"),
  title: "Ninja Money-verse — The RPG that teaches real money skills.",
  description:
    "A free, open-source pixel-art RPG that teaches money skills. No paywalls. No dark patterns. No casino tricks. Play in a browser — no account needed.",
  openGraph: {
    title: "Ninja Money-verse",
    description: "The RPG that teaches real money skills. Free forever. Open source. No tricks.",
    type: "website",
    siteName: "Ninja Money-verse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ninja Money-verse",
    description: "The RPG that teaches real money skills. Free. Open. No tricks.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)] font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-paper)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-ink)] focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
