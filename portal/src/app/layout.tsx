import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kubernetes தமிழ் ஆவணம் | Tamil Docs',
  description: 'Kubernetes documentation translated into Tamil - குபெர்னெட்டீஸ் ஆவணம் தமிழில்',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <body>{children}</body>
    </html>
  );
}
