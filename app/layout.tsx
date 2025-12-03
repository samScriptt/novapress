import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Mudamos para Playfair (Serif)
import "./globals.css";

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
    <html lang="pt-br">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}