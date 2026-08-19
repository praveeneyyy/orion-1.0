import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://orion.sathyabama.ac.in'),
  title: 'ORION 1.0 — 24H National Hackathon | Sathyabama Institute of Science and Technology',
  description: 'ORION 1.0 is a premier 24-hour offline hackathon mission organized by Microsoft Club SIST at Sathyabama Institute of Science and Technology, Chennai. ₹1,00,000 Prize Pool.',
  keywords: [
    'ORION 1.0',
    'Microsoft Club SIST',
    'Sathyabama Institute of Science and Technology',
    'Hackathon Chennai',
    'FloatChat',
    'LexVault',
    'SylvaSense',
    'Top 70 Hackathon'
  ],
  authors: [{ name: 'Microsoft Club SIST' }],
  creator: 'Microsoft Club SIST',
  publisher: 'Sathyabama Institute of Science and Technology',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'ORION 1.0 — IGNITE THE GENESIS OF INNOVATION',
    description: '24-Hour Offline Hackathon at Sathyabama Institute of Science and Technology, Chennai. Organized by Microsoft Club SIST. ₹1,00,000 Prize Pool.',
    url: 'https://orion.sathyabama.ac.in',
    siteName: 'ORION 1.0 Hackathon',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'ORION 1.0 Official Logo - Microsoft Club SIST',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORION 1.0 — BUILD BEYOND THE STARS',
    description: '24-Hour Offline Hackathon at Sathyabama Institute of Science and Technology, Chennai. Organized by Microsoft Club SIST.',
  },
};

export const viewport: Viewport = {
  themeColor: '#05070D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#05070D] text-slate-100 antialiased selection:bg-cyan-500/25 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
