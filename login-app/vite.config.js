import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ipt71.kuno-schuerch.bbzwinf.ch',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    },
  },
})
