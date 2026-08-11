import type { Metadata } from "next";
import { Anton, Orbitron, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";
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
  title: {
    default: "HACKER BLOC — The bloc where Warsaw builds",
    template: "%s // HACKER BLOC",
  },
  description:
    "A brutalist hacker house in Warsaw. Eastern Bloc roots, Silicon Valley ambition. Weekly meetups, monthly hackathons, free for founders, forever.",
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
