import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Library & Information Center | COMSATS University Islamabad",
    template: "%s | JZ Library — COMSATS",
  },
  description:
    "Access digital resources, HEC digital library, research journals, e-books, catalog (OPAC), and academic support services at COMSATS University Islamabad Library.",
  keywords: [
    "COMSATS library",
    "CUI library portal",
    "HEC digital library COMSATS",
    "online catalog OPAC CUI",
    "academic journals Islamabad",
    "research resources COMSATS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
