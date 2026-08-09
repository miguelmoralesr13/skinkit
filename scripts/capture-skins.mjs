/**
 * capture-skins.mjs — toma UNA captura por componente mostrando TODAS las skins a la vez
 * (modo "comparar skins" del playground) y las guarda en skin-shots/.
 *
 *   bun run shots            # todos los componentes
 *   bun run shots Button Stat EmptyState   # sólo esos (match por substring, case-insensitive)
 *
 * NO valida nada — no juzga pass/fail. Sólo genera las imágenes para que la verificación sea
 * VISUAL: abrís/leés las capturas y confirmás que cada skin le da forma propia a cada componente
 * y que ninguna skin coincide con otra ni con soft.
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
const OUT = join(ROOT, 'skin-shots')
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
  const page = await browser.newPage({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 2 })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForFunction('!!window.__skinkitPlayground', null, { timeout: 15000 })

  // activar modo comparar (renderiza el componente en todas las skins a la vez)
  await page.evaluate('window.__skinkitPlayground.setCompare(true)')
  await page.evaluate("window.__skinkitPlayground.setTheme('paper')")
  await sleep(300)

  const count = await page.evaluate('window.__skinkitPlayground.count')
  let saved = 0
  for (let i = 0; i < count; i++) {
    const name = await page.evaluate(`window.__skinkitPlayground.name(${i})`)
    if (filters.length && !filters.some((f) => name.toLowerCase().includes(f))) continue
    await page.evaluate(`window.__skinkitPlayground.select(${i})`)
    // esperar a que el grid de comparación pinte el componente elegido
    await page.waitForSelector('.sb-compare', { timeout: 5000 })
    await sleep(350)
    const grid = page.locator('.sb-compare')
    const file = join(OUT, `${String(i + 1).padStart(2, '0')}-${name}.png`)
    await grid.screenshot({ path: file })
    saved++
    console.log(`  ✓ ${name}`)
  }

  await browser.close()
  if (startedServer && server) server.kill()

  console.log(`\n✔ ${saved} capturas en ${OUT}`)
  console.log('  ' + readdirSync(OUT).slice(0, 3).join(', ') + (saved > 3 ? ', …' : ''))
  console.log('\nVerificación VISUAL: abrí las imágenes. Cada una muestra el componente en las 6 skins')
  console.log('(soft/brutal/minimal/glass/retro/elevated). Ninguna skin debe coincidir con otra ni con soft.')
}

main().catch((err) => {
  console.error(err)
  if (server) server.kill()
  process.exit(1)
})
