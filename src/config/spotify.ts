export interface SpotifyConfig {
  CLIENT_ID: string;
  REDIRECT_URI: string;
  AUTH_ENDPOINT: string;
  TOKEN_ENDPOINT: string;
  RESPONSE_TYPE: string;
  CODE_CHALLENGE_METHOD: string;
}

export const SPOTIFY_CONFIG: SpotifyConfig = {
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID || '',
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || 'http://127.0.0.1:5173/callback',
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  RESPONSE_TYPE: 'code',
  CODE_CHALLENGE_METHOD: 'S256'
};
