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
        rewrite: (path) => {
          const rewritten = path.replace(/^\/api/, '')
          console.log(`Proxy rewrite: ${path} -> ${rewritten}`)
          return rewritten
        },
        secure: false,
        ws: true,
        logLevel: 'debug',
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    },
  },
})
