<template>
  <div class="playlists-wrapper">
    <div class="playlists-scroll-container">
      <BTable
        :items="playlists"
        :fields="fields"
        hover
        :tbody-tr-class="rowClass"
        class="playlists-table">
        <template #cell(name)="data">
          <div class="playlist-cell" @click="playPlaylistHandler(data.item)">
            <img
              v-if="data.item.images && data.item.images[0]"
              :src="data.item.images[0].url"
              alt="Playlist cover"
              class="playlist-image"
            >
            <div class="playlist-info">
              <span class="playlist-name">{{ data.value }}</span>
              <small class="text-muted d-block">{{ data.item.tracks.total }} tracks</small>
            </div>
            <BButton
              v-if="isPlayingPlaylist(data.item.uri)"
              variant="success"
              size="sm"
              class="ms-auto play-indicator"
            >
              <i class="bi bi-soundwave"></i> Playing
            </BButton>
          </div>
        </template>
      </BTable>
    </div>
  </div>
  <router-view/>
</template>

<script>
import { BCloseButton, BCol, BContainer, BDropdown, BFormRow, BRow, BTable, BLink, BButton } from 'bootstrap-vue-next';
import { mapState } from 'vuex';

export default {
  name: 'playlistsNames',
  props: [
    'userprofile'
  ],
  computed: {
    ...mapState(['playlists', 'playerDeviceId', 'selectedPlaylist'])
  },
  mounted(){
    console.log(this.userprofile.id);
    this.$store.dispatch('fetchUserPlaylists', this.userprofile.id );
  },
  data(){
    return{
      fields: ['name']
    }
  },
  methods: {
    async playPlaylistHandler(playlist) {
      if (!this.playerDeviceId) {
        alert('Player is not ready. Please wait for the player to initialize.');
        return;
      }

      try {
        await this.$store.dispatch('playPlaylist', {
          playlistUri: playlist.uri,
          deviceId: this.playerDeviceId
        });
        this.$store.commit('setSelectedPlaylist', playlist);
      } catch (error) {
        console.error('Error playing playlist:', error);
        alert('Failed to play playlist. Make sure Spotify Premium is active.');
      }
    },
    isPlayingPlaylist(playlistUri) {
      return this.selectedPlaylist && this.selectedPlaylist.uri === playlistUri;
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return;
      if (this.isPlayingPlaylist(item.uri)) return 'table-active';
    }
  }
};
</script>

<style lang="scss">
.playlists-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.playlists-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

/* Custom scrollbar */
.playlists-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.playlists-scroll-container::-webkit-scrollbar-track {
  background: #282828;
  border-radius: 4px;
}

.playlists-scroll-container::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;
}

.playlists-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.playlists-table {
  margin-bottom: 0;
}

.playlist-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.playlist-cell:hover {
  background-color: rgba(29, 185, 84, 0.1);
}

.playlist-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.playlist-info {
  flex: 1;
}

.playlist-name {
  font-weight: 500;
  color: #fff;
}

.play-indicator {
  margin-left: auto;
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