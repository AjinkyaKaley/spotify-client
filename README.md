# Spotify Playlist Viewer

A Vue 3 + TypeScript application for viewing and exploring your Spotify playlists using the official Spotify Web API.

## Features

- 🔐 Secure OAuth 2.0 authentication with PKCE
- 📋 View your Spotify playlists
- 🎵 Browse track information
- 🎨 Dark theme interface

## Security & Privacy

This application:
- Uses **official Spotify OAuth** authentication (Authorization Code Flow with PKCE)
- Only requests **read-only access** to your playlists
- **Does not store** your Spotify credentials on any server
- Stores access tokens **securely in your browser only**
- **Does not collect, store, or share** your personal data with third parties

All API requests go directly to Spotify's official endpoints:
- `https://accounts.spotify.com` - Authentication
- `https://api.spotify.com` - Playlist data

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development
- **Bootstrap Vue Next** for UI components
- **Vuex** for state management

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Add your Spotify API credentials (get them at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard))
4. Run `npm install`
5. Run `npm run dev`

See [CLAUDE.md](./CLAUDE.md) for detailed setup and deployment instructions.

## License

MIT

## Questions?

This is a personal project using Spotify's official API. If you have security concerns, please review the source code - it's fully open source.
