import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split heavy vendor libs into separate chunks for better caching
          if (id.includes('node_modules/three'))          return 'vendor-three';
          if (id.includes('node_modules/gsap'))           return 'vendor-gsap';
          if (id.includes('node_modules/lenis'))          return 'vendor-lenis';
          if (id.includes('node_modules/lucide-react'))   return 'vendor-icons';
          if (id.includes('node_modules/react-dom'))      return 'vendor-react';
          if (id.includes('node_modules/react'))          return 'vendor-react';
        },
      },
    },
    chunkSizeWarningLimit: 600,
    // Minification options
    minify: 'esbuild',
    target: 'es2020',
  },
  // Tree-shake unused lucide icons — only what's imported
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'lenis'],
  },
});
