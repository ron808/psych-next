import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Type Gallery — Browse All 64 Types | PSYCH.SITE',
  description: 'Browse all 64 personality types across MBTI+, Love, Friendship, Career, and Disney modules. Click any type for the full breakdown.',
  openGraph: {
    title: 'Type Gallery — Browse All 64 Types | PSYCH.SITE',
    description: 'All 64 personality types from 5 modules in one gallery. Filter, explore, and dive into any type.',
    url: 'https://psych.site/types',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Type Gallery | PSYCH.SITE',
    description: '64 types across 5 modules. Explore them all.',
  },
};

export default function TypesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
