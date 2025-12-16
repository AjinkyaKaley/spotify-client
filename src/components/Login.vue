<template>
  <BContainer fluid>
    <BRow class="d-flex align-items-center justify-content-center vh-100">
      <BCol class="text-center">
        <h1 class="mb-4">Spotify Playlist Viewer</h1>
        <p class="mb-4">View and explore your Spotify playlists</p>
        <BButton @click="login" size="lg" style="background-color: #1ED760; cursor: pointer" class="mb-3">
          Login with Spotify
        </BButton>
        <div>
          <router-link to="/about" class="text-muted">About this app</router-link>
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import { SPOTIFY_CONFIG } from '../config/spotify';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../utils/pkce';

const login = async (): Promise<void> => {
  const scope = 'streaming user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative';

  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  window.localStorage.setItem('code_verifier', codeVerifier);
  window.localStorage.setItem('auth_state', state);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: SPOTIFY_CONFIG.RESPONSE_TYPE,
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    code_challenge_method: SPOTIFY_CONFIG.CODE_CHALLENGE_METHOD,
    code_challenge: codeChallenge,
    state: state,
    scope: scope
  });

  window.location.href = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
};
</script>

<style>
</style>
