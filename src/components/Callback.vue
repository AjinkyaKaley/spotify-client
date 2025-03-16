<template>
  <div class="callback">
    <p>Processing login...</p>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'Callback',
  created() {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    if (hash.access_token) {
      this.$store.commit('setToken', hash.access_token);
      // Clear the hash from URL
      window.location.hash = '';
      this.$router.push('/playlists');
    } else {
      // Handle error case
      this.$router.push('/');
    }
  }
};
</script> 