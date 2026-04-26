import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Which Disney Character Are You? | PSYCH.SITE',
  description: 'Ariel, Elsa, Simba, Moana — 24 iconic Disney characters. 15 questions reveal which Disney soul lives inside you, with a full match breakdown for both genders.',
  openGraph: {
    title: 'Which Disney Character Are You? | PSYCH.SITE',
    description: '24 Disney characters. 15 questions. Find your female and male match with percentage breakdowns.',
    url: 'https://psych.site/modules/disney',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Which Disney Character Are You? | PSYCH.SITE',
    description: 'Ariel, Elsa, Simba or Moana? 24 characters, 15 questions.',
  },
};

export default function DisneyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
