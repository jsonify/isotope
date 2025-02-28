import { defineConfig } from 'cypress';

const baseUrl = process.env.CI 
  ? 'http://localhost:4173'  // Preview server port in CI
  : 'http://localhost:5173'; // Dev server port locally

export default defineConfig({
  e2e: {
    baseUrl,
  },
});
