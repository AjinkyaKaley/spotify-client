import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: null,
    userProfile: null,
    topTracks: [],
    recentlyPlayed: [],
    playlists: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserProfile(state, profile) {
      state.userProfile = profile;
    },
    setTopTracks(state, tracks) {
      state.topTracks = tracks;
    },
    setRecentlyPlayed(state, tracks) {
      state.recentlyPlayed = tracks;
    },
    setPlaylists(state, playlists) {
      state.playlists = playlists;
    }
  },
  actions: {
    async fetchUserProfile({ commit, state }) {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setUserProfile', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    async fetchTopTracks({ commit, state }) {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setTopTracks', response.data.items);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      }
    }
  }
}); 