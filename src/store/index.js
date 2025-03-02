import { createStore } from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';

export default createStore({
  state: {
    token: Cookies.get('spotify_token') || null,
    userProfile: null,
    topTracks: [],
    recentlyPlayed: [],
    playlists: [],
    selectedTrack: null,
    trackMetadata: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) {
        Cookies.set('spotify_token', token, { expires: 1 }); // expires in 1 day
      } else {
        Cookies.remove('spotify_token');
      }
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
    },
    setSelectedTrack(state, track) {
      state.selectedTrack = track;
    },
    setTrackMetadata(state, metadata) {
      state.trackMetadata = metadata;
    }
  },
  actions: {
    logout({ commit }) {
      commit('setToken', null);
      commit('setUserProfile', null);
      commit('setTopTracks', []);
      commit('setRecentlyPlayed', []);
      commit('setPlaylists', []);
    },
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
    },
    async fetchTrackMetadata({ commit, state }, trackId) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setTrackMetadata', response.data);
      } catch (error) {
        console.error('Error fetching track metadata:', error);
      }
    },
    async fetchUserPlaylists({commit, state}, userId){
      try{
        const response = await axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`,{
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setPlaylists', response.data.items);
      }
      catch(error){
        console.error('Error fetching track metadata:', error);
      }
    }
  }
}); 