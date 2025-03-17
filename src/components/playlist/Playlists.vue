<template>
  <BContainer fluid>
    <BRow>
      <BCol>
        <BTable
          :items="playlists"
          :fields="fields">
          <template #cell(name)="data">
            <BLink to="/details"> {{ data.value }} </BLink>
          </template>
        </BTable>
      </BCol>
    </BRow>
  </BContainer>
  <router-view/>
</template>

<script>  
import { BCloseButton, BCol, BContainer, BDropdown, BFormRow, BRow, BTable, BLink } from 'bootstrap-vue-next';
import { mapState } from 'vuex';

export default {
  name: 'playlistsNames',
  props: [
    'userprofile'
  ],
  computed: {
    ...mapState(['playlists'])
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

  }
};
</script>

<style lang="scss">

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