import { createRouter, createWebHistory } from 'vue-router';
import PlaylistLayout  from '@/views/PlaylistLayout.vue';
import Details from '@/components/playlist/Details.vue';
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
    path: '/playlists',
    name: 'playlists',
    component: PlaylistLayout,
  },
  {
    path: '/details',
    name: 'details',
    component: Details
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