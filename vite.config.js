import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/satellite-tracker-app/',
  plugins: [react()],
  build: {
    target: "ES2022" 
  },
})
