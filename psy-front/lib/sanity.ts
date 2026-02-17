// === НАЧАЛО БЛОКА: Sanity Client Setup ===
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dp2yjc73", // 👈 Жесткая страховка
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-16", 
  useCdn: false, // 👈 СТАВИМ FALSE! Отключаем кэш, чтобы посты появлялись мгновенно
});
// === КОНЕЦ БЛОКА ===