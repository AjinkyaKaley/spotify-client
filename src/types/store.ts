export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
}

export interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  uri: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
  };
  uri: string;
}

export interface TrackMetadata {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  valence: number;
}

export interface RootState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  userProfile: UserProfile | null;
  topTracks: Track[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  selectedTrack: Track | null;
  trackMetadata: TrackMetadata | null;
  playerDeviceId: string | null;
  selectedPlaylist: Playlist | null;
}
