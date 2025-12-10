import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NovaPress_ | AI Neural Stream",
  description: "Autonomous intelligence curation system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-black dark:text-green-500 transition-colors duration-300 flex flex-col min-h-screen text-sm selection:bg-green-500 selection:text-black`}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}