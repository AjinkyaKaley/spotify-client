<template>
    <BContainer fluid>
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
    <playlists v-if="userProfile" :userprofile="userProfile"></playlists>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'playlistsLayout',
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');   
    }
  },
  async created() {
    await this.$store.dispatch('fetchUserProfile');
  }
}
</script>
<style scoped>

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

</style>