/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compile } from 'tailwindcss'

const tokens = readFileSync(join(import.meta.dir, '../styles/tokens.css'), 'utf8')

/** Compila `tokens.css` con Tailwind v4 (sin preflight) y devuelve el CSS de las clases pedidas. */
async function utilidades(clases: string[]) {
  const c = await compile(`${tokens}\n@tailwind utilities;`)
  return c.build(clases)
}

describe('escala tipográfica text-sk-*', () => {
  test('xs < sm < md < lg (rem)', () => {
    const valor = (n: string) => Number(new RegExp(`--text-sk-${n}:\\s*([\\d.]+)rem`).exec(tokens)?.[1])
    const [xs, sm, md, lg] = ['xs', 'sm', 'md', 'lg'].map(valor)
    expect(xs).toBe(0.75)
    expect(xs).toBeLessThan(sm)
    expect(sm).toBeLessThan(md)
    expect(md).toBeLessThan(lg)
  })

  test('text-sk-xs genera tamaño y line-height propios', async () => {
    const css = await utilidades(['text-sk-xs'])
    expect(css).toContain('.text-sk-xs')
    expect(css).toContain('font-size: var(--text-sk-xs)')
    expect(css).toContain('var(--text-sk-xs--line-height)')
    expect(css).toMatch(/--text-sk-xs:\s*0\.75rem/)
    expect(css).toMatch(/--text-sk-xs--line-height:\s*1rem/)
  })

  test('leading-* sigue mandando sobre el line-height de xs', async () => {
    const css = await utilidades(['text-sk-xs'])
    expect(css).toContain('line-height: var(--tw-leading, var(--text-sk-xs--line-height))')
  })

  test('sm/md/lg no cambian: mismo valor y sin line-height propio (compatibilidad)', async () => {
    expect(tokens).toMatch(/--text-sk-sm:\s*0\.8125rem;/)
    expect(tokens).toMatch(/--text-sk-md:\s*0\.9375rem;/)
    expect(tokens).toMatch(/--text-sk-lg:\s*1\.0625rem;/)
    expect(tokens).not.toMatch(/--text-sk-(sm|md|lg)--line-height/)
    const css = await utilidades(['text-sk-sm'])
    expect(css).toContain('font-size: var(--text-sk-sm)')
  })
})
