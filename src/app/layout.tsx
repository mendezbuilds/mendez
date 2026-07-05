import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { getChatWidgetCode, getSocialLinks } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Mendez | Web2 & Web3 Developer",
  description: "I am Mendez, a freelance Web2 & Web3 developer based in Lagos, Nigeria. I specialize in building high-fidelity frontends, smart contracts, backend architectures, and token gating solutions.",
  keywords: ["Mendez", "Software Engineer", "Web3 Developer", "Solidity", "Smart Contracts", "Next.js", "React", "Freelance Developer", "Lagos Nigeria", "Frontend", "Backend", "Token Gating"],
  authors: [{ name: "Mendez" }],
  creator: "Mendez",
  openGraph: {
    title: "Mendez | Web2 & Web3 Developer",
    description: "Freelance Web2 & Web3 developer based in Lagos, Nigeria. Building high-fidelity frontends, smart contracts, and scalable backend architectures.",
    url: "https://mendezbuilds.com", // Adjust this to the actual domain when deployed
    siteName: "Mendez Portfolio",
    images: [
      {
        url: "/og-image.jpg", // We will use the same image later or a default
        width: 1200,
        height: 630,
        alt: "Mendez Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mendez | Web2 & Web3 Developer",
    description: "Freelance Web2 & Web3 developer based in Lagos. Specializing in smart contracts and high-fidelity frontends.",
    creator: "@mendezbuilds",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chatWidgetCode = await getChatWidgetCode();
  const socials = await getSocialLinks();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <div className="scanline" />
        <Header socials={socials} />
        <main>{children}</main>
        {chatWidgetCode && (
          <div dangerouslySetInnerHTML={{ __html: chatWidgetCode }} />
        )}
      </body>
    </html>
  );
}
