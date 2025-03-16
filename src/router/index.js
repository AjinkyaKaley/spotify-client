import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/components/Dashboard.vue';
import Login from '@/components/Login.vue';
import Callback from '@/components/Callback.vue';
import Cookies from 'js-cookie';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('spotify_token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/');
  } else {
    next();
  }
});

export default router; 