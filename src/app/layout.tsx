import './globals.css';
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

// Dynamically import Providers so it is only used on the client
const Providers = dynamic(
  () => import('@/components/providers/Providers').then(mod => mod.Providers),
  { ssr: false }
);

export const metadata = {
  title: 'Global Remit Teller',
  description: 'A teller and compliance platform',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        url: '/app-logo.png',
        sizes: '48x48',
      },
    ],
  },
  themeColor: '#007AFF',
  manifest: {
    name: 'Global Remit Teller',
    short_name: 'Global Remit',
    description: 'A teller and compliance platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#007AFF',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
