// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

export const metadata: Metadata = {
  title: "SeeMe",
  description: "Your personal network of support",
  icons: {
    icon: "/logo.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // important for iOS edge-to-edge
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to video CDN - speeds up initial connection by ~100-300ms */}
        <link rel="preconnect" href="https://egpa9h7lsejcuxfd.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://egpa9h7lsejcuxfd.public.blob.vercel-storage.com" />
        
        {/* Preload hero video for fastest possible start */}
        <link 
          rel="preload" 
          href="https://egpa9h7lsejcuxfd.public.blob.vercel-storage.com/videos/video1.webm" 
          as="video" 
          type="video/webm"
        />

        {/* iOS Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeeMe" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* Optional: keep or remove; not required for the black bar fix */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
