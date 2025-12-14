<template>
  <div class="callback">
    <p v-if="!error">Processing login...</p>
    <p v-else class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { SPOTIFY_CONFIG } from '../config/spotify';
import type { RootState } from '../types/store';

const router = useRouter();
const store = useStore<RootState>();
const error = ref<string | null>(null);

const handleCallback = async (): Promise<void> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const authError = urlParams.get('error');

    if (authError) {
      error.value = `Authorization failed: ${authError}`;
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    const savedState = window.localStorage.getItem('auth_state');
    if (state !== savedState) {
      error.value = 'State mismatch. Possible CSRF attack.';
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    if (!code) {
      error.value = 'No authorization code received.';
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    const codeVerifier = window.localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      error.value = 'Code verifier not found. Please try logging in again.';
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
        code_verifier: codeVerifier
      })
    };

    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, payload);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Token exchange failed');
    }

    const data = await response.json();

    store.commit('setTokens', {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    });

    window.localStorage.removeItem('code_verifier');
    window.localStorage.removeItem('auth_state');

    router.push('/playlists');
  } catch (err) {
    console.error('Callback error:', err);
    error.value = (err as Error).message || 'An error occurred during authentication.';
    setTimeout(() => router.push('/'), 3000);
  }
};

onMounted(() => {
  handleCallback();
});
</script>

<style scoped>
.callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.error {
  color: #ff4444;
  font-size: 16px;
}
</style>
