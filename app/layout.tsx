import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CalculatorProvider } from '@/context/CalculatorContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Local Agency Growth Calculator',
  description: 'See how many new local clients you can realistically add each month with our outbound system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CalculatorProvider>
          {children}
        </CalculatorProvider>
      </body>
    </html>
  );
}

