import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Friendship Dynamics Quiz — Group Chemistry | PSYCH.SITE',
  description: 'Play with 2–5 friends. Everyone answers before the group moves on. Ends with a constellation map and chemistry score. 15 questions, 8 group types.',
  openGraph: {
    title: 'Friendship Dynamics Quiz — Group Chemistry | PSYCH.SITE',
    description: 'Play with 2–5 friends. Ends with a friendship constellation map and chemistry score.',
    url: 'https://psych.site/modules/friendship',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Friendship Dynamics Quiz | PSYCH.SITE',
    description: 'Group personality quiz for 2–5 people. Find your friend group chemistry.',
  },
};

export default function FriendshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
