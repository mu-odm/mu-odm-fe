import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import NextAuthProvider from "@/provider/NextAuthProvider";
import QueryClientProvider from "@/provider/QueryClientProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.className}`}>
        <NextAuthProvider>
          <QueryClientProvider>
            <Toaster />
            {children}
          </QueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
