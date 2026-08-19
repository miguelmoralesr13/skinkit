import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El playground vive en /playground y consume los componentes desde ../src directamente.
export default defineConfig({
  root: 'playground',
  plugins: [react(), tailwindcss()],
  server: { port: 3200 },
})
