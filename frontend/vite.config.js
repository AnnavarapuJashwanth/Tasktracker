import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to handle SPA routing fallback
const spaFallbackPlugin = {
  name: 'spa-fallback',
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // For SPA routes like /acknowledge/..., serve index.html
        // Check if it's a navigation route (not a file, api call, or static asset)
        if (!req.url.includes('.') && !req.url.startsWith('/api') && !req.url.startsWith('/@')) {
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
