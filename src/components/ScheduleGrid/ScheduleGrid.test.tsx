/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { ScheduleGrid } from './ScheduleGrid'

const rows = [{ key: 'r1', label: 'Fila 1' }, { key: 'r2', label: 'Fila 2' }]
const columns = [{ key: 'c1', label: 'Col A' }, { key: 'c2', label: 'Col B' }, { key: 'c3', label: 'Col C' }]
const entries = (r: string, c: string) =>
  r === 'r1' && c === 'c1'
    ? [
        { key: 'e1', label: 'Uno', state: 'success', stateLabel: 'Confirmado' },
        { key: 'e2', label: 'Dos', state: 'danger' },
      ]
    : []

describe('ScheduleGrid', () => {
  test('roles de grid, encabezados y celdas', () => {
    const html = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} label="Agenda" />)
    expect(html).toContain('role="grid"')
    expect(html).toContain('aria-label="Agenda"')
    expect((html.match(/role="columnheader"/g) ?? []).length).toBe(4) // esquina + 3
    expect((html.match(/role="rowheader"/g) ?? []).length).toBe(2)
    expect((html.match(/role="gridcell"/g) ?? []).length).toBe(6)
    expect(html).toContain('--sk-schedule-grid-columns:3')
  })

  test('varias entradas por celda con data-state y texto del estado', () => {
    const html = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} />)
    expect(html).toContain('data-part="entry" data-state="success"')
    expect(html).toContain('data-part="entry" data-state="danger"')
    expect(html).toContain('Confirmado')
  })

  test('celdas vacías: botón accionable solo con onCellClick, con aria-label de fila y columna', () => {
    const sin = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} />)
    expect(sin).not.toContain('data-part="add"')
    const con = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} onCellClick={() => {}} />)
    expect((con.match(/data-part="add"/g) ?? []).length).toBe(5)
    expect(con).toContain('aria-label="Agregar en Fila 2, Col B"')
    expect(con).toContain('data-empty=""')
  })

  test('entradas son botones solo con onEntryClick', () => {
    const a = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} />)
    expect(a).not.toContain('<button')
    const b = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} onEntryClick={() => {}} />)
    expect(b).toContain('<button type="button" data-part="entry"')
  })

  test('una sola parada de Tab: solo la celda activa (0,0) tiene tabindex 0', () => {
    const html = renderToStaticMarkup(<ScheduleGrid rows={rows} columns={columns} entries={entries} onCellClick={() => {}} onEntryClick={() => {}} />)
    const tabs = [...html.matchAll(/tabindex="(-?\d)"/g)].map((m) => m[1])
    expect(tabs.filter((t) => t === '0').length).toBe(1)
  })

  test('renderEntry y addLabel propios', () => {
    const html = renderToStaticMarkup(
      <ScheduleGrid rows={rows} columns={columns} entries={entries} renderEntry={(e) => <b>{String(e.label)}!</b>} onCellClick={() => {}} addLabel={(r, c) => `+${r.key}${c.key}`} />,
    )
    expect(html).toContain('<b>Uno!</b>')
    expect(html).toContain('aria-label="+r2c3"')
  })
})
