import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Alert, Badge, BottomNav, Button, Card, Dialog, Menu, Sidebar, SkinkitProvider, ZoneCanvas,
  applyItemChanges, type Item, type Zone,
} from '../src'
import '../src/styles/index.css'
import '../src/styles/layout.css'
import './playground.css'

const TONES = ['primary', 'secondary', 'tertiary', 'accent', 'success', 'warning', 'info', 'danger'] as const

function Matriz() {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {(['filled', 'outlined', 'ghost'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TONES.map((t) => (
            <Button key={t} variant={v} tone={t} size="sm">{v} {t}</Button>
          ))}
        </div>
      ))}
    </div>
  )
}

const zonas: Zone[] = [{ id: 'sala', position: { x: 0, y: 0 }, size: { width: 300, height: 140 }, draggable: false, resizable: false }]
const mesas: Item<{ n: number }>[] = [
  { id: 'a', zoneId: 'sala', position: { x: 10, y: 10 }, tone: 'success', data: { n: 1 } },
  { id: 'b', zoneId: 'sala', position: { x: 90, y: 10 }, tone: 'danger', data: { n: 2 } },
  { id: 'c', zoneId: 'sala', position: { x: 170, y: 10 }, tone: 'warning', data: { n: 3 } },
]

function Bloque({ opt, esquema }: { opt: boolean; esquema?: 'light' | 'dark' }) {
  const [abierto, setAbierto] = useState(false)
  const [items, setItems] = useState(mesas)
  const [clic, setClic] = useState('')
  return (
    <SkinkitProvider refinements={opt} colorScheme={esquema}>
      <section style={{ padding: 16, display: 'grid', gap: 14, background: 'var(--color-sk-surface)', color: 'var(--color-sk-text)' }}>
        <h2>{opt ? 'CON refinements' : 'Por omisión (sin opt-in)'}</h2>
        <Matriz />
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge variant="soft">soft</Badge>
          {TONES.slice(1).map((t) => <Badge key={t} variant="soft" tone={t}>{t}</Badge>)}
          <Badge variant="soft" tone="neutral">neutral</Badge>
        </div>
        <Card header="Tarjeta"><Alert variant="info" title="Alerta anidada">cuerpo del alert</Alert></Card>
        <div style={{ display: 'flex', gap: 12, height: 240 }}>
          <Sidebar collapsed flyout={opt} style={{ minInlineSize: 64 }}>
            <Sidebar.Item href="#" icon="🏠" active>Inicio</Sidebar.Item>
            <Sidebar.Group icon="⚙" label="Negocio">
              <Sidebar.Item href="#">Clientes</Sidebar.Item>
              <Sidebar.Item href="#">Equipo</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar>
          <div style={{ '--color-sk-surface': '#1b1b1f', '--color-sk-text': '#f4efe6', '--color-sk-surface-2': '#2a2a30', '--color-sk-text-muted': '#b9b3a8', padding: 8 } as React.CSSProperties}>
            <Sidebar style={{ minInlineSize: 200 }}>
              <Menu>
                <Menu.Trigger>Restaurante ▾</Menu.Trigger>
                <Menu.Content>
                  <Menu.Item>Sucursal Norte</Menu.Item>
                  <Menu.Item>Sucursal Sur</Menu.Item>
                </Menu.Content>
              </Menu>
              <Sidebar.Item href="#" icon="🏠">Inicio</Sidebar.Item>
            </Sidebar>
          </div>
        </div>
        <div style={{ width: 360 }}>
          <BottomNav>
            <BottomNav.Item href="#" icon="🏠" active>Inicio</BottomNav.Item>
            <BottomNav.Item href="#" icon="🔔" badge={3}>Avisos</BottomNav.Item>
            <BottomNav.Item href="#" icon="⋯" badge="12">Más</BottomNav.Item>
          </BottomNav>
        </div>
        <ZoneCanvas<{ n: number }>
          readOnly
          style={{ height: 150, width: 320 }}
          zones={zonas}
          items={items}
          onItemsChange={(c) => setItems((p) => applyItemChanges(p, c))}
          onItemClick={(i) => setClic(`mesa ${i.data?.n}`)}
          itemTypes={{ default: () => null }}
        />
        <small>visor: {clic || 'toca una mesa'}</small>
        <Button onClick={() => setAbierto(true)}>Abrir diálogo</Button>
        <Dialog open={abierto} onClose={() => setAbierto(false)}>
          <Dialog.Header><Dialog.Title>Diálogo</Dialog.Title></Dialog.Header>
          <Dialog.Body><Alert variant="warning">alerta dentro</Alert></Dialog.Body>
          <Dialog.Footer><Button variant="ghost" tone="danger" onClick={() => setAbierto(false)}>Cerrar</Button></Dialog.Footer>
        </Dialog>
      </section>
    </SkinkitProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))' }}>
      <Bloque opt={false} />
      <Bloque opt />
    </div>
  </StrictMode>,
)
