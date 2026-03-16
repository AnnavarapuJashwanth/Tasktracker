import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to handle SPA routing fallback
const spaFallbackPlugin = {
  name: 'spa-fallback',
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // For SPA routes like /acknowledge/..., serve index.html
        if (req.url.startsWith('/acknowledge/') && !req.url.includes('.')) {
          req.url = '/index.html';
        }
        next();
      });
    };
  },
};

export default defineConfig({
  plugins: [react(), spaFallbackPlugin],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
