import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["5173-btwalpole-scrabble-zswhje3rcx7.ws-eu120.gitpod.io"]
  }
})
