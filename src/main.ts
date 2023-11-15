import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import router from './utils/router'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'element-plus/dist/index.css'

const pinia = createPinia().use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')
