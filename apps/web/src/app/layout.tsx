import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const barlowCondensed = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-barlow-condensed",
  display: "swap",
  weight: "700",
});

const barlow = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-barlow",
  display: "swap",
  weight: "300 700",
});

const ibmPlexMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: "400",
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
