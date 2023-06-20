import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `Logo Battle`,
  description: `Which S&P 500 company has the best logo?`,
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
