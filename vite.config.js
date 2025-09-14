import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt', // do not auto reload; prompt logic handled in app
      injectRegister: false, // we'll manually register via virtual:pwa-register
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
      },
      manifest: {
        name: 'Envoyou Dashboard',
        short_name: 'Envoyou',
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#059669',
        icons: [
          {
            src: '/favicon_io/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
            {
            src: '/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    target: 'esnext',
    
    rollupOptions: {
      output: {
        // Removed custom manualChunks to avoid potential runtime issue with react-is export object
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  
  // Development server
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  
  // Preview server
  preview: {
    port: 3000,
    host: true,
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: ['@sentry/react'], // Exclude heavy packages from pre-bundling
  },
  
  // Build optimizations
  esbuild: {
    // Drop console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Target modern browsers for smaller bundles
    target: 'es2020',
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // CSS optimization
  css: {
    devSourcemap: process.env.NODE_ENV === 'development',
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Base URL for deployment
  base: process.env.VITE_BASE_URL || '/',
})
