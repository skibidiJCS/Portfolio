import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Jiacai Song — Student, Builder & Competitor',
  description: 'Jiacai Song, a student in Montreal. Selected projects, chess achievements, and community involvement.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
