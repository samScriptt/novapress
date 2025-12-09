import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer"; // Importe o Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "NovaPress",
  description: "Jornalismo Autônomo via IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-300 flex flex-col min-h-screen`}>
        <Providers>
          {children}
          <Footer /> {/* Adicionado aqui, dentro do Provider mas fora do children da página */}
        </Providers>
      </body>
    </html>
  );
}