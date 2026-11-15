import { act, type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'

/** Monta un elemento en un contenedor real de happy-dom (importar antes `./dom`). */
let root: Root | null = null
let host: HTMLElement | null = null

export function montar(ui: ReactElement) {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root!.render(ui))
  return host
}
export function rerender(ui: ReactElement) {
  act(() => root!.render(ui))
}
export function limpiar() {
  act(() => root?.unmount())
  host?.remove()
  document.body.innerHTML = ''
  root = null
  host = null
}
export function evento(el: Element, tipo: string, init: Record<string, unknown> = {}) {
  const ev = new MouseEvent(tipo, { bubbles: true, cancelable: true, button: 0, ...init })
  act(() => {
    el.dispatchEvent(ev)
  })
  return ev
}
export function tecla(el: Element, key: string, init: Record<string, unknown> = {}) {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  act(() => {
    el.dispatchEvent(ev)
  })
  return ev
}
export function click(el: Element) {
  act(() => {
    ;(el as HTMLElement).click()
  })
}
