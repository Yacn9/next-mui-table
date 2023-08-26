import ReactQueryProvider from '@/libs/ReactQueryProvider';
import ThemeRegistry from '@/libs/theme/ThemeRegistry';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SetFlow Project',
  description: 'a test project using MUI Axios TanStack Query-Table',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <ThemeRegistry>
          <body>{children}</body>
        </ThemeRegistry>
      </html>
    </ReactQueryProvider>
  );
}
