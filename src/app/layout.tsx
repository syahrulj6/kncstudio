import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { cn, constructMetadata } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from 'sonner';
import Footer from '@/components/Footer';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '500', '700', '600'] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scrollbar   scrollbar-thumb-zinc-500 scrollbar-track-zinc-700">
      <body className={cn('relative h-full font-sans antialiased bg-dark', poppins.className)}>
        <main className="relative flex flex-col min-h-screen">
          <Providers>
            <Navbar />
            <div className="flex-grow flex-1">{children}</div>
          </Providers>
          <Footer />
        </main>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
