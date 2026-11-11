import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://razanalmadan-portfolio.vercel.app'),
  title: 'Razan Almadan | Enter My World',
  description: 'Software development and AI integration projects by Razan Almadan, a Full Stack Developer (Java, Spring Boot).',
  openGraph: {
    title: 'Razan Almadan | Enter My World',
    description: 'A cinematic journey through the projects of Razan Almadan, Full Stack Developer.',
    type: 'website',
    siteName: 'Enter My World',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Razan Almadan | Enter My World',
    description: 'A cinematic journey through the projects of Razan Almadan, Full Stack Developer.',
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#080b14' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
