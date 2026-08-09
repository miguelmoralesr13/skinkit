import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Base (tokens + themes) una vez, y los dos skins. El provider elige cuál aplica.
import '../src/styles/index.css'
// Import directo del layout (además del @import de la base) para que Vite lo trackee y el HMR
// recargue seguro al editarlo. En un consumidor real viene incluido en 'skinkit/styles/base'.
import '../src/styles/layout.css'
import '../src/styles/skins/soft.css'
import '../src/styles/skins/brutal.css'
import '../src/styles/skins/minimal.css'
import '../src/styles/skins/glass.css'
import '../src/styles/skins/retro.css'
import '../src/styles/skins/elevated.css'
import '../src/styles/skins/clay.css'
import '../src/styles/skins/outline.css'
import '../src/styles/skins/sketch.css'
import '../src/styles/skins/spotlight.css'
import '../src/styles/skins/terminal.css'
import '../src/styles/skins/gradient.css'
import '../src/styles/skins/aurora.css'
import '../src/styles/skins/glow.css'
import '../src/styles/skins/holo.css'
import './playground.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
