'use client'

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"
import Scaffold from "./Scaffold";
import {
  // HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "OpenFeed",
//   description: "The open source link aggregator",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en" suppressHydrationWarning className="overscroll-none h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-none h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <Scaffold>
              {children}
            </Scaffold>
          </QueryClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
