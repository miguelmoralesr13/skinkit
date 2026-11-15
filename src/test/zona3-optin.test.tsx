/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { Badge } from '../components/Badge'
import { BottomNav } from '../components/BottomNav'
import { Sidebar } from '../components/Sidebar'
import { ZoneCanvas, applyItemChanges, applyZoneChanges, type Item, type Zone } from '../components/ZoneCanvas'
import { SkinkitProvider } from '../provider/SkinkitProvider'
import { useOverlayRootProps } from '../provider/overlayRoot'

const css = (n: string) => readFileSync(join(import.meta.dir, '../styles/components', n), 'utf8')

describe('Badge soft', () => {
  test('soft con tono emite data-tone; las demás variantes no', () => {
    expect(renderToStaticMarkup(<Badge variant="soft" tone="success">a</Badge>)).toContain('data-variant="soft" data-tone="success"')
    expect(renderToStaticMarkup(<Badge variant="danger" tone="success">a</Badge>)).not.toContain('data-tone')
  })
})

describe('BottomNav.Item badge', () => {
  test('pinta el contador; sin badge o con 0 no hay marcado extra', () => {
    const con = renderToStaticMarkup(<BottomNav><BottomNav.Item href="#" badge={3}>A</BottomNav.Item></BottomNav>)
    expect(con).toContain('data-part="item-badge">3<')
    const sin = renderToStaticMarkup(<BottomNav><BottomNav.Item href="#" badge={0}>A</BottomNav.Item></BottomNav>)
    expect(sin).not.toContain('item-badge')
  })
})

describe('ZoneCanvas visor', () => {
  const zonas: Zone[] = [{ id: 'z', position: { x: 0, y: 0 }, size: { width: 200, height: 100 } }]
  const items: Item<{ n: number }>[] = [{ id: 'i', zoneId: 'z', position: { x: 1, y: 1 }, tone: 'danger', data: { n: 1 } }]
  test('readOnly sin resize handles ni tabIndex; tone y onItemClick', () => {
    const html = renderToStaticMarkup(<ZoneCanvas readOnly zones={zonas} items={items} onItemClick={() => {}} />)
    expect(html).toContain('data-readonly')
    expect(html).toContain('data-tone="danger"')
    expect(html).toContain('role="button"')
    expect(html).not.toContain('resize-handle')
  })
  test('editor por omisión conserva los handles', () => {
    expect(renderToStaticMarkup(<ZoneCanvas zones={zonas} items={items} />)).toContain('resize-handle')
  })
  test('los reducers conservan el tipo de data', () => {
    const r: Item<{ n: number }>[] = applyItemChanges(items, [{ type: 'position', id: 'i', position: { x: 5, y: 5 }, dragging: false }])
    expect(r[0].data?.n).toBe(1)
    expect(r[0].position.x).toBe(5)
    const z: Zone<{ a: string }>[] = applyZoneChanges<{ a: string }>([], [])
    expect(z).toEqual([])
  })
})

describe('Opciones opt-in del SkinkitProvider', () => {
  const Sonda = () => <i data-p={JSON.stringify(useOverlayRootProps())} />
  const props = (h: string) => JSON.parse(/data-p="([^"]*)"/.exec(h)![1].replace(/&quot;/g, '"')) as Record<string, string>
  test('sin opciones: ningún atributo nuevo en la raíz ni en el overlay', () => {
    const h = renderToStaticMarkup(<SkinkitProvider><Sonda /></SkinkitProvider>)
    expect(h).toContain('<div data-skinkit-root="" class="skinkit-root">')
    expect(props(h)).toEqual({})
  })
  test('refinements activa todo y el overlay replica los atributos', () => {
    const h = renderToStaticMarkup(<SkinkitProvider refinements><Sonda /></SkinkitProvider>)
    expect(h).toContain('data-sk-variant-priority')
    expect(h).toContain('data-sk-nav-scope')
    expect(h).toContain('data-sk-body-scope')
    expect(props(h)['data-sk-overlay-root']).toBe('')
    expect(props(h)['data-sk-nav-scope']).toBe('')
  })
  test('colorScheme forzado sigue copiándose al overlay', () => {
    expect(props(renderToStaticMarkup(<SkinkitProvider colorScheme="dark"><Sonda /></SkinkitProvider>))['data-color-scheme']).toBe('dark')
  })
})

describe('Sidebar flyout opt-in', () => {
  const g = (flyout?: boolean) =>
    renderToStaticMarkup(
      <Sidebar collapsed flyout={flyout}>
        <Sidebar.Group label="Config"><Sidebar.Item href="#">x</Sidebar.Item></Sidebar.Group>
      </Sidebar>,
    )
  test('sin flyout: aria-haspopup="menu" y sin aria-label (como siempre)', () => {
    expect(g()).toContain('aria-haspopup="menu"')
    expect(g()).not.toContain('aria-label')
  })
  test('con flyout: aria-haspopup="true" y aria-label', () => {
    expect(g(true)).toContain('aria-haspopup="true"')
    expect(g(true)).toContain('aria-label="Config"')
  })
})

describe('CSS: las reglas viejas siguen y las nuevas van detrás de un atributo opt-in', () => {
  test('button: tonos intactos y reglas nuevas solo bajo [data-sk-variant-priority]', () => {
    const c = css('button.css')
    expect(c).toContain("[data-sk='button'][data-tone='danger'] {\n  --sk-button-bg: var(--color-sk-danger);")
    expect(c).toContain("[data-sk='button'][data-variant='ghost'] {")
    const nuevas = c.split('/* Opt-in')[1]
    for (const sel of nuevas.match(/^\[[^{]*\{/gm) ?? []) expect(sel.trimStart().startsWith('[data-sk-variant-priority]')).toBe(true)
  })
  test('sidebar: cada selector de item lleva la exclusión que solo se cumple con [data-sk-nav-scope]', () => {
    const c = css('sidebar.css')
    const sels = c.split('\n').filter((l) => l.startsWith("[data-sk='sidebar']") && l.includes("[data-part='item']"))
    expect(sels.length).toBeGreaterThan(8)
    for (const l of sels) expect(l).toContain(":not(:where([data-sk-nav-scope] [data-sk='menu'] *))")
    expect(c).toContain("[data-sk='sidebar'] [data-part='item']:not(")
  })
  test('menu, card y dialog: lo nuevo bajo atributo; lo viejo presente', () => {
    expect(css('menu.css')).toContain("[data-sk-nav-scope] [data-sk='menu'] [data-part='trigger'][data-state='open']")
    expect(css('menu.css')).toContain("[data-sk='menu'] [data-part='trigger']:hover {")
    expect(css('card.css')).toContain("[data-sk='card'] [data-part='body']:not(:where([data-sk-body-scope] [data-sk='alert'] *))")
    expect(css('dialog.css')).toContain("[data-sk='dialog'] [data-part='body']:not(:where([data-sk-body-scope] [data-sk='alert'] *))")
  })
  test('grosor del borde: el default es el 1px de siempre', () => {
    expect(css('card.css')).toContain('--sk-card-border-width: var(--border-sk-width, 1px);')
    expect(css('alert.css')).toContain('--sk-alert-border-width: var(--border-sk-width, 1px);')
    expect(readFileSync(join(import.meta.dir, '../styles/tokens.css'), 'utf8')).toContain('--border-sk-width: 1px;')
  })
})
