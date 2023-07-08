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
      {/* This combination of flexes + h-screen and the internal div flex-grow allows the page
      contents to grow to the height of the viewport, and the footer will be pushed to the bottom. */}
      <body className={inter.className + ' flex flex-col h-screen bg-zinc-50'}>
        <Navbar />
        <div className={'flex-grow'}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
