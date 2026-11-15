/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Disclosure } from './Disclosure'

describe('Disclosure', () => {
  test('el marcado por omisión NO cambió (sin badge no hay parte badge)', () => {
    const html = renderToStaticMarkup(
      <Disclosure>
        <Disclosure.Trigger>Título</Disclosure.Trigger>
        <Disclosure.Content>Cuerpo</Disclosure.Content>
      </Disclosure>,
    )
    expect(html).not.toContain('data-part="badge"')
    expect(html).toMatch(
      /^<div data-sk="disclosure" data-state="closed" class="sk-disclosure"><button type="button" data-part="trigger" data-state="closed" id="[^"]+" aria-expanded="false" aria-controls="[^"]+" class="sk-disclosure__trigger"><span data-part="label">Título<\/span><span data-part="indicator" aria-hidden="true"><\/span><\/button><div data-part="content"/,
    )
  })

  test('badge opt-in: aparece entre el título y el indicador', () => {
    const html = renderToStaticMarkup(
      <Disclosure defaultOpen>
        <Disclosure.Trigger badge={3}>Confirmados</Disclosure.Trigger>
        <Disclosure.Content>Cuerpo</Disclosure.Content>
      </Disclosure>,
    )
    expect(html).toContain('<span data-part="label">Confirmados</span><span data-part="badge">3</span><span data-part="indicator"')
    expect(html).toContain('aria-expanded="true"')
    expect(html).toContain('data-state="open"')
  })

  test('badge 0 se muestra (cero es un contador válido)', () => {
    const html = renderToStaticMarkup(
      <Disclosure><Disclosure.Trigger badge={0}>T</Disclosure.Trigger><Disclosure.Content>c</Disclosure.Content></Disclosure>,
    )
    expect(html).toContain('<span data-part="badge">0</span>')
  })
})
