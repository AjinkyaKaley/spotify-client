import { createApp } from 'vue';
import { createBootstrap } from 'bootstrap-vue-next';
import App from './App.vue';
import router from './router';
import store from './store';
import { setupAxiosInterceptor } from './utils/axios-interceptor';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

setupAxiosInterceptor(store);

const app = createApp(App);
app.use(router);
app.use(store);
document.documentElement.setAttribute('data-bs-theme', 'dark');
app.use(createBootstrap);
app.mount('#app');
