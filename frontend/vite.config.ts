import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[Vite Proxy] Error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            if (req.method === 'POST' && req.url?.includes('/upload-logo')) {
              console.log('[Vite Proxy] Forwarding upload-logo request');
            }
          });
        },
      },
      '/generated_pdfs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[Vite Proxy] Generated PDFs Error:', err.message);
          });
        },
      },
    },
  },
});
