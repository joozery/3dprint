import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PDM 3D Print Thailand | แพลตฟอร์มสั่งพิมพ์ 3 มิติครบวงจร",
  description: "บริการพิมพ์ 3 มิติระดับอุตสาหกรรม รวดเร็ว แม่นยำ และเป็นมืออาชีพที่สุดในไทย",
  icons: {
    icon: "/logo/browser.jpg",
    apple: "/logo/browser.jpg",
  },
};

import { CookieConsent } from "@/components/layout/CookieConsent";
import EmailCheckModal from "@/components/auth/EmailCheckModal";
import TawkChat from "@/components/home/TawkChat";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

import { RouteChangePointerEventsFix } from "@/components/layout/RouteChangePointerEventsFix";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${sarabun.variable} font-sans antialiased`} suppressHydrationWarning>
        <RouteChangePointerEventsFix />
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              {children}
              <EmailCheckModal />
              <Toaster richColors position="top-right" />
              <CookieConsent />
              <TawkChat />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
