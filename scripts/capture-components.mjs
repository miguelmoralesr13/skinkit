/**
 * capture-components.mjs — toma UNA captura por componente (el único look que ships hoy) y las
 * guarda en component-shots/.
 *
 *   bun run shots            # todos los componentes
 *   bun run shots Button Stat EmptyState   # sólo esos (match por substring, case-insensitive)
 *
 * NO valida nada — no juzga pass/fail. Sólo genera las imágenes para revisión VISUAL de
 * regresión: al tocar el CSS de un componente, corré esto y comparalo contra la última captura
 * commiteada para confirmar que sigue viéndose bien (mismo espíritu que el viejo
 * capture-skins.mjs, pero ya no hay 15 looks que comparar entre sí — sólo uno).
 *
 * Usa el Chrome instalado del sistema (channel 'chrome') vía Playwright — no descarga navegador.
 * Levanta el dev server de Vite si no está corriendo en :3200, y lo apaga al terminar.
 */
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 3200
const URL = `http://localhost:${PORT}/`
const OUT = join(ROOT, 'component-shots')
const filters = process.argv.slice(2).map((s) => s.toLowerCase())

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function isUp() {
  try {
    const res = await fetch(URL, { method: 'HEAD' })
    return res.ok || res.status === 200
  } catch {
    return false
  }
}

async function waitUp(timeoutMs) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    if (await isUp()) return true
    await sleep(400)
  }
  return false
}

let server
async function ensureServer() {
  if (await isUp()) {
    console.log('▶ dev server ya está corriendo en', URL)
    return false
  }
  console.log('▶ levantando dev server (vite)…')
  server = spawn('bun', ['run', 'dev'], { cwd: ROOT, stdio: 'ignore' })
  if (!(await waitUp(30000))) throw new Error('El dev server no respondió en :3200 a tiempo')
  return true
}

async function main() {
  const startedServer = await ensureServer()
  // Sólo se limpia toda la carpeta en una corrida COMPLETA; con filtro se conservan las demás
  // capturas (correr `bun run shots Button` no debe borrar el resto del catálogo).
  if (!filters.length) rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })

  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForFunction('!!window.__skinkitPlayground', null, { timeout: 15000 })

  const count = await page.evaluate('window.__skinkitPlayground.count')
  let saved = 0
  for (let i = 0; i < count; i++) {
    const name = await page.evaluate(`window.__skinkitPlayground.name(${i})`)
    if (filters.length && !filters.some((f) => name.toLowerCase().includes(f))) continue
    await page.evaluate(`window.__skinkitPlayground.select(${i})`)
    await page.waitForSelector('.sb-stage', { timeout: 5000 })
    await sleep(250)
    const stage = page.locator('.sb-canvas')
    const file = join(OUT, `${String(i + 1).padStart(2, '0')}-${name}.png`)
    await stage.screenshot({ path: file })
    saved++
    console.log(`  ✓ ${name}`)
  }

  await browser.close()
  if (startedServer && server) server.kill()

  console.log(`\n✔ ${saved} capturas en ${OUT}`)
  console.log('  ' + readdirSync(OUT).slice(0, 3).join(', ') + (saved > 3 ? ', …' : ''))
  console.log('\nVerificación VISUAL: abrí las imágenes y confirmá que cada componente se ve bien —')
  console.log('con forma real (no "crudo"/sin estilo) y sin roturas de layout.')
}

main().catch((err) => {
  console.error(err)
  if (server) server.kill()
  process.exit(1)
})
