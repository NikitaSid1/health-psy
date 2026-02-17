// === НАЧАЛО БЛОКА: Sanity CLI Config ===
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'dp2yjc73', // 👈 Правильный Project ID
    dataset: 'production'
  },
  deployment: {
    appId: 'njvezevwrat8kpk3ahprsimp', // Оставляем тот, что выдал терминал
  }
})
// === КОНЕЦ БЛОКА ===