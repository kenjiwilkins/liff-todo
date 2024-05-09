import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LiffProvider } from "./providers/LiffProvider";
import StoreProvider from "./providers/StoreProvider";
import Header from "./components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: {
    template: "%s | LIFF TODO",
    default: "LIFF TODO",
  },
  applicationName: "LIFF TODO",
  description: "A simple TODO app using LIFF.",
  keywords: ["LIFF", "TODO", "Next.js"],
  creator: "Michael Kenji Wilkins",
  authors: [
    {
      name: "Michael Kenji Wilkins",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LIFF TODO",
    title: "LIFF TODO",
    description: "A simple TODO app using LIFF.",
    url: "https://liff-todo-gamma.vercel.app/",
    images: [
      {
        url: "https://kenjiwilkins-public-assets.s3.ap-northeast-1.amazonaws.com/android-chrome-192x192.png",
        width: 192,
        height: 192,
      },
      {
        url: "https://kenjiwilkins-public-assets.s3.ap-northeast-1.amazonaws.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "LIFF TODO",
    description: "A simple TODO app using LIFF.",
    siteId: "984660633751699456",
    creator: "@Kenji_Wilkins",
    creatorId: "984660633751699456",
    images: [
      "https://kenjiwilkins-public-assets.s3.ap-northeast-1.amazonaws.com/android-chrome-512x512.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
      },
      {
        url: "/favicon-32x32.png",
      },
      {
        url: "/android-chrome-192x192.png",
      },
      {
        url: "/android-chrome-512x512.png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export { metadata };

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
