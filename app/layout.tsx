import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export const metadata: Metadata = {
  title: "استوديو ألوان الشعار | الجامعة السعودية الإلكترونية",
  description:
    "شارك في اختيار وتخصيص ألوان الهوية البصرية الرسمية للجامعة السعودية الإلكترونية عبر استوديو تفاعلي ذكي وسهل الاستخدام.",
  keywords: [
    "الجامعة السعودية الإلكترونية",
    "تخصيص الشعار",
    "ألوان الهوية",
    "استوديو الألوان",
    "SEU",
    "Saudi Electronic University",
  ],
  authors: [{ name: "Saudi Electronic University" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "استوديو ألوان الشعار | الجامعة السعودية الإلكترونية",
    description: "شارك في اختيار وتخصيص ألوان الهوية البصرية الرسمية للجامعة",
    type: "website",
    locale: "ar_SA",
  },
};

export const viewport: Viewport = {
  themeColor: "#531B23",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic antialiased bg-slate-50 text-slate-900 selection:bg-brand-800 selection:text-white">
        <AppHeader />
        <main className="flex-1 w-full">{children}</main>
        <AppFooter />
        <BottomNavigation />
      </body>
    </html>
  );
}
