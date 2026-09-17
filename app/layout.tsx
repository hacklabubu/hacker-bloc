import type { Metadata } from "next";
import { Anton, Orbitron, JetBrains_Mono, Kode_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const tech = Orbitron({
  variable: "--font-tech",
  subsets: ["latin"],
  /* Only the countdown uses it — below the fold, not worth a preload
     competing with the LCP image. */
  preload: false,
});

const mono = JetBrains_Mono({
  variable: "--font-mono-system",
  subsets: ["latin", "cyrillic"],
});

const terminal = Kode_Mono({
  variable: "--font-terminal-system",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "HACKER BLOC — The bloc where Warsaw builds",
    template: "%s // HACKER BLOC",
  },
  description:
    "A hackerspace in Warsaw for people who build. Become a member and help shape the space.",
  openGraph: {
    type: "website",
    siteName: "HACKER BLOC",
    url: "/",
    images: [
      {
        url: "/hacker-bloc-og.png",
        width: 1731,
        height: 909,
        alt: "Hacker Bloc — Warsaw startup community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/hacker-bloc-og.png", alt: "Hacker Bloc — Warsaw startup community" }],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${tech.variable} ${mono.variable} ${terminal.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
