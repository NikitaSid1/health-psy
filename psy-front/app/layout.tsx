import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import BottomBar from "@/components/ui/BottomBar"; // 👈 Импортируем наше меню

const inter = Inter({ subsets: ["latin", "cyrillic"] });

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
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {children}
          
          {/* 👈 Вставляем меню сюда. Оно появится поверх контента на мобилках */}
          <BottomBar />
          
        </ThemeProvider>
      </body>
    </html>
  );
}