// === НАЧАЛО БЛОКА: Sanity Client ===
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01", // Версия API (можно оставить эту)
  useCdn: false, // Ставим false, чтобы всегда получать свежие данные без кэша (пока мы в разработке)
});
// === КОНЕЦ БЛОКА ===