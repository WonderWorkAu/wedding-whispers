import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api/news': {
        target: 'https://serpapi.com/search',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, ''),
      },
      '/api/article': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
