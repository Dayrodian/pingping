import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 50000000, // 50MB для инлайна ассетов
  },
  server: {
    port: 3000,
    open: true,
  },
});


