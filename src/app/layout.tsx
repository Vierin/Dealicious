import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const serif = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-literata",
});

export const metadata: Metadata = {
  title: "Dealicious",
  description: "Неделя обедов под акции Biedronka",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
