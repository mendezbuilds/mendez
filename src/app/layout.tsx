import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Mendez — Portfolio",
  description: "Freelance Web2 & Web3 developer based in Lagos, Nigeria. Specializing in smart contracts, token gating, backend architectures, and high-fidelity frontends.",
  keywords: ["Mendez", "developer", "freelance", "Lagos", "Web3", "Web2", "Solidity", "Next.js", "smart contracts"],
  authors: [{ name: "Mendez" }],
  openGraph: {
    title: "Mendez — Portfolio",
    description: "Freelance Web2 & Web3 developer based in Lagos, Nigeria.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <div className="scanline" />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
