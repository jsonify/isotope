/***********************************************
 * FILE: vite.config.ts
 * CREATED: 2025-03-21 23:48:08
 *
 * PURPOSE:
 * This file contains the configuration for Vite, the build tool.
 * It defines plugins, alias configurations, and other build options.
 *
 * CONFIG SECTIONS:
 * - plugins: Defines Vite plugins used in the build process (e.g., react, visualizer).
 * - resolve: Configures module resolution, including path aliases.
 ************************************************/

import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // or 'sunburst', 'network', etc.
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
