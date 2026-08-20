// Encoder QR propio, sin dependencias — mismo criterio que el highlighter de <Code>
// (src/components/Code/highlight.ts): "liviano, sin dependencias" en vez de sumar una librería.
// Implementa ISO/IEC 18004 (modo byte, versiones 1 a 10, niveles de corrección L/M/Q/H). No es
// "el algoritmo completo de QR" (eso son 40 versiones + modos numérico/alfanumérico/kanji) — el
// modo byte cubre CUALQUIER string (UTF-8), y versión 10 a nivel L da ~250 bytes de capacidad,
// de sobra para URLs/texto corto/vCards/wifi-config, que son el caso de uso real de <QRCode>.
//
// Tablas de la spec (capacidad por versión, info de formato/versión, coordenadas de alineación)
// verificadas contra la tutorial de referencia thonky.com/qr-code-tutorial (la que usan la
// mayoría de los encoders QR de código abierto) — no inventadas de memoria.

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

// ── GF(256) — se calcula en runtime a partir del polinomio primitivo 0x11D, no se hardcodean
// 256 números mágicos (eso sería el punto real de error de transcripción). ──
const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
;(function initGF() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
})()

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a] + GF_LOG[b]]
}

/** Polinomio generador de Reed–Solomon de grado `degree`: (x-α⁰)(x-α¹)...(x-α^(degree-1)). */
function rsGeneratorPoly(degree: number): Uint8Array {
  const result = new Uint8Array(degree)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root) ^ (j + 1 < degree ? result[j + 1] : 0)
    }
    root = gfMul(root, 2)
  }
  return result
}

/** Resto de dividir `data` (codewords) por el polinomio generador — son los codewords de EC. */
function rsRemainder(data: number[], generator: Uint8Array): Uint8Array {
  const result = new Uint8Array(generator.length)
  for (const b of data) {
    const factor = b ^ result[0]
    result.copyWithin(0, 1)
    result[result.length - 1] = 0
    for (let i = 0; i < result.length; i++) {
      result[i] ^= gfMul(generator[i], factor)
    }
  }
  return result
}

// ── Tabla de capacidad — versiones 1-10 × L/M/Q/H (thonky.com/qr-code-tutorial/error-correction-table) ──
interface CapacityRow {
  totalDataCodewords: number
  ecCodewordsPerBlock: number
  group1Blocks: number
  group1DataCodewords: number
  group2Blocks: number
  group2DataCodewords: number
}
const CAPACITY: Record<ErrorCorrectionLevel, CapacityRow[]> = {
  L: [
    { totalDataCodewords: 19, ecCodewordsPerBlock: 7, group1Blocks: 1, group1DataCodewords: 19, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 34, ecCodewordsPerBlock: 10, group1Blocks: 1, group1DataCodewords: 34, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 55, ecCodewordsPerBlock: 15, group1Blocks: 1, group1DataCodewords: 55, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 80, ecCodewordsPerBlock: 20, group1Blocks: 1, group1DataCodewords: 80, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 108, ecCodewordsPerBlock: 26, group1Blocks: 1, group1DataCodewords: 108, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 136, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 68, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 156, ecCodewordsPerBlock: 20, group1Blocks: 2, group1DataCodewords: 78, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 194, ecCodewordsPerBlock: 24, group1Blocks: 2, group1DataCodewords: 97, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 232, ecCodewordsPerBlock: 30, group1Blocks: 2, group1DataCodewords: 116, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 274, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 68, group2Blocks: 2, group2DataCodewords: 69 },
  ],
  M: [
    { totalDataCodewords: 16, ecCodewordsPerBlock: 10, group1Blocks: 1, group1DataCodewords: 16, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 28, ecCodewordsPerBlock: 16, group1Blocks: 1, group1DataCodewords: 28, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 44, ecCodewordsPerBlock: 26, group1Blocks: 1, group1DataCodewords: 44, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 64, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 32, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 86, ecCodewordsPerBlock: 24, group1Blocks: 2, group1DataCodewords: 43, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 108, ecCodewordsPerBlock: 16, group1Blocks: 4, group1DataCodewords: 27, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 124, ecCodewordsPerBlock: 18, group1Blocks: 4, group1DataCodewords: 31, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 154, ecCodewordsPerBlock: 22, group1Blocks: 2, group1DataCodewords: 38, group2Blocks: 2, group2DataCodewords: 39 },
    { totalDataCodewords: 182, ecCodewordsPerBlock: 22, group1Blocks: 3, group1DataCodewords: 36, group2Blocks: 2, group2DataCodewords: 37 },
    { totalDataCodewords: 216, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 43, group2Blocks: 1, group2DataCodewords: 44 },
  ],
  Q: [
    { totalDataCodewords: 13, ecCodewordsPerBlock: 13, group1Blocks: 1, group1DataCodewords: 13, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 22, ecCodewordsPerBlock: 22, group1Blocks: 1, group1DataCodewords: 22, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 34, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 17, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 48, ecCodewordsPerBlock: 26, group1Blocks: 2, group1DataCodewords: 24, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 62, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 15, group2Blocks: 2, group2DataCodewords: 16 },
    { totalDataCodewords: 76, ecCodewordsPerBlock: 24, group1Blocks: 4, group1DataCodewords: 19, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 88, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 14, group2Blocks: 4, group2DataCodewords: 15 },
    { totalDataCodewords: 110, ecCodewordsPerBlock: 22, group1Blocks: 4, group1DataCodewords: 18, group2Blocks: 2, group2DataCodewords: 19 },
    { totalDataCodewords: 132, ecCodewordsPerBlock: 20, group1Blocks: 4, group1DataCodewords: 16, group2Blocks: 4, group2DataCodewords: 17 },
    { totalDataCodewords: 154, ecCodewordsPerBlock: 24, group1Blocks: 6, group1DataCodewords: 19, group2Blocks: 2, group2DataCodewords: 20 },
  ],
  H: [
    { totalDataCodewords: 9, ecCodewordsPerBlock: 17, group1Blocks: 1, group1DataCodewords: 9, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 16, ecCodewordsPerBlock: 28, group1Blocks: 1, group1DataCodewords: 16, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 26, ecCodewordsPerBlock: 22, group1Blocks: 2, group1DataCodewords: 13, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 36, ecCodewordsPerBlock: 16, group1Blocks: 4, group1DataCodewords: 9, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 46, ecCodewordsPerBlock: 22, group1Blocks: 2, group1DataCodewords: 11, group2Blocks: 2, group2DataCodewords: 12 },
    { totalDataCodewords: 60, ecCodewordsPerBlock: 28, group1Blocks: 4, group1DataCodewords: 15, group2Blocks: 0, group2DataCodewords: 0 },
    { totalDataCodewords: 66, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 13, group2Blocks: 1, group2DataCodewords: 14 },
    { totalDataCodewords: 86, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 14, group2Blocks: 2, group2DataCodewords: 15 },
    { totalDataCodewords: 100, ecCodewordsPerBlock: 24, group1Blocks: 4, group1DataCodewords: 12, group2Blocks: 4, group2DataCodewords: 13 },
    { totalDataCodewords: 122, ecCodewordsPerBlock: 28, group1Blocks: 6, group1DataCodewords: 15, group2Blocks: 2, group2DataCodewords: 16 },
  ],
}

const REMAINDER_BITS = [0, 7, 7, 7, 7, 7, 0, 0, 0, 0] // índice = version-1

const ALIGNMENT_COORDS: Record<number, number[]> = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
}

// 15 bits por (nivel, máscara) — thonky.com/qr-code-tutorial/format-version-tables
const FORMAT_STRINGS: Record<ErrorCorrectionLevel, string[]> = {
  L: [
    '111011111000100', '111001011110011', '111110110101010', '111100010011101',
    '110011000101111', '110001100011000', '110110001000001', '110100101110110',
  ],
  M: [
    '101010000010010', '101000100100101', '101111001111100', '101101101001011',
    '100010111111001', '100000011001110', '100111110010111', '100101010100000',
  ],
  Q: [
    '011010101011111', '011000001101000', '011111100110001', '011101000000110',
    '010010010110100', '010000110000011', '010111011011010', '010101111101101',
  ],
  H: [
    '001011010001001', '001001110111110', '001110011100111', '001100111010000',
    '000011101100010', '000001001010101', '000110100001100', '000100000111011',
  ],
}

// 18 bits, solo versión ≥7 — thonky.com/qr-code-tutorial/format-version-tables
const VERSION_STRINGS: Record<number, string> = {
  7: '000111110010010100',
  8: '001000010110111100',
  9: '001001101010011001',
  10: '001010010011010011',
}

const MASK_FNS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
]

function utf8Bytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text))
}

/** Arma el bitstream de datos: modo byte + longitud + bytes + terminador + relleno. */
function buildDataBits(bytes: number[], version: number, capacityCodewords: number): string {
  const charCountBits = version <= 9 ? 8 : 16
  let bits = '0100' + bytes.length.toString(2).padStart(charCountBits, '0')
  for (const b of bytes) bits += b.toString(2).padStart(8, '0')

  const capacityBits = capacityCodewords * 8
  const terminatorLen = Math.min(4, capacityBits - bits.length)
  bits += '0'.repeat(Math.max(0, terminatorLen))
  bits += '0'.repeat((8 - (bits.length % 8)) % 8)

  const padBytes = ['11101100', '00010001']
  let i = 0
  while (bits.length < capacityBits) {
    bits += padBytes[i % 2]
    i++
  }
  return bits.slice(0, capacityBits)
}

function bitsToBytes(bits: string): number[] {
  const out: number[] = []
  for (let i = 0; i < bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2))
  return out
}

/** Divide los codewords de datos en bloques, calcula EC por bloque, entrelaza todo. */
function buildFinalBits(dataCodewords: number[], version: number, level: ErrorCorrectionLevel): string {
  const cap = CAPACITY[level][version - 1]
  const blocks: number[][] = []
  let offset = 0
  for (let i = 0; i < cap.group1Blocks; i++) {
    blocks.push(dataCodewords.slice(offset, offset + cap.group1DataCodewords))
    offset += cap.group1DataCodewords
  }
  for (let i = 0; i < cap.group2Blocks; i++) {
    blocks.push(dataCodewords.slice(offset, offset + cap.group2DataCodewords))
    offset += cap.group2DataCodewords
  }

  const generator = rsGeneratorPoly(cap.ecCodewordsPerBlock)
  const ecBlocks = blocks.map((b) => Array.from(rsRemainder(b, generator)))

  const maxDataLen = Math.max(...blocks.map((b) => b.length))
  let interleavedData: number[] = []
  for (let i = 0; i < maxDataLen; i++) {
    for (const b of blocks) if (i < b.length) interleavedData.push(b[i])
  }
  let interleavedEc: number[] = []
  for (let i = 0; i < cap.ecCodewordsPerBlock; i++) {
    for (const b of ecBlocks) interleavedEc.push(b[i])
  }

  const allCodewords = [...interleavedData, ...interleavedEc]
  let bits = allCodewords.map((b) => b.toString(2).padStart(8, '0')).join('')
  bits += '0'.repeat(REMAINDER_BITS[version - 1])
  return bits
}

interface Grid {
  size: number
  dark: boolean[][]
  reserved: boolean[][]
}

function makeGrid(version: number): Grid {
  const size = 17 + 4 * version
  return {
    size,
    dark: Array.from({ length: size }, () => new Array(size).fill(false)),
    reserved: Array.from({ length: size }, () => new Array(size).fill(false)),
  }
}

function setModule(grid: Grid, r: number, c: number, dark: boolean) {
  grid.dark[r][c] = dark
  grid.reserved[r][c] = true
}

function drawFinder(grid: Grid, top: number, left: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = top + r
      const cc = left + c
      if (rr < 0 || rr >= grid.size || cc < 0 || cc >= grid.size) continue
      const isFinderRing = r >= 0 && r <= 6 && c >= 0 && c <= 6
      const dark =
        isFinderRing && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
      setModule(grid, rr, cc, isFinderRing ? dark : false)
    }
  }
}

function drawAlignment(grid: Grid, r: number, c: number) {
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1
      setModule(grid, r + dr, c + dc, dark)
    }
  }
}

function drawFunctionPatterns(grid: Grid, version: number) {
  const { size } = grid
  drawFinder(grid, 0, 0)
  drawFinder(grid, 0, size - 7)
  drawFinder(grid, size - 7, 0)

  // timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(grid, 6, i, i % 2 === 0)
    setModule(grid, i, 6, i % 2 === 0)
  }

  // alignment patterns (evita superponer los finders)
  const coords = ALIGNMENT_COORDS[version]
  if (coords) {
    for (const r of coords) {
      for (const c of coords) {
        const nearFinder = (r < 9 && c < 9) || (r < 9 && c > size - 9) || (r > size - 9 && c < 9)
        if (nearFinder) continue
        drawAlignment(grid, r, c)
      }
    }
  }

  // módulo oscuro fijo
  setModule(grid, size - 8, 8, true)

  // reserva de format info (el valor real se pisa después de elegir máscara)
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      grid.reserved[8][i] = true
      grid.reserved[i][8] = true
    }
  }
  for (let i = 0; i < 8; i++) {
    grid.reserved[8][size - 1 - i] = true
    grid.reserved[size - 1 - i][8] = true
  }

  // reserva de version info (v7+)
  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      grid.reserved[b][a] = true
      grid.reserved[a][b] = true
    }
  }
}

function placeData(grid: Grid, bits: string) {
  const { size } = grid
  let bitIndex = 0
  let upward = true
  for (let colPair = size - 1; colPair >= 1; colPair -= 2) {
    if (colPair === 6) colPair = 5
    for (let vert = 0; vert < size; vert++) {
      const row = upward ? size - 1 - vert : vert
      for (let j = 0; j < 2; j++) {
        const col = colPair - j
        if (grid.reserved[row][col]) continue
        const bit = bitIndex < bits.length ? bits[bitIndex] === '1' : false
        grid.dark[row][col] = bit
        bitIndex++
      }
    }
    upward = !upward
  }
}

function applyMask(grid: Grid, maskIndex: number): boolean[][] {
  const fn = MASK_FNS[maskIndex]
  return grid.dark.map((row, r) =>
    row.map((v, c) => (grid.reserved[r][c] ? v : v !== fn(r, c))),
  )
}

function penalty(matrix: boolean[][]): number {
  const size = matrix.length
  let score = 0

  // regla 1: 5+ módulos consecutivos del mismo color (filas y columnas)
  const runPenalty = (get: (i: number) => boolean) => {
    let run = 1
    let p = 0
    for (let i = 1; i < size; i++) {
      if (get(i) === get(i - 1)) run++
      else {
        if (run >= 5) p += 3 + (run - 5)
        run = 1
      }
    }
    if (run >= 5) p += 3 + (run - 5)
    return p
  }
  for (let r = 0; r < size; r++) score += runPenalty((i) => matrix[r][i])
  for (let c = 0; c < size; c++) score += runPenalty((i) => matrix[i][c])

  // regla 2: bloques 2x2 del mismo color
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c]
      if (matrix[r][c + 1] === v && matrix[r + 1][c] === v && matrix[r + 1][c + 1] === v) score += 3
    }
  }

  // regla 3: patrón tipo finder (1011101) con 4 claros pegados de un lado
  const PATTERN_A = [true, false, true, true, true, false, true, false, false, false, false]
  const PATTERN_B = [false, false, false, false, true, false, true, true, true, false, true]
  const matchAt = (get: (i: number) => boolean, start: number, pattern: boolean[]) =>
    pattern.every((v, i) => get(start + i) === v)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      if (matchAt((i) => matrix[r][i], c, PATTERN_A) || matchAt((i) => matrix[r][i], c, PATTERN_B)) score += 40
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 11; r++) {
      if (matchAt((i) => matrix[i][c], r, PATTERN_A) || matchAt((i) => matrix[i][c], r, PATTERN_B)) score += 40
    }
  }

  // regla 4: proporción de módulos oscuros
  let dark = 0
  for (const row of matrix) for (const v of row) if (v) dark++
  const percent = (dark * 100) / (size * size)
  const prev = Math.floor(percent / 5) * 5
  const next = prev + 5
  score += (Math.min(Math.abs(prev - 50), Math.abs(next - 50)) / 5) * 10

  return score
}

function placeFormatInfo(grid: Grid, level: ErrorCorrectionLevel, maskIndex: number) {
  const { size } = grid
  const bits = FORMAT_STRINGS[level][maskIndex]
  const set = (r: number, c: number, i: number) => {
    grid.dark[r][c] = bits[i] === '1'
  }
  for (let i = 0; i <= 5; i++) set(8, i, i)
  set(8, 7, 6)
  set(8, 8, 7)
  set(7, 8, 8)
  for (let i = 9; i < 15; i++) set(14 - i, 8, i)

  // Copia 2: franja vertical de 7 bits (filas size-1..size-7) — NO 8, para no pisar el módulo
  // oscuro fijo en (size-8, 8); la franja horizontal absorbe el octavo bit en su lugar.
  for (let i = 0; i <= 6; i++) set(size - 1 - i, 8, i)
  for (let i = 7; i < 15; i++) set(8, size - 15 + i, i)
}

function placeVersionInfo(grid: Grid, version: number) {
  if (version < 7) return
  const bits = VERSION_STRINGS[version]
  // Verificado bit a bit contra una implementación de referencia (npm `qrcode`): el bloque de
  // 3x6/6x3 se recorre por COLUMNA (dentro del bloque de 6, de mayor a menor) y, dentro de cada
  // columna, por FILA (dentro del bloque de 3, de mayor a menor) — no es el orden "obvio"
  // fila-mayor que uno esperaría, así que no lo simplifiques sin volver a verificar.
  for (let i = 0; i < 18; i++) {
    const bit = bits[i] === '1'
    const outer = 5 - Math.floor(i / 3) // 0..5, dentro del eje largo (6)
    const inner = grid.size - 11 + (2 - (i % 3)) // dentro del eje corto (3): size-11..size-9
    // bloque inferior-izquierdo: filas size-11..size-9, columnas 0..5
    grid.dark[inner][outer] = bit
    // bloque superior-derecho (transpuesto): filas 0..5, columnas size-11..size-9
    grid.dark[outer][inner] = bit
  }
}

export interface QRGenerateOptions {
  errorCorrectionLevel?: ErrorCorrectionLevel
}

/** Genera la matriz booleana (true = módulo oscuro) para `text`. Lanza si no entra en ninguna
 * versión soportada (1 a 10) con el nivel de corrección pedido. */
export function generateQRMatrix(text: string, opts: QRGenerateOptions = {}): boolean[][] {
  const level = opts.errorCorrectionLevel ?? 'M'
  const bytes = utf8Bytes(text)

  let version = -1
  for (let v = 1; v <= 10; v++) {
    const charCountBits = v <= 9 ? 8 : 16
    const neededBits = 4 + charCountBits + bytes.length * 8
    if (neededBits <= CAPACITY[level][v - 1].totalDataCodewords * 8) {
      version = v
      break
    }
  }
  if (version === -1) {
    throw new Error(
      `skinkit: <QRCode> — el texto es demasiado largo para el nivel de corrección "${level}" (máx. ~${CAPACITY[level][9].totalDataCodewords} bytes con nivel L). Probá un nivel más bajo o un texto más corto.`,
    )
  }

  const capacityCodewords = CAPACITY[level][version - 1].totalDataCodewords
  const dataBits = buildDataBits(bytes, version, capacityCodewords)
  const dataCodewords = bitsToBytes(dataBits)
  const finalBits = buildFinalBits(dataCodewords, version, level)

  const grid = makeGrid(version)
  drawFunctionPatterns(grid, version)
  placeData(grid, finalBits)

  let bestMask = 0
  let bestScore = Infinity
  let bestMatrix: boolean[][] = grid.dark
  for (let m = 0; m < 8; m++) {
    const candidate = applyMask(grid, m)
    const score = penalty(candidate)
    if (score < bestScore) {
      bestScore = score
      bestMask = m
      bestMatrix = candidate
    }
  }

  grid.dark = bestMatrix
  placeFormatInfo(grid, level, bestMask)
  placeVersionInfo(grid, version)

  return grid.dark
}
