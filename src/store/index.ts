import { createStore, Store } from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';
import { SPOTIFY_CONFIG } from '../config/spotify';
import type { RootState, UserProfile, Track, Playlist, TrackMetadata } from '../types/store';

export default createStore<RootState>({
  state: {
    token: Cookies.get('spotify_token') || null,
    refreshToken: Cookies.get('spotify_refresh_token') || null,
    tokenExpiry: parseInt(Cookies.get('spotify_token_expiry') || '0') || null,
    userProfile: null,
    topTracks: [],
    recentlyPlayed: [],
    playlists: [],
    selectedTrack: null,
    trackMetadata: null,
    playerDeviceId: null,
    selectedPlaylist: null
  },
  mutations: {
    setToken(state, token: string | null) {
      state.token = token;
      if (token) {
        Cookies.set('spotify_token', token, { expires: 1 });
      } else {
        Cookies.remove('spotify_token');
      }
    },
    setTokens(state, { accessToken, refreshToken, expiresIn }: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }) {
      state.token = accessToken;
      state.refreshToken = refreshToken;

      const expiryTime = Date.now() + (expiresIn * 1000);
      state.tokenExpiry = expiryTime;

      Cookies.set('spotify_token', accessToken, { expires: 1 });
      Cookies.set('spotify_refresh_token', refreshToken, { expires: 365 });
      Cookies.set('spotify_token_expiry', expiryTime.toString(), { expires: 1 });
    },
    setUserProfile(state, profile: UserProfile | null) {
      state.userProfile = profile;
    },
    setTopTracks(state, tracks: Track[]) {
      state.topTracks = tracks;
    },
    setRecentlyPlayed(state, tracks: Track[]) {
      state.recentlyPlayed = tracks;
    },
    setPlaylists(state, playlists: Playlist[]) {
      state.playlists = playlists;
    },
    setSelectedTrack(state, track: Track | null) {
      state.selectedTrack = track;
    },
    setTrackMetadata(state, metadata: TrackMetadata | null) {
      state.trackMetadata = metadata;
    },
    setPlayerDeviceId(state, deviceId: string | null) {
      state.playerDeviceId = deviceId;
    },
    setSelectedPlaylist(state, playlist: Playlist | null) {
      state.selectedPlaylist = playlist;
    }
  },
  actions: {
    logout({ commit }) {
      commit('setToken', null);
      commit('setUserProfile', null);
      commit('setTopTracks', []);
      commit('setRecentlyPlayed', []);
      commit('setPlaylists', []);

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

        commit('setTokens', {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || state.refreshToken,
          expiresIn: data.expires_in
        });

        return data.access_token;
      } catch (error) {
        console.error('Error refreshing token:', error);
        commit('setToken', null);
        throw error;
      }
    },
    async ensureValidToken({ state, dispatch }) {
      const isTokenExpired = state.tokenExpiry && Date.now() >= (state.tokenExpiry - 5 * 60 * 1000);

      if (isTokenExpired && state.refreshToken) {
        await dispatch('refreshAccessToken');
      }
    },
    async fetchUserProfile({ commit, state, dispatch }) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.get<UserProfile>('https://api.spotify.com/v1/me', {
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

        const response = await axios.get<{ items: Track[] }>('https://api.spotify.com/v1/me/top/tracks', {
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
    async fetchTrackMetadata({ commit, state, dispatch }, trackId: string) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.get<TrackMetadata>(`https://api.spotify.com/v1/audio-features/${trackId}`, {
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
    async fetchUserPlaylists({ commit, state, dispatch }, userId: string) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.get<{ items: Playlist[] }>(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setPlaylists', response.data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        throw error;
      }
    },
    async playPlaylist({ state, dispatch }, { playlistUri, deviceId }: { playlistUri: string; deviceId: string }) {
      try {
        await dispatch('ensureValidToken');

        const response = await axios.put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            context_uri: playlistUri
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Error playing playlist:', error);
        throw error;
      }
    }
  }
});

export type { RootState };
