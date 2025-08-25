import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      // Proxy backend API to avoid cross-site cookies/SameSite issues in dev
      '/auth': {
        target: 'https://localhost:7108',
        changeOrigin: true,
        secure: false,
      },
      '/Profile': {
        target: 'https://localhost:7108',
        changeOrigin: true,
        secure: false,
      },
      '/antiforgery': {
        target: 'https://localhost:7108',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
