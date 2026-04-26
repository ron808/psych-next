import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Personality Test — Your Work Identity | PSYCH.SITE',
  description: 'Discover your career archetype with a year-by-year growth roadmap, ideal company type, and the traps to avoid. 15 questions, 8 career types.',
  openGraph: {
    title: 'Career Personality Test — Your Work Identity | PSYCH.SITE',
    description: 'Find your career archetype. Includes a growth roadmap, ideal company type, and traps to avoid.',
    url: 'https://psych.site/modules/career',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Personality Test | PSYCH.SITE',
    description: 'Your work identity. Year-by-year growth roadmap included.',
  },
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
