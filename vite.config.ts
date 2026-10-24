// vite.config.ts - Exposing Maps Key and fixing metadata resolution
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || ''),
    '__BUILD_METADATA_DIRNAME__': JSON.stringify(process.env.PWD || '/app')
  }
});
