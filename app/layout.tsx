import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * ✅ PWA metadata (App Router)
 * - Use `icons` as arrays with sizes
 * - `themeColor` is supported here, but also set it in viewport below for best support
 */
export const metadata: Metadata = {
  title: "Al Qadr Hifz Class",
  description: "Student portal for Hifz progress tracking",
  manifest: "/manifest.json",
  applicationName: "Al Qadr",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Al Qadr",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

/**
 * ✅ Next.js recommends themeColor in viewport export (newer approach)
 */
export const viewport = {
  themeColor: "#9c7c38",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
