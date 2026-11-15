/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { SortableList, moveItem } from './SortableList'

const items = [{ id: 'a', t: 'Uno' }, { id: 'b', t: 'Dos' }, { id: 'c', t: 'Tres' }]
const render = (props: Partial<Parameters<typeof SortableList<(typeof items)[number]>>[0]> = {}) =>
  renderToStaticMarkup(<SortableList value={items} onChange={() => {}} renderItem={(i) => <span>{i.t}</span>} {...props} />)

describe('SortableList · moveItem', () => {
  test('mueve hacia arriba, abajo y acota los extremos sin mutar', () => {
    const base = ['a', 'b', 'c']
    expect(moveItem(base, 2, 0)).toEqual(['c', 'a', 'b'])
    expect(moveItem(base, 0, 1)).toEqual(['b', 'a', 'c'])
    expect(moveItem(base, 0, 99)).toEqual(['b', 'c', 'a'])
    expect(moveItem(base, 5, 0)).toEqual(['a', 'b', 'c'])
    expect(base).toEqual(['a', 'b', 'c'])
  })
})

describe('SortableList', () => {
  test('lista numerada con contenido por elemento', () => {
    const html = render({ label: 'Pasos' })
    expect(html).toContain('<ol data-part="list" aria-label="Pasos">')
    expect((html.match(/data-part="item"/g) ?? []).length).toBe(3)
    expect(html).toContain('<span data-part="index" aria-hidden="true">3</span>')
    expect(html).toContain('<span>Dos</span>')
  })

  test('cada botón nombra su elemento; primero y último quedan aria-disabled', () => {
    const html = render()
    expect(html).toContain('aria-label="Subir elemento 2"')
    expect(html).toContain('aria-label="Bajar elemento 2"')
    expect(html).toContain('aria-label="Quitar elemento 3"')
    expect((html.match(/aria-disabled="true"/g) ?? []).length).toBe(2)
  })

  test('itemLabel personaliza los nombres accesibles', () => {
    const html = render({ itemLabel: (i) => `paso «${i.t}»` })
    expect(html).toContain('aria-label="Subir paso «Dos»"')
  })

  test('removable=false quita los botones; minItems los deshabilita', () => {
    expect(render({ removable: false })).not.toContain('data-part="remove"')
    const min = render({ minItems: 3 })
    expect((min.match(/data-part="remove" disabled=""/g) ?? []).length).toBe(3)
  })

  test('onAdd muestra Agregar; vacío muestra el mensaje y no la lista', () => {
    expect(render({ onAdd: () => {} })).toContain('data-part="add"')
    expect(render()).not.toContain('data-part="add"')
    const vacio = render({ value: [], empty: 'Nada aún' })
    expect(vacio).toContain('Nada aún')
    expect(vacio).not.toContain('<ol')
  })

  test('región aria-live para anunciar cambios y asa arrastrable', () => {
    const html = render()
    expect(html).toContain('role="status" aria-live="polite"')
    expect(html).toContain('draggable="true"')
  })

  test('disabled apaga todo', () => {
    const html = render({ disabled: true, onAdd: () => {} })
    expect(html).toContain('data-disabled=""')
    expect(html).toContain('draggable="false"')
  })
})

describe('SortableList · contenedor estrecho', () => {
  test('el marcado no cambia: las acciones siguen dentro de cada item', () => {
    const html = render()
    expect(html).toContain('data-part="actions"')
    expect(html).not.toContain('data-wrap')
  })
  test('el CSS baja las acciones a su propia fila con container query', async () => {
    const { readFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    const css = readFileSync(join(import.meta.dir, '../../styles/components/sortable-list.css'), 'utf8')
    expect(css).toContain('container-type: inline-size')
    expect(css).toMatch(/@container sk-sortable-list \(max-width: 28rem\)/)
    expect(css).toMatch(/\[data-part='actions'\] \{\s*flex-basis: 100%/)
  })
})
