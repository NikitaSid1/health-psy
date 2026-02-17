import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'dp2yjc73', // Твой реальный ID
    dataset: 'production'
  },
  // Сохраняем настройки деплоя для быстрого обновления в будущем
  deployment: {
    appId: 'njvezevwrat8kpk3ahprsimp',
  }
})
// === КОНЕЦ БЛОКА ===