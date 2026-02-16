// === НАЧАЛО БЛОКА: Next Config ===
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Разрешаем картинки из Sanity
      },
    ],
  },
};

export default nextConfig;
// === КОНЕЦ БЛОКА ===