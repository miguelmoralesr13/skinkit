/// <reference types="bun" />
import '../../test/dom'
import { afterEach, describe, expect, test } from 'bun:test'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Dialog } from './Dialog'

let root: Root | null = null
let host: HTMLElement | null = null

function montar(onClose: () => void) {
  act(() => {
    root!.render(
      <Dialog open onClose={onClose} aria-label="Motivo de cancelación">
        <Dialog.Body>
          <input aria-label="Motivo" />
        </Dialog.Body>
      </Dialog>,
    )
  })
}

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  root = null
  host = null
})

describe('Dialog · foco', () => {
  test('un `onClose` nuevo en cada render no le quita el foco al campo', () => {
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)

    montar(() => {})
    const campo = document.querySelector<HTMLInputElement>('input[aria-label="Motivo"]')!
    campo.focus()
    expect(document.activeElement).toBe(campo)

    // El padre se repinta (p. ej. al escribir) y pasa otra función: antes el efecto se volvía a
    // correr y regresaba el foco al panel después de cada letra.
    montar(() => {})
    montar(() => {})
    expect(document.activeElement).toBe(campo)
  })

  test('Esc llama al `onClose` más reciente', () => {
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)

    const llamadas: string[] = []
    montar(() => llamadas.push('viejo'))
    montar(() => llamadas.push('nuevo'))
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(llamadas).toEqual(['nuevo'])
  })
})
