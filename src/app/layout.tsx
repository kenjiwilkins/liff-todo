"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LiffProvider } from "./components/LiffProvider";
import StoreProvider from "./StoreProvider";
import Header from "./components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "LIFF TODO",
  description: "A simple TODO app using LIFF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID || ""}>
            <Header />
            {children}
          </LiffProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
