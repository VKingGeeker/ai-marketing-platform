import { createApp } from 'vue'
import ElementPlus from 'element-plus/es'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import { initAuth } from './composables/useAuth'
import './assets/styles/main.css'

const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化认证状态
initAuth()

app.use(ElementPlus)
app.use(router)
app.mount('#app')
