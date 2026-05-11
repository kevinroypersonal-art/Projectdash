import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Hedge — Inside the doors of a personal hedge",
  description:
    "Real-time track record of a personal portfolio run with conviction. All positions public. In-depth analysis for members.",
  metadataBase: new URL("https://thehedge.example"),
  openGraph: {
    title: "The Hedge — Inside the doors of a personal hedge",
    description:
      "A personal portfolio. Run with conviction. Documented in public.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      style={
        {
          "--font-sans": "var(--font-inter-tight)",
          "--font-mono": "var(--font-jetbrains-mono)",
          "--font-display": "var(--font-inter-tight)",
        } as React.CSSProperties
      }
    >
      <body className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
        {children}
      </body>
    </html>
  );
}
