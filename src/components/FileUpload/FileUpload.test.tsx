/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { FileUpload } from './FileUpload'

const css = readFileSync(join(import.meta.dir, '../../styles/components/file-upload.css'), 'utf8')

describe('FileUpload anchored (opt-in)', () => {
  test('con anchored la raíz emite data-anchored y el CSS la hace position: relative', () => {
    expect(renderToStaticMarkup(<FileUpload anchored />)).toContain('data-anchored=""')
    const i = css.indexOf("[data-sk='file-upload'][data-anchored] {")
    expect(i).toBeGreaterThanOrEqual(0)
    expect(css.slice(i, css.indexOf('}', i))).toContain('position: relative')
  })
  test('sin anchored no cambia nada', () => {
    expect(renderToStaticMarkup(<FileUpload />)).not.toContain('data-anchored')
  })
})
