import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { TabBar } from "@/components/tab-bar";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
});

const serif = Literata({
  subsets: ["latin", "latin-ext"],
  variable: "--font-literata",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: "Dealicious",
    description: t("description"),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full">
        <NextIntlClientProvider>
          {children}
          <TabBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
