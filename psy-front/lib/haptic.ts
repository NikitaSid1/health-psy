// === НАЧАЛО БЛОКА: Haptic Feedback Utility ===
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  // Проверяем, что код выполняется в браузере и устройство поддерживает вибрацию
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  
  const patterns = {
    light: 50, // Легкий короткий клик
    medium: 100, // Более ощутимый
    heavy: [50, 50, 50], // Тройной для ошибок/предупреждений
  };
  
  navigator.vibrate(patterns[type]);
};
// === КОНЕЦ БЛОКА ===