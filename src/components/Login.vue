<template>
  <BContainer fluid>
    <BRow class="d-flex align-items-center justify-content-center vh-100">
      <BCol class="text-center">
        <BButton @click="login" style ="background-color: #1ED760; cursor: pointer">
          Login with Spotify
        </BButton>
      </BCol>
    </BRow>
  </BContainer>
</template>
<script>
import { BButton, BCol, BContainer, BRow } from 'bootstrap-vue-next';
import { SPOTIFY_CONFIG } from '../config/spotify';

export default {
  name: 'Login',
  methods: {
    login() {
      const scope = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative';
      window.location.href = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?client_id=${SPOTIFY_CONFIG.CLIENT_ID}&redirect_uri=${SPOTIFY_CONFIG.REDIRECT_URI}&response_type=${SPOTIFY_CONFIG.RESPONSE_TYPE}&scope=${scope}`;
    }
  }
};
</script>

<style>
</style>  