/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { Alert } from '../components/Alert'
import { Badge } from '../components/Badge'
import { BottomNav } from '../components/BottomNav'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Dialog } from '../components/Dialog'
import { Menu } from '../components/Menu'
import { Sidebar } from '../components/Sidebar'
import { ZoneCanvas } from '../components/ZoneCanvas'
import { SkinkitProvider } from '../provider/SkinkitProvider'

/**
 * Compatibilidad (zona estilos/navegación/overlays): el marcado por omisión de lo que ya existía
 * es el de 0.8.3 (base generada contra HEAD antes de tocar nada). Las correcciones nuevas
 * (variantPriority, scopedNav, scopedBody, inheritColorScheme, Sidebar.flyout, readOnly…) son opt-in.
 */
const casos: Record<string, () => string> = {
  botones: () =>
    renderToStaticMarkup(
      <>
        <Button>a</Button>
        <Button variant="ghost" tone="danger">b</Button>
        <Button variant="outlined" tone="success" size="sm" iconLeft="i">c</Button>
      </>,
    ),
  tarjeta: () => renderToStaticMarkup(<Card header="H" footer="F">cuerpo</Card>),
  alerta: () => renderToStaticMarkup(<Alert variant="danger" title="T">cuerpo</Alert>),
  insignias: () =>
    renderToStaticMarkup(
      <>
        <Badge>n</Badge>
        <Badge variant="danger">3</Badge>
      </>,
    ),
  menu: () =>
    renderToStaticMarkup(
      <Menu>
        <Menu.Trigger>Abrir</Menu.Trigger>
        <Menu.Content><Menu.Item>Uno</Menu.Item></Menu.Content>
      </Menu>,
    ),
  barraLateral: () =>
    renderToStaticMarkup(
      <Sidebar collapsed>
        <Sidebar.Item href="#" icon="i" badge="2" active>Inicio</Sidebar.Item>
        <Sidebar.Group icon="g" label="Config"><Sidebar.Item href="#">Perfil</Sidebar.Item></Sidebar.Group>
      </Sidebar>,
    ),
  barraLateralAbierta: () =>
    renderToStaticMarkup(
      <Sidebar>
        <Sidebar.Group label="Config" defaultOpen><Sidebar.Item href="#">Perfil</Sidebar.Item></Sidebar.Group>
      </Sidebar>,
    ),
  navInferior: () =>
    renderToStaticMarkup(
      <BottomNav>
        <BottomNav.Item href="#" icon="i" active>Inicio</BottomNav.Item>
        <BottomNav.Item icon="m" submenu={<BottomNav.SheetItem href="#">x</BottomNav.SheetItem>}>Más</BottomNav.Item>
      </BottomNav>,
    ),
  lienzo: () =>
    renderToStaticMarkup(
      <ZoneCanvas
        zones={[{ id: 'z', position: { x: 0, y: 0 }, size: { width: 200, height: 100 } }]}
        items={[{ id: 'i', zoneId: 'z', position: { x: 4, y: 4 } }]}
      />,
    ),
  dialogoCerrado: () => renderToStaticMarkup(<Dialog open={false} onClose={() => {}}>x</Dialog>),
  proveedor: () => renderToStaticMarkup(<SkinkitProvider colorScheme="dark">x</SkinkitProvider>),
  proveedorSimple: () => renderToStaticMarkup(<SkinkitProvider>x</SkinkitProvider>),
}

const ruta = join(import.meta.dir, 'zona3-por-omision.base.json')
const generar = process.env.GENERAR_BASE

describe('zona 3: marcado por omisión sin cambios', () => {
  if (generar) {
    test('genera la base', () => {
      const out: Record<string, string> = {}
      for (const [k, f] of Object.entries(casos)) out[k] = f()
      writeFileSync(generar, JSON.stringify(out, null, 1))
    })
    return
  }
  const base = JSON.parse(readFileSync(ruta, 'utf8')) as Record<string, string>
  for (const [k, f] of Object.entries(casos)) {
    test(k, () => {
      expect(f()).toBe(base[k])
    })
  }
})
