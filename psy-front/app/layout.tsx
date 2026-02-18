// === НАЧАЛО БЛОКА: Root Layout ===
import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import BottomBar from "@/components/ui/BottomBar"; 
import Header from "@/components/ui/Header"; 
// Импортируем провайдер уведомлений (не забудь создать сам файл!)
import { ToastProvider } from "@/components/ui/ToastProvider"; 

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
  description: "Твой проводник в ментальном мире",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body id="root-body" className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Оборачиваем всё приложение в ToastProvider для работы уведомлений */}
          <ToastProvider>
            
            <div id="app-wrapper" className="relative flex min-h-screen flex-col">
              
              <Header />
              
              {/* Глобальная обертка отступов: защищает от наложения Header и BottomBar */}
              <div id="main-content" className="flex-1 pt-20 md:pt-28 pb-24 md:pb-12">
                {children}
              </div>
              
              <BottomBar />
              
            </div>

          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
// === КОНЕЦ БЛОКА ===