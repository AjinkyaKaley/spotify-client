<template>
  <div>
    <BContainer fluid class="m-2">
      <BRow class="bg-secondary p-2">
        <BCol>
          <div class="user-profile" v-if="userProfile">
            <img :src="userProfile.images[0]?.url" alt="Profile" class="profile-image">
            <h2>{{ userProfile.display_name }}</h2>
            <BButton @click="logout">Logout</BButton>
          </div>
        </BCol>
      </BRow>
    </BContainer>

    <BContainer fluid class="m-2">
      <BRow class="p-2">
        <BCol>
          <span></span>
          <BDropdown text="Filter">
            <BDropdownItem @click="displayTopTracks()">Top Tracks</BDropdownItem>
            <BDropdownItem @click="displayPlaylist(userProfile)">Playlist</BDropdownItem>
          </BDropdown>
        </BCol>
      </BRow>
    </BContainer>

    <BContainer fluid class="m-2">
      <BRow class="p-2" v-if="showTopTracks">
        <div class="tracks-grid">
          <BCol v-for="track in topTracks">
            <div  
              :key="track.id" 
              class="track-card">
              <img :src="track.album.images[0].url" :alt="track.name">
              <div class="track-info">
                <h4>{{ track.name }}</h4>
                <p>{{ track.artists[0].name }}</p>
              </div>
            </div>
          </BCol>
        </div>
      </BRow>

      <BRow class="p-2" v-if="showPlaylist">
        <BCol>
          <div class="tracks-grid">
          <BCol v-for="playlist in playlists">
            <div  
              :key="playlist.id" 
              class="track-card">
              <img :src="playlist.images[0].url" :alt="playlist.name">
              <div class="track-info">
                <h4>{{ playlist.name }}</h4>
              </div>
            </div>
          </BCol>
        </div>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>  
import { BCol, BContainer, BRow } from 'bootstrap-vue-next';
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapState(['userProfile', 'topTracks', 'selectedTrack', 'trackMetadata', 'playlists'])
  },
  data(){
    return{
      sidebarCollapsed: false,
      showTopTracks: false,
      showPlaylist: false,
      componentTypes: [
        { name: 'Text Block', icon: 'bi-file-text', description: 'Add a block of text content' }
      ]
    }
  },
  methods: {
    toggleSidebar(){
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');   
    },
    async displayTopTracks(){
      await this.$store.dispatch('fetchTopTracks');
      this.showTopTracks = true;
      this.showPlaylist = false;
    },
    async displayPlaylist(userProfile){
      await this.$store.dispatch('fetchUserPlaylists', userProfile.id);
      this.showPlaylist = true;
      this.showTopTracks = false;
    },
    async showTrackDetails(track) {
      this.$store.commit('setSelectedTrack', track);
      await this.$store.dispatch('fetchTrackMetadata', track.id);
    },
    closeModal() {
      this.$store.commit('setSelectedTrack', null);
      this.$store.commit('setTrackMetadata', null);
    }
  },
  async created() {
    await this.$store.dispatch('fetchUserProfile');
    this.showTopTracks = true;
  }
};
</script>

<style lang="scss">

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

.logout-button {
  background-color: #282828;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 15px;
}

.logout-button:hover {
  background-color: #383838;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #282828;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
}

.track-details {
  text-align: center;
}

.track-details img {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.features-grid {
  display: grid;
  gap: 15px;
  margin: 20px 0;
}

.feature {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  background: #404040;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  background: #1DB954;
  height: 100%;
  transition: width 0.3s ease;
}

.track-metadata {
  text-align: left;
  padding: 20px;
  background: #333;
  border-radius: 8px;
  margin-top: 20px;
}
</style> 