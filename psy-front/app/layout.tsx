// C:\Users\Admin\Desktop\psy\psy-front\app\layout.tsx
// === НАЧАЛО БЛОКА: Root Layout ===
import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import BottomBar from "@/components/ui/BottomBar"; 
import Header from "@/components/ui/Header"; 
import Footer from "@/components/ui/Footer"; 
import { ToastProvider } from "@/components/ui/ToastProvider"; 
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import MarketingAnalytics from "@/components/marketing/Analytics"; 
import NewsletterPopup from "@/components/marketing/NewsletterPopup";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "HealthPsy",
  description: "Know yourself. A scientific approach to psychology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root-body" className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            
            <div id="app-wrapper" className="relative flex min-h-screen flex-col">
              
              <Header />
              
              <div id="main-content" className="flex-1 pt-20 md:pt-28 pb-12">
                {children}
              </div>
              
              <Footer /> 
              <BottomBar />
              
            </div>

            <NewsletterPopup />
            <MarketingAnalytics />
            <VercelAnalytics />

          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
// === КОНЕЦ БЛОКА ===