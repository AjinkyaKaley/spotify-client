import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'bootstrap-vue-next'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [BootstrapVueNextResolver()]
    })
  ],
  optimizeDeps: {
    exclude:[ 'fsevents']
  },
  server: {
    host: '127.0.0.1', // Match the Spotify callback URL
    port: 5173,
    fs: {
      strict: false
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})