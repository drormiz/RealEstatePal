import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@mui/icons-material/Home'],
    },
    outDir: 'dist',
  },
  plugins: [react()],
  loader: { '.js': 'jsx' },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 80,
    proxy: {
      '/api': 'http://realestatepal.cs.colman.ac.il',
      '/auth': 'http://realestatepal.cs.colman.ac.il',
    },
  },
});