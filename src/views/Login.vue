<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <button @click="login" class="bg-[#1DB954] text-white px-6 py-3 rounded-3xl border-0 cursor-pointer text-sm">
      Login with Spotify
    </button>
  </div>
</template>

<script>
import { SPOTIFY_CONFIG } from '../config/spotify';

export default {
  name: 'Login',
  methods: {
    login() {
      const scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
      window.location.href = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?client_id=${SPOTIFY_CONFIG.CLIENT_ID}&redirect_uri=${SPOTIFY_CONFIG.REDIRECT_URI}&response_type=${SPOTIFY_CONFIG.RESPONSE_TYPE}&scope=${scope}`;
    }
  }
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style> 