<template>
  <BContainer fluid class="playlist-layout">
    <!-- User Profile Header -->
    <BRow class="bg-secondary p-2 header-row">
      <BCol>
        <div class="user-profile" v-if="userProfile">
          <img :src="userProfile.images?.[0]?.url" alt="Profile" class="profile-image">
          <h2>{{ userProfile.display_name }}</h2>
          <BButton @click="logout">Logout</BButton>
        </div>
      </BCol>
    </BRow>

    <!-- Main Content: Playlists and Player -->
    <BRow class="content-row">
      <!-- Left Side: Playlists -->
      <BCol md="6" lg="7" class="playlists-column">
        <div class="playlists-container">
          <h3 class="section-title">Your Playlists</h3>
          <playlists v-if="userProfile" :userprofile="userProfile"></playlists>
        </div>
      </BCol>

      <!-- Right Side: Web Player -->
      <BCol md="6" lg="5" class="player-column">
        <div class="player-container">
          <h3 class="section-title">Now Playing</h3>
          <web-player></web-player>
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import WebPlayer from '@/components/WebPlayer.vue';
import type { RootState } from '../types/store';

const router = useRouter();
const store = useStore<RootState>();

const userProfile = computed(() => store.state.userProfile);

const logout = (): void => {
  store.dispatch('logout');
  router.push('/');
};

onMounted(async () => {
  await store.dispatch('fetchUserProfile');
});
</script>

<style scoped>
.playlist-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.header-row {
  flex-shrink: 0;
  margin: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.content-row {
  flex: 1;
  margin: 0;
  overflow: hidden;
  min-height: 0;
}

.playlists-column,
.player-column {
  height: 100%;
  overflow: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.playlists-container,
.player-container {
  flex: 1;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1DB954;
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-row {
    flex-direction: column;
  }

  .playlists-column,
  .player-column {
    height: 50vh;
  }
}
</style>
