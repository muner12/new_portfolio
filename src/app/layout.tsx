import '@/styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import OrbitalNavigation from '@/components/layout/OrbitalNavigation';

// Load fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Note: Using fallback heading font
// In production, you would use:
// const calSans = localFont({
//   src: '../fonts/CalSans-SemiBold.woff2',
//   variable: '--font-calsans',
//   display: 'swap',
// });

export const metadata = {
  title: 'Bakht Munir | Creative Developer & Designer',
  description: 'Portfolio of Bakht Munir, specializing in creative development, UI/UX design, and interactive web experiences.',
  keywords: ['developer', 'designer', 'portfolio', 'frontend', 'react', 'nextjs'],
  authors: [{ name: 'Bakht Munir' }],
  creator: 'Bakht Munir',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://johndoe.com',
    siteName: 'Bakht Munir Portfolio',
    title: 'Bakht Munir | Creative Developer & Designer',
    description: 'Portfolio of Bakht Munir, specializing in creative development, UI/UX design, and interactive web experiences.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'John Doe Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Doe | Creative Developer & Designer',
    description: 'Portfolio of John Doe, specializing in creative development, UI/UX design, and interactive web experiences.',
    images: ['/images/og-image.jpg'],
    creator: '@johndoe',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <OrbitalNavigation />
            <main className="w-full min-h-screen relative">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 