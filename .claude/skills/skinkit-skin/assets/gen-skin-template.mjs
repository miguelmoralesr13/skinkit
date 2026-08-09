import { readFileSync, writeFileSync } from 'node:fs'

const SRC = 'src/styles/skins/soft.css'
const css = readFileSync(SRC, 'utf8')

let i = 0
const n = css.length
const out = []

function readUntil(str) {
  const idx = css.indexOf(str, i)
  const end = idx === -1 ? n : idx + str.length
  const chunk = css.slice(i, end)
  i = end
  return chunk
}

function readBalanced() {
  // assumes css[i] === '{'; returns body WITHOUT the outer braces, advances past closing '}'
  let depth = 0
  const start = i
  for (; i < n; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') {
      depth--
      if (depth === 0) {
        const body = css.slice(start + 1, i)
        i++ // past '}'
        return body
      }
    }
  }
  return css.slice(start + 1)
}

function propsOf(body) {
  const seen = new Set()
  for (const raw of body.split(';')) {
    const seg = raw.trim()
    if (!seg || seg.startsWith('/*')) continue
    const colon = seg.indexOf(':')
    if (colon === -1) continue
    const prop = seg.slice(0, colon).trim()
    if (prop && !prop.includes('{')) seen.add(prop)
  }
  return [...seen]
}

while (i < n) {
  // skip pure whitespace
  while (i < n && /\s/.test(css[i])) i++
  if (i >= n) break

  if (css.startsWith('/*', i)) {
    const c = readUntil('*/').trim()
    // drop soft.css's own file header (redundant with our template header)
    if (!/Skin "soft"/.test(c)) out.push({ type: 'comment', text: c })
    continue
  }

  if (css.startsWith('@keyframes', i) || css.startsWith('@media', i)) {
    // capture the at-rule prelude up to '{', then balanced block; emit a note only
    const braceIdx = css.indexOf('{', i)
    const prelude = css.slice(i, braceIdx).trim()
    i = braceIdx
    readBalanced()
    out.push({ type: 'atrule', text: prelude })
    continue
  }

  // a normal rule: selector { body }
  const braceIdx = css.indexOf('{', i)
  if (braceIdx === -1) break
  const selector = css.slice(i, braceIdx).trim().replace(/'soft'/g, "'<name>'")
  i = braceIdx
  const body = readBalanced()
  out.push({ type: 'rule', selector, props: propsOf(body) })
}

// ── render ──
const header = `/**
 * Skin "<name>" — <descripción de la anatomía>.
 *   import 'skinkit/skins/<name>'
 *
 * TEMPLATE COMPLETO: tiene un stub por CADA selector de todos los componentes (generado desde el
 * skin de referencia soft.css). El cuerpo de cada regla es un comentario con las PROPIEDADES que
 * conviene definir — NO los valores (eso es tu anatomía). Reglas de oro:
 *   • Color SOLO desde el theme: var(--sk-*). Nunca hardcodees un color.
 *   • Acá va la FORMA: radius, border, shadow, spacing, tipografía, layout. Nada de comportamiento.
 *   • Cubrí los estados: [data-variant] [data-size] [data-state] [data-active] [data-error]
 *     :hover :active :disabled :focus-visible.
 *   • El orden del DOM es fijo; para reordenar visualmente usá 'order' en un flex.
 *
 * NO se estila en skins (son CSS de la base, iguales en todo skin):
 *   Layout: grid · stack · container · spacer · app-shell   ·   a11y: visually-hidden
 *
 * Animaciones: definí tus propios @keyframes si tu anatomía los necesita (soft usa, por ej.:
 * ${out.filter((o) => o.type === 'atrule').map((o) => o.text.replace('@keyframes ', '')).join(', ')}).
 */
`

let body = ''
for (const node of out) {
  if (node.type === 'comment') {
    // keep section headers (they organize by component); collapse blank lines
    body += `\n${node.text}\n`
  } else if (node.type === 'atrule') {
    // skip — noted in header
    continue
  } else {
    const hint = node.props.length ? `  /* ${node.props.join(', ')} */` : '  /* … */'
    body += `${node.selector} {\n${hint}\n}\n`
  }
}

// tidy: collapse 3+ newlines to 2
const result = (header + body).replace(/\n{3,}/g, '\n\n') + '\n'
writeFileSync('.claude/skills/skinkit-skin/assets/skin.template.css', result)
console.log('rules:', out.filter((o) => o.type === 'rule').length, 'lines:', result.split('\n').length)
