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
  metadataBase: new URL('https://www.steelyes.co.uk'),
  title: {
    default: 'Steelyes | Bespoke Steel Gates & Fabrication UK',
    template: '%s | Steelyes',
  },
  description:
    'Steelyes fabricates bespoke steel driveway gates, electric gates, railings, balconies and security doors across the UK. Survey-led specification, supply and install.',
  keywords: [
    'bespoke steel gates',
    'driveway gates',
    'electric gates uk',
    'automatic gates',
    'steel fabrication uk',
    'made to measure gates',
  ],
  authors: [{ name: 'Steelyes' }],
  creator: 'Steelyes',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Steelyes',
    title: 'Steelyes | Bespoke Steel Gates & Fabrication UK',
    description:
      'Steelyes fabricates bespoke steel driveway gates, electric gates, railings, balconies and security doors across the UK. Survey-led specification, supply and install.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steelyes | Bespoke Steel Gates & Fabrication UK',
    description:
      'Steelyes fabricates bespoke steel driveway gates, electric gates, railings, balconies and security doors across the UK.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
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
