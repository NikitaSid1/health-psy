// === НАЧАЛО БЛОКА: Embedded Studio Page ===
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config"; // Путь до нашего конфига в корне

export default function StudioPage() {
  return (
    // Оборачиваем студию, чтобы она занимала весь экран и не ломала верстку сайта
    <div className="h-screen max-h-[100dvh] overflow-hidden">
      <NextStudio config={config} />
    </div>
  );
}
// === КОНЕЦ БЛОКА ===