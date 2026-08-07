import type { Metadata } from "next";
import { Anton, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const tech = Orbitron({
  variable: "--font-tech",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-system",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "HACKER BLOC — Hacker House // Warsaw",
  description:
    "A brutalist hacker house in Warsaw for builders, dreamers, and digital misfits. Live offline. Stay online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${tech.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <div className="crt-vignette" aria-hidden />
        <div className="crt-scanlines" aria-hidden />
      </body>
    </html>
  );
}
