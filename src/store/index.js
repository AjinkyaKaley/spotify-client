import { createStore } from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';
import { SPOTIFY_CONFIG } from '../config/spotify';

export default createStore({
  state: {
    token: Cookies.get('spotify_token') || null,
    refreshToken: Cookies.get('spotify_refresh_token') || null,
    tokenExpiry: parseInt(Cookies.get('spotify_token_expiry')) || null,
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
    setTokens(state, { accessToken, refreshToken, expiresIn }) {
      state.token = accessToken;
      state.refreshToken = refreshToken;

      // Calculate token expiry time (current time + expires_in seconds)
      const expiryTime = Date.now() + (expiresIn * 1000);
      state.tokenExpiry = expiryTime;

      // Store in cookies
      Cookies.set('spotify_token', accessToken, { expires: 1 });
      Cookies.set('spotify_refresh_token', refreshToken, { expires: 365 }); // refresh token valid for longer
      Cookies.set('spotify_token_expiry', expiryTime.toString(), { expires: 1 });
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

      // Clear refresh token and expiry
      Cookies.remove('spotify_refresh_token');
      Cookies.remove('spotify_token_expiry');
    },
    async refreshAccessToken({ state, commit }) {
      if (!state.refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const payload = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: SPOTIFY_CONFIG.CLIENT_ID,
            grant_type: 'refresh_token',
            refresh_token: state.refreshToken
          })
        };

        const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, payload);

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();

        // Update tokens (refresh token may or may not be included in response)
        commit('setTokens', {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || state.refreshToken,
          expiresIn: data.expires_in
        });

        return data.access_token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        // If refresh fails, logout the user
        commit('setToken', null);
        throw error;
      }
    },
    async ensureValidToken({ state, dispatch }) {
      // Check if token is expired or about to expire (within 5 minutes)
      const isTokenExpired = state.tokenExpiry && Date.now() >= (state.tokenExpiry - 5 * 60 * 1000);

      if (isTokenExpired && state.refreshToken) {
        await dispatch('refreshAccessToken');
      }
    },
    async fetchUserProfile({ commit, state, dispatch }) {
      try {
        // Ensure we have a valid token before making the request
        await dispatch('ensureValidToken');

        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setUserProfile', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    async fetchTopTracks({ commit, state, dispatch }) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setTopTracks', response.data.items);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        throw error;
      }
    },
    async fetchTrackMetadata({ commit, state, dispatch }, trackId) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setTrackMetadata', response.data);
      } catch (error) {
        console.error('Error fetching track metadata:', error);
        throw error;
      }
    },
    async fetchUserPlaylists({ commit, state, dispatch }, userId) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setPlaylists', response.data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        throw error;
      }
    }
  }
}); 