import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
  },
  // För Netlify ska base vara '/' (root)
  // Om du vill använda GitHub Pages istället, ändra till '/expense-tracker/'
  base: '/',
})