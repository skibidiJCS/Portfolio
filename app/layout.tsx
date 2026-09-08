import type { Metadata } from 'next';
import './globals.css';
import './sections.css';
export const metadata: Metadata = {
  title: 'Jiacai Song',
  description: 'Projects, chess results, and volunteering by Jiacai Song, a student in Montreal.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
