import type { Metadata } from "next";
import { Anton, Orbitron, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";
import { SITE } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "HACKER BLOC — The bloc where Warsaw builds",
    template: "%s // HACKER BLOC",
  },
  description:
    "A brutalist hacker house in Warsaw. Eastern Bloc roots, Silicon Valley ambition. Weekly meetups, monthly hackathons, free for founders, forever.",
  openGraph: {
    type: "website",
    siteName: "HACKER BLOC",
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Hacker Bloc — the crowd at a house event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
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
      data-scroll-behavior="smooth"
      className={`${display.variable} ${tech.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
