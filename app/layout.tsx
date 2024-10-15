import { NextUIProvider } from "@nextui-org/react";
import type { Metadata } from "next";
import localFont from "next/font/local";

import Header from "@/components/Header";

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

export const metadata: Metadata = {
  title: "Crown Data",
  description:
    "A Platform for Robot Data Collection, Visualization, and Sharing",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
        <main className="dark text-foreground bg-background">
          <Header />
          {children}
          </main>
        </NextUIProvider>
      </body>
    </html>
  );
}
