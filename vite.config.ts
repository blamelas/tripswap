import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `VITE_BASE` allows the same build to be hosted at the domain root (Vercel)
// or under a project subpath (GitHub Pages: /tripswap/).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
