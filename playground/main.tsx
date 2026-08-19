import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Base (tokens + look único + layout) una vez.
import '../src/styles/index.css'
// Import directo del layout (además del @import de la base) para que Vite lo trackee y el HMR
// recargue seguro al editarlo. En un consumidor real viene incluido en 'skinkit/styles/base'.
import '../src/styles/layout.css'
import './playground.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
