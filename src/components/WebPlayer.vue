<template>
  <BContainer fluid class="web-player-container">
    <BRow class="h-100">
      <BCol>
        <div v-if="!isSDKReady" class="loading-state">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading player...</span>
          </div>
          <p class="mt-3">Initializing Spotify Player...</p>
        </div>

        <div v-else-if="!deviceId" class="error-state">
          <i class="bi bi-exclamation-triangle-fill text-warning fs-1"></i>
          <p class="mt-3">Player not connected. Please refresh the page.</p>
        </div>

        <div v-else class="player-content">
          <!-- Current Track Display -->
          <div class="current-track-section">
            <div v-if="currentTrack" class="track-display">
              <img
                :src="currentTrack.album.images[0]?.url"
                :alt="currentTrack.name"
                class="album-art"
              >
              <div class="track-info">
                <h5 class="track-name">{{ currentTrack.name }}</h5>
                <p class="artist-name">{{ currentTrack.artists.map(a => a.name).join(', ') }}</p>
              </div>
            </div>
            <div v-else class="no-track">
              <i class="bi bi-music-note-beamed fs-1 text-muted"></i>
              <p class="text-muted mt-2">No track playing</p>
              <small class="text-muted">Select a playlist to start playback</small>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="currentTrack" class="progress-section">
            <span class="time-label">{{ formatTime(position) }}</span>
            <div class="progress-bar-container">
              <div
                class="progress-bar-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <span class="time-label">{{ formatTime(duration) }}</span>
          </div>

          <!-- Playback Controls -->
          <div class="controls-section">
            <BButton
              variant="outline-light"
              size="lg"
              @click="previousTrack"
              :disabled="!currentTrack"
              class="control-btn"
            >
              <i class="bi bi-skip-backward-fill"></i>
            </BButton>

            <BButton
              variant="success"
              size="lg"
              @click="togglePlay"
              :disabled="!currentTrack"
              class="control-btn play-btn"
            >
              <i :class="isPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill'"></i>
            </BButton>

            <BButton
              variant="outline-light"
              size="lg"
              @click="nextTrack"
              :disabled="!currentTrack"
              class="control-btn"
            >
              <i class="bi bi-skip-forward-fill"></i>
            </BButton>
          </div>

          <!-- Volume Control -->
          <div class="volume-section">
            <i class="bi bi-volume-up-fill text-light"></i>
            <input
              type="range"
              min="0"
              max="100"
              v-model="volume"
              @input="setVolume"
              class="volume-slider"
            >
            <span class="volume-label">{{ volume }}%</span>
          </div>

          <!-- Device Info -->
          <div class="device-info">
            <small class="text-muted">
              <i class="bi bi-laptop"></i> Playing on: {{ playerName }}
            </small>
          </div>
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, Ref } from 'vue';
import { useStore } from 'vuex';
import type { RootState } from '../types/store';

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (data: any) => void) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
}

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
}

declare global {
  interface Window {
    Spotify?: {
      Player: new (options: any) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

const store = useStore<RootState>();
const player: Ref<SpotifyPlayer | null> = ref(null);
const deviceId = ref<string | null>(null);
const isSDKReady = ref(false);
const isPaused = ref(true);
const currentTrack = ref<SpotifyTrack | null>(null);
const position = ref(0);
const duration = ref(0);
const volume = ref(50);
const playerName = ref('Web Playback SDK');
const positionInterval: Ref<NodeJS.Timeout | null> = ref(null);

const progressPercent = computed(() => {
  if (duration.value === 0) return 0;
  return (position.value / duration.value) * 100;
});

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const loadSpotifySDK = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve();
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      resolve();
    };

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
  });
};

const initializePlayer = async (): Promise<void> => {
  const token = store.state.token;

  if (!token) {
    console.error('No access token available');
    return;
  }

  if (!window.Spotify) {
    console.error('Spotify SDK not loaded');
    return;
  }

  player.value = new window.Spotify.Player({
    name: playerName.value,
    getOAuthToken: (cb: (token: string) => void) => {
      cb(token);
    },
    volume: volume.value / 100
  });

  player.value.addListener('initialization_error', ({ message }: { message: string }) => {
    console.error('Initialization Error:', message);
  });

  player.value.addListener('authentication_error', ({ message }: { message: string }) => {
    console.error('Authentication Error:', message);
  });

  player.value.addListener('account_error', ({ message }: { message: string }) => {
    console.error('Account Error:', message);
  });

  player.value.addListener('playback_error', ({ message }: { message: string }) => {
    console.error('Playback Error:', message);
  });

  player.value.addListener('ready', ({ device_id }: { device_id: string }) => {
    console.log('Ready with Device ID', device_id);
    deviceId.value = device_id;
    store.commit('setPlayerDeviceId', device_id);
  });

  player.value.addListener('not_ready', ({ device_id }: { device_id: string }) => {
    console.log('Device ID has gone offline', device_id);
    deviceId.value = null;
  });

  player.value.addListener('player_state_changed', (state: any) => {
    if (!state) {
      return;
    }

    currentTrack.value = state.track_window.current_track;
    isPaused.value = state.paused;
    position.value = state.position;
    duration.value = state.duration;

    if (!state.paused) {
      startPositionTracking();
    } else {
      stopPositionTracking();
    }
  });

  const connected = await player.value.connect();
  if (connected) {
    console.log('The Web Playback SDK successfully connected to Spotify!');
    isSDKReady.value = true;
  }
};

const startPositionTracking = (): void => {
  stopPositionTracking();
  positionInterval.value = setInterval(() => {
    if (!isPaused.value) {
      position.value += 1000;
    }
  }, 1000);
};

const stopPositionTracking = (): void => {
  if (positionInterval.value) {
    clearInterval(positionInterval.value);
    positionInterval.value = null;
  }
};

const togglePlay = (): void => {
  player.value?.togglePlay();
};

const nextTrack = (): void => {
  player.value?.nextTrack();
};

const previousTrack = (): void => {
  player.value?.previousTrack();
};

const setVolume = (): void => {
  player.value?.setVolume(volume.value / 100);
};

onMounted(async () => {
  await loadSpotifySDK();
  await initializePlayer();
});

onBeforeUnmount(() => {
  stopPositionTracking();
  if (player.value) {
    player.value.disconnect();
  }
});
</script>

<style scoped>
.web-player-container {
  height: 100%;
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
}

.player-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding-right: 0.5rem;
}

/* Custom scrollbar for player content */
.player-content::-webkit-scrollbar {
  width: 6px;
}

.player-content::-webkit-scrollbar-track {
  background: transparent;
}

.player-content::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 3px;
}

.player-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.current-track-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.track-display {
  text-align: center;
  max-width: 100%;
  width: 100%;
}

.album-art {
  width: 100%;
  max-width: 250px;
  max-height: 250px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
  object-fit: cover;
}

.track-info {
  color: #fff;
}

.track-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.artist-name {
  font-size: 0.9rem;
  color: #b3b3b3;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.no-track {
  text-align: center;
  color: #b3b3b3;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.time-label {
  font-size: 0.875rem;
  color: #b3b3b3;
  min-width: 45px;
}

.progress-bar-container {
  flex: 1;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
}

.progress-bar-fill {
  height: 100%;
  background: #1DB954;
  transition: width 0.1s linear;
}

.controls-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
  padding: 0.5rem 0;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  border: 2px solid #fff;
  transition: all 0.2s;
  flex-shrink: 0;
}

.control-btn:hover:not(:disabled) {
  transform: scale(1.1);
  border-color: #1DB954;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.play-btn {
  width: 56px;
  height: 56px;
  font-size: 1.4rem;
  border: none;
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.5rem 0;
}

.volume-slider {
  width: 150px;
  accent-color: #1DB954;
}

.volume-label {
  min-width: 45px;
  color: #b3b3b3;
  font-size: 0.875rem;
}

.device-info {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #404040;
  flex-shrink: 0;
}
</style>
