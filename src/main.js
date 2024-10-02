import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(ElementPlus)
app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
})

app.mount('#app')