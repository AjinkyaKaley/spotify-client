<template>
  <div class="dashboard">
    <header class="header">
      <div class="user-profile" v-if="userProfile">
        <img :src="userProfile.images[0]?.url" alt="Profile" class="profile-image">
        <h2>{{ userProfile.display_name }}</h2>
      </div>
    </header>

    <div class="dashboard-content">
      <div class="section">
        <h3>Top Tracks</h3>
        <div class="tracks-grid">
          <div v-for="track in topTracks" :key="track.id" class="track-card">
            <img :src="track.album.images[0].url" :alt="track.name">
            <div class="track-info">
              <h4>{{ track.name }}</h4>
              <p>{{ track.artists[0].name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapState(['userProfile', 'topTracks'])
  },
  async created() {
    await this.$store.dispatch('fetchUserProfile');
    await this.$store.dispatch('fetchTopTracks');
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.header {
  margin-bottom: 30px;
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

.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.track-card {
  background: #282828;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.2s;
}

.track-card:hover {
  transform: scale(1.05);
}

.track-card img {
  width: 100%;
  border-radius: 4px;
}

.track-info {
  padding: 10px;
}

.track-info h4 {
  margin: 0;
  color: white;
}

.track-info p {
  margin: 5px 0 0;
  color: #b3b3b3;
}
</style> 