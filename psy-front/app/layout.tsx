// === НАЧАЛО БЛОКА: Root Layout ===
import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import BottomBar from "@/components/ui/BottomBar"; 
import Header from "@/components/ui/Header"; 

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Mental Health App",
  description: "Твой проводник в ментальном мире",
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
          
          <div id="app-wrapper" className="relative flex min-h-screen flex-col">
            
            <Header />
            
            {/* Глобальная обертка отступов: защищает от наложения Header и BottomBar */}
            <div id="main-content" className="flex-1 pt-20 md:pt-28 pb-24 md:pb-12">
              {children}
            </div>
            
            <BottomBar />
            
          </div>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
// === КОНЕЦ БЛОКА ===