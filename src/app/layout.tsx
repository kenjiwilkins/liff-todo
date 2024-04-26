import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LiffProvider } from "./components/LiffProvider";
import StoreProvider from "./StoreProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
            {children}
          </LiffProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
