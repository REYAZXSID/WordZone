
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { OfflineModal } from '@/components/offline-modal';

export const metadata: Metadata = {
  title: 'WordZone',
  description: 'Sharpen your mind with daily cryptographic challenges on WordZone.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'neon', 'pink-blossom', 'classic-mystery', 'hacker-green', 'playful-light', 'zen-minimal', 'retro-arcade']}
        >
          {children}
          <Toaster />
          <OfflineModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
