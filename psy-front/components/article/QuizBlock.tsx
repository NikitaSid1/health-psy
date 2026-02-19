// === НАЧАЛО БЛОКА: Quiz Component ===
"use client";

import { useState } from "react";
import { triggerHaptic } from "@/lib/haptic";

interface Question {
  question: string;
  options: string[];
}

interface QuizProps {
  title?: string;
  questions?: Question[];
}

export default function QuizBlock({ title, questions }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  if (!questions || questions.length === 0) return null;

  const handleOptionClick = (index: number) => {
    // Легкий отклик при выборе варианта
    triggerHaptic('light');
    
    const newSelected = [...selectedOptions, index];
    setSelectedOptions(newSelected);

    if (currentStep < questions.length - 1) {
      // Переход к следующему вопросу через небольшую задержку
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      // Финал теста
      setTimeout(() => {
        setIsFinished(true);
        // ИСПРАВЛЕНО: заменено 'success' на 'heavy' для соответствия типам
        triggerHaptic('heavy'); 
      }, 400);
    }
  };

  if (isFinished) {
    return (
      <div className="my-12 p-8 rounded-[24px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-center animate-in fade-in zoom-in duration-500">
        <span className="text-4xl mb-4 block" aria-hidden="true">✨</span>
        <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Тест завершен!</h4>
        <p className="text-green-700 dark:text-green-300">
          Спасибо за ответы. Саморефлексия — это первый шаг к лучшему пониманию себя.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentStep];

  return (
    <div className="my-12 p-6 sm:p-8 rounded-[24px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
      {title && (
        <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 mb-6 uppercase tracking-widest text-center">
          {title}
        </h3>
      )}

      {/* Прогресс-бар теста */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-3">
          <span>Вопрос {currentStep + 1}</span>
          <span>из {questions.length}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Вопрос */}
      <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-8 text-center leading-tight">
        {currentQ.question}
      </h4>

      {/* Варианты ответов */}
      <div className="flex flex-col gap-3">
        {currentQ.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(i)}
            className="w-full text-left px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-gray-800 dark:text-zinc-200 font-medium active:scale-[0.98]"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
// === КОНЕЦ БЛОКА ===