import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import wb from './registerServiceWorker'

const Vue = createApp(App).use(router).mount('#app')
Vue.prototype.$workbox = wb;
