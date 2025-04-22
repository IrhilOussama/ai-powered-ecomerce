import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'icon',
      url: '/icon-192x192.png',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'So9Lik - Discover Premium Products',
    description: 'Find the best quality products for your everyday life. Shop our exclusive collection today.',
    images: ['https://so9lik.vercel.app/images/so9lik.jpg'],
  },
  openGraph: {
    title: 'So9Lik - Discover Premium Products',
    description: 'Find the best quality products for your everyday life. Shop our exclusive collection today.',
    url: 'https://so9lik.vercel.app',
    siteName: 'SO9LIK',
    images: [
      {
        url: 'https://so9lik.vercel.app/images/so9lik.jpg', // Full URL to your share image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  title: "SO9LIK",
  description: "SO9LIK is your trusted online store in Casablanca, Morocco. Shop trendy and affordable fashion, accessories, and more — order directly via WhatsApp for a fast and easy shopping experience.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}