import { createElement, type ReactNode } from 'react'

/**
 * Highlighter propio, liviano (regex, sin dependencias). Tokeniza el código y devuelve nodos
 * React: los tokens con color van en <span data-token="..."> y el COLOR lo pone el theme
 * (var(--sk-code-*)) — así el "tema" del código sigue al theme activo, sin Monaco ni Prism.
 *
 * Alcance: JS/TS bien; lenguajes con comentarios `#` (bash/py/yaml) vía `lang`. No parsea
 * gramática: es coloreado por patrones, suficiente para bloques de ejemplo.
 */

export type CodeToken = 'comment' | 'string' | 'number' | 'keyword' | 'function'

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
  'case', 'default', 'break', 'continue', 'new', 'class', 'extends', 'super', 'this', 'import',
  'from', 'export', 'async', 'await', 'yield', 'typeof', 'instanceof', 'in', 'of', 'delete',
  'void', 'try', 'catch', 'finally', 'throw', 'null', 'true', 'false', 'undefined', 'type',
  'interface', 'enum', 'implements', 'public', 'private', 'protected', 'readonly', 'static',
  'as', 'is', 'keyof', 'namespace', 'declare', 'abstract', 'get', 'set',
])

interface Rule {
  token: CodeToken | null
  re: RegExp
}

/** Reglas ordenadas; regex "sticky" (y) para probar en la posición actual. */
function rules(lang?: string): Rule[] {
  const hashComment = lang === 'bash' || lang === 'sh' || lang === 'py' || lang === 'yaml' || lang === 'yml'
  const base: Rule[] = [
    { token: null, re: /\s+/y },
    { token: 'comment', re: /\/\/[^\n]*/y },
    { token: 'comment', re: /\/\*[\s\S]*?\*\//y },
    { token: 'string', re: /`(?:\\.|[^`\\])*`/y },
    { token: 'string', re: /"(?:\\.|[^"\\])*"/y },
    { token: 'string', re: /'(?:\\.|[^'\\])*'/y },
    { token: 'number', re: /\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y },
    { token: 'ident' as unknown as CodeToken, re: /[A-Za-z_$][\w$]*/y },
    { token: null, re: /[\s\S]/y },
  ]
  if (hashComment) base.splice(1, 0, { token: 'comment', re: /#[^\n]*/y })
  return base
}

interface Tok {
  token: CodeToken | null
  value: string
}

/** Tokeniza a una lista de {token, value}. */
function tokenize(code: string, lang?: string): Tok[] {
  const rs = rules(lang)
  const out: Tok[] = []
  let pos = 0
  while (pos < code.length) {
    let matched = false
    for (const rule of rs) {
      rule.re.lastIndex = pos
      const m = rule.re.exec(code)
      if (m && m.index === pos && m[0].length > 0) {
        const raw = m[0]
        let token = rule.token
        // Un identificador es keyword, función (seguido de "(") o texto plano.
        if ((token as unknown as string) === 'ident') {
          if (KEYWORDS.has(raw)) token = 'keyword'
          else if (code[pos + raw.length] === '(') token = 'function'
          else token = null
        }
        out.push({ token, value: raw })
        pos += raw.length
        matched = true
        break
      }
    }
    if (!matched) {
      out.push({ token: null, value: code[pos] })
      pos += 1
    }
  }
  return out
}

/** Devuelve nodos React con los tokens coloreables envueltos en <span data-token>. */
export function highlight(code: string, lang?: string): ReactNode[] {
  const toks = tokenize(code, lang)
  const nodes: ReactNode[] = []
  let buffer = ''
  let key = 0
  const flush = () => {
    if (buffer) {
      nodes.push(buffer)
      buffer = ''
    }
  }
  for (const t of toks) {
    if (t.token == null) {
      buffer += t.value
    } else {
      flush()
      nodes.push(
        createElement('span', { key: key++, 'data-token': t.token }, t.value),
      )
    }
  }
  flush()
  return nodes
}
