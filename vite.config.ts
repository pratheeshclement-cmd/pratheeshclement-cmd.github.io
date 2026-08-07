import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.zip', '**/.git/**'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split heavy vendor libs into separate cached chunks
          if (id.includes('node_modules/three'))          return 'vendor-three';
          if (id.includes('node_modules/gsap'))           return 'vendor-gsap';
          if (id.includes('node_modules/lenis'))          return 'vendor-lenis';
          if (id.includes('node_modules/lucide-react'))   return 'vendor-icons';
          if (id.includes('node_modules/react-dom'))      return 'vendor-react';
          if (id.includes('node_modules/react/'))         return 'vendor-react';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Target modern mobile & desktop JS engines for optimal minification
    minify: 'esbuild',
    target: 'es2020',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'lenis'],
  },
});
