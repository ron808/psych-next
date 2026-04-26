import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Love Style Quiz — Find Your Romantic Type | PSYCH.SITE',
  description: 'Take solo or with a partner. Questions interleave in real time — ends with a full compatibility report. 15 questions, 8 romantic styles.',
  openGraph: {
    title: 'Love Style Quiz — Find Your Romantic Type | PSYCH.SITE',
    description: 'Solo or paired. Real-time interleaving questions. Full compatibility report at the end. 15 questions, 8 romantic styles.',
    url: 'https://psych.site/modules/love',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love Style Quiz | PSYCH.SITE',
    description: 'Discover your romantic type. Take it solo or with a partner.',
  },
};

export default function LoveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
