import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ole-be-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
