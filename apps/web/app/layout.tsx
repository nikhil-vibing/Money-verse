import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Hind } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const hind = Hind({
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Money-verse — Money, as an adventure",
  description:
    "A free, hand-painted 2D RPG that teaches Indian financial literacy — without ever pretending speculation is a game.",
  openGraph: {
    title: "Money-verse",
    description:
      "Money, as an adventure. Set in an India you'll recognise. Free forever, open-source.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0612",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${hind.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
