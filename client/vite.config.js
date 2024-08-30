import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   build: {
//     rollupOptions: {
//       external: ['@mui/icons-material/Home'],
//     },
//     outDir: 'dist',
//   },
//   plugins: [react()],
//   loader: { '.js': 'jsx' },
//   define: {
//     global: 'globalThis',
//   },
//   server: {
//     port: 443,
//     proxy: {
//       '/api': 'https://realestatepal.cs.colman.ac.il',
//       '/auth': 'https://realestatepal.cs.colman.ac.il',
//     },
//   },
// });
