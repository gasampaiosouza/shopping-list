import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ListContextProvider } from '@/contexts/ListContext';

import { ModeToggle, ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Soso - Your shopping list',
  description: 'Generate your unique shopping list, completely yours.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ListContextProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}

            <ModeToggle />
          </ThemeProvider>
        </body>
      </ListContextProvider>
    </html>
  );
}
