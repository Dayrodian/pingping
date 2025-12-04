import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 10000, // 10KB - только мелкие ассеты инлайним
    rollupOptions: {
      output: {
        // Разделяем vendor и app код
        manualChunks: {
          vendor: ['three'],
        },
        // Оптимизация имён файлов
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Сжатие и оптимизация
    sourcemap: false,
    reportCompressedSize: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['three'],
  },
});


