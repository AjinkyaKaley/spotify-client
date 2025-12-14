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
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../utils/pkce';

export default {
  name: 'Login',
  methods: {
    async login() {
      const scope = 'streaming user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative';

      // Generate PKCE code verifier and challenge
      const codeVerifier = generateCodeVerifier(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      // Store code verifier and state in localStorage for use in callback
      window.localStorage.setItem('code_verifier', codeVerifier);
      window.localStorage.setItem('auth_state', state);

      // Build authorization URL with PKCE parameters
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
    }
  }
};
</script>

<style>
</style>  