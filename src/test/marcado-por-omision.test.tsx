/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { Calendar } from '../components/Calendar'
import { DatePicker } from '../components/DatePicker'
import { DateRangePicker } from '../components/DateRangePicker'
import { Field } from '../components/Field'
import { FileUpload } from '../components/FileUpload'
import { Input } from '../components/Input'
import { PinInput } from '../components/PinInput'
import { Popover } from '../components/Popover'
import { SegmentedControl } from '../components/SegmentedControl'
import { Slider } from '../components/Slider'

/**
 * Regla de compatibilidad: lo que ya existía renderiza EXACTAMENTE igual por omisión. Los casos
 * se renderizaron contra la versión anterior (0.8.3) y su marcado quedó en
 * `marcado-por-omision.base.json`; cualquier cambio del marcado por omisión rompe esta prueba.
 * Todo lo nuevo (scrollable, mode="multiple", marks, portal, associateLabel…) es opt-in.
 */
const casos: Record<string, () => string> = {
  calendario: () => renderToStaticMarkup(<Calendar value="2026-10-16" min="2026-10-01" max="2026-10-30" weekStartsOn={1} locale="es" />),
  calendarioVacio: () => renderToStaticMarkup(<Calendar value="2026-10-16" locale="en" classNames={{ day: 'x' }} />),
  selectorDeFecha: () => renderToStaticMarkup(<DatePicker value="2026-10-16" label="Vence" id="f" helper="ayuda" />),
  selectorDeFechaAbierto: () => renderToStaticMarkup(<DatePicker label="Vence" id="f" error />),
  selectorDeRango: () => renderToStaticMarkup(<DateRangePicker label="Rango" id="r" />),
  campo: () => renderToStaticMarkup(<Field label="Latitud" helper="Grados" required htmlFor="lat"><Input id="lat" /></Field>),
  campoSinFor: () => renderToStaticMarkup(<Field label="Latitud" error="Mal"><Input /></Field>),
  campoSinEtiqueta: () => renderToStaticMarkup(<Field><span>hola</span></Field>),
  archivo: () => renderToStaticMarkup(<FileUpload id="u" label="Fotos" multiple />),
  pin: () => renderToStaticMarkup(<PinInput length={4} defaultValue="12" label="PIN" helper="h" error mask />),
  pinTexto: () => renderToStaticMarkup(<PinInput type="text" value="ab" />),
  popoverCerrado: () => renderToStaticMarkup(<Popover side="top"><Popover.Trigger id="t">Abrir</Popover.Trigger><Popover.Content>X</Popover.Content></Popover>),
  popoverAbierto: () => renderToStaticMarkup(<Popover defaultOpen><Popover.Trigger id="t">Abrir</Popover.Trigger><Popover.Content className="c">X</Popover.Content></Popover>),
  segmentado: () => renderToStaticMarkup(<SegmentedControl defaultValue="b" label="Modo"><SegmentedControl.Item value="a">A</SegmentedControl.Item><SegmentedControl.Item value="b">B</SegmentedControl.Item></SegmentedControl>),
  deslizador: () => renderToStaticMarkup(<Slider id="s" label="Vol" showValue value={40} tone="success" helper="h" onChange={() => {}} />),
}

const ruta = join(import.meta.dir, 'marcado-por-omision.base.json')
const generar = process.env.GENERAR_BASE

describe('marcado por omisión sin cambios (compatibilidad con 0.8.3)', () => {
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
