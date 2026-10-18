import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyQueryClientProvider from "@/providers/my-query-client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TickerTape from "@/components/ticker-tape";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Forum | 股票投資討論區",
  description: "分享市場觀點、交易策略與投資心得的股票討論社群。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="pt-16 flex-1">
          <TickerTape />
          <MyQueryClientProvider>{children}</MyQueryClientProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
