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
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'axios'],
          'icons': ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
