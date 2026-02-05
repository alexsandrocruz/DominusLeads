import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Extract XSRF token from cookies and add to headers
            const cookies = req.headers.cookie || '';
            const xsrfMatch = cookies.match(/XSRF-TOKEN=([^;]+)/);
            if (xsrfMatch) {
              const token = decodeURIComponent(xsrfMatch[1]);
              proxyReq.setHeader('X-XSRF-TOKEN', token);
              proxyReq.setHeader('RequestVerificationToken', token);
            }

            console.log(`[PROXY] ${req.method} ${req.url} -> ${options.target}${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.url}`);
          });
        },
      },
      '/connect': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/Account': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/.well-known': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
