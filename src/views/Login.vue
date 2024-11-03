<template>
  <div class="login">
    <h1>Spotify Dashboard</h1>
    <button @click="login" class="login-button">
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

.login-button {
  background-color: #1DB954;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}
</style> 