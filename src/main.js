import { createApp } from 'vue'
import {createBootstrap} from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(createBootstrap)
app.mount('#app') 