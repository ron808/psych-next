import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import CursorStar from '@/components/CursorStar';

const playfair = Playfair_Display({
  variable: '--font-head-var',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body-var',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  variable: '--font-mono-var',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://psych-site.rohitnaidusiriporam.com'),
  title: {
    default: 'PSYCH.SITE — Know Yourself',
    template: '%s | PSYCH.SITE',
  },
  description:
    'Five science-backed personality tests — MBTI+, Love Style, Friendship Dynamics, Career Identity, and Disney Character. Zero AI. Results stay on your device.',
  keywords: [
    'personality test',
    'MBTI',
    'love language quiz',
    'friendship quiz',
    'career personality',
    'Disney character quiz',
    'personality science',
    'psychology quiz',
  ],
  authors: [{ name: 'PSYCH.SITE' }],
  creator: 'PSYCH.SITE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://psych-site.rohitnaidusiriporam.com',
    siteName: 'PSYCH.SITE',
    title: 'PSYCH.SITE — Know Yourself',
    description:
      'Five science-backed personality tests. Mind, love, friendship, career, and your inner Disney character. Zero AI. Pure science.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSYCH.SITE — Know Yourself',
    description: 'Five personality tests. Zero AI. Results stay on your device.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body>
        <CursorStar />
        {children}
      </body>
    </html>
  );
}
