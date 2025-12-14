export const SPOTIFY_CONFIG = {
  CLIENT_ID: '20957683ed204cd58fae941a90ddd468',
  REDIRECT_URI: 'http://127.0.0.1:5173/callback', // Changed to 127.0.0.1 for better Spotify compatibility
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  RESPONSE_TYPE: 'code', // Changed from 'token' to 'code' for Authorization Code Flow with PKCE
  CODE_CHALLENGE_METHOD: 'S256'
}; 