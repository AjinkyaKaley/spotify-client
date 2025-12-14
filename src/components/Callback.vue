<template>
  <div class="callback">
    <p v-if="!error">Processing login...</p>
    <p v-else class="error">{{ error }}</p>
  </div>
</template>

<script>
import { SPOTIFY_CONFIG } from '../config/spotify';

export default {
  name: 'Callback',
  data() {
    return {
      error: null
    };
  },
  async created() {
    await this.handleCallback();
  },
  methods: {
    async handleCallback() {
      try {
        // Extract code and state from query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        // Handle authorization error
        if (error) {
          this.error = `Authorization failed: ${error}`;
          setTimeout(() => this.$router.push('/'), 3000);
          return;
        }

        // Verify state to prevent CSRF attacks
        const savedState = window.localStorage.getItem('auth_state');
        if (state !== savedState) {
          this.error = 'State mismatch. Possible CSRF attack.';
          setTimeout(() => this.$router.push('/'), 3000);
          return;
        }

        if (!code) {
          this.error = 'No authorization code received.';
          setTimeout(() => this.$router.push('/'), 3000);
          return;
        }

        // Retrieve code verifier from localStorage
        const codeVerifier = window.localStorage.getItem('code_verifier');
        if (!codeVerifier) {
          this.error = 'Code verifier not found. Please try logging in again.';
          setTimeout(() => this.$router.push('/'), 3000);
          return;
        }

        // Exchange authorization code for access token
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

        // Store tokens in Vuex store
        this.$store.commit('setTokens', {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in
        });

        // Clean up localStorage
        window.localStorage.removeItem('code_verifier');
        window.localStorage.removeItem('auth_state');

        // Redirect to playlists page
        this.$router.push('/playlists');
      } catch (err) {
        console.error('Callback error:', err);
        this.error = err.message || 'An error occurred during authentication.';
        setTimeout(() => this.$router.push('/'), 3000);
      }
    }
  }
};
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