<template>
  <BContainer class="py-5">
    <BRow>
      <BCol md="8" offset-md="2">
        <h1 class="mb-4">About This App</h1>

        <h2>What is this?</h2>
        <p>
          This is a personal Spotify playlist viewer that uses the official Spotify Web API
          to display your playlists and track information.
        </p>

        <h2>Is this safe?</h2>
        <p>
          Yes! This application:
        </p>
        <ul>
          <li>Uses official Spotify OAuth authentication</li>
          <li>Only requests read-only access to your playlists</li>
          <li>Does not store your Spotify credentials</li>
          <li>Stores tokens securely in your browser only</li>
          <li>Does not share your data with third parties</li>
        </ul>

        <h2>Privacy</h2>
        <p>
          Your Spotify access tokens are stored only in your browser's cookies and are never
          sent to any server except Spotify's official API endpoints. This app does not
          collect, store, or transmit your personal information to any third-party services.
        </p>

        <h2>Authentication Flow</h2>
        <p>
          This app uses OAuth 2.0 with PKCE (Proof Key for Code Exchange), which is the
          industry-standard security protocol recommended by Spotify for browser-based applications.
        </p>

        <p class="mt-4">
          <BButton variant="primary" @click="$router.push('/')">Back to Home</BButton>
        </p>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  color: #1ED760;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

ul {
  margin-left: 1.5rem;
}
</style>
