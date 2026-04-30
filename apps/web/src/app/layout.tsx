import type { Metadata } from "next";
import { Barlow_Condensed, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

const barlow = Barlow({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Steelyes | The Architectural Forge",
  description: "Bespoke steel gates engineered for reliability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${barlow.variable} ${barlowCondensed.variable} ${ibmPlexMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
