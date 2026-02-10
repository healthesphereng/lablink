import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import CookieBanner from '@/components/cookie-banner';

export const metadata: Metadata = {
  metadataBase: new URL('https://lablink.vercel.app'), // TODO: Update with actual domain if different
  title: {
    default: 'LabLink - Trusted Medical Lab Tests',
    template: '%s | LabLink',
  },
  description: 'Book accurate & timely medical lab tests online. Partnered with top labs for your health journey. Results interpreted by AI.',
  keywords: ['medical lab', 'blood test', 'health check', 'lab results', 'AI lab analysis', 'Nigeria', 'diagnosis'],
  authors: [{ name: 'LabLink Team' }],
  creator: 'LabLink',
  publisher: 'LabLink',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'LabLink - Trusted Medical Lab Tests',
    description: 'Book accurate & timely medical lab tests online. Results interpreted by AI.',
    url: 'https://lablink.vercel.app',
    siteName: 'LabLink',
    images: [
      {
        url: '/lab-link-logo.png', // Ideally a wider OG image, but logo works for now
        width: 800,
        height: 600,
        alt: 'LabLink Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabLink',
    description: 'Trusted medical lab tests with AI result interpretation.',
    images: ['/lab-link-logo.png'],
  },
  verification: {
    google: 'google-site-verification-code', // Placeholder
    other: {
      'msvalidate.01': 'bing-verification-code', // Placeholder
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/lab-link-logo.png',
    apple: '/lab-link-logo.png',
  },
  themeColor: '#ffffff',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
          <CookieBanner />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
