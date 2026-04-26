import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MBTI+ Personality Test — 32 Types | PSYCH.SITE',
  description: 'Discover your personality type across 5 dimensions. 20 questions, 32 unique types. Archetypes, spirit animals, mythic gods, and the people who share your mind.',
  openGraph: {
    title: 'MBTI+ Personality Test — 32 Types | PSYCH.SITE',
    description: 'Discover your personality type across 5 dimensions. 20 questions, 32 unique types — with archetypes, spirit animals, and mythic gods.',
    url: 'https://psych.site/modules/mbti',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBTI+ Personality Test — 32 Types | PSYCH.SITE',
    description: '5 dimensions. 32 unique types. Zero AI. Pure science.',
  },
};

export default function MbtiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
