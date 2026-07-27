import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-three': ['three'],
          'vendor-lenis': ['lenis'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
