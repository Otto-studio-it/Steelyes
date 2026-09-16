import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CookiebotScript } from '@/components/consent/Cookiebot';
import { organizationSchema } from '@/lib/marketing/schema';

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
    default: 'Steelyes | Bespoke Steel Gates London & UK Fabrication',
    template: '%s | Steelyes',
  },
  description:
    'London steel gate specialists. Steelyes fabricates bespoke driveway gates, electric gates, railings, balconies and security steelwork. Survey-led specification from our Sydenham workshop.',
  keywords: [
    'steel gates london',
    'bespoke steel gates',
    'driveway gates london',
    'electric gates london',
    'automatic gates south london',
    'steel fabrication london',
    'made to measure gates uk',
    'steel gate fabricator sydenham',
  ],
  authors: [{ name: 'Steelyes' }],
  creator: 'Steelyes',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Steelyes',
    title: 'Steelyes | Bespoke Steel Gates London & UK Fabrication',
    description:
      'London steel gate specialists. Bespoke driveway gates, electric gates, railings, balconies and security steelwork. Survey-led fabrication from Sydenham.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steelyes | Bespoke Steel Gates London & UK Fabrication',
    description:
      'London steel gate specialists. Bespoke driveway gates, electric gates, railings, balconies and security steelwork.',
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
      <head>
        {/* Cookiebot: first script in HEAD (required by Cookiebot install guide) */}
        <CookiebotScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body className={`${barlow.variable} ${barlowCondensed.variable} ${ibmPlexMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
