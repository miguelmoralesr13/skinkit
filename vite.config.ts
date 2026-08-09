import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El playground vive en /playground y consume los componentes desde ../src directamente.
export default defineConfig({
  root: 'playground',
  plugins: [react()],
  server: { port: 3200 },
})
