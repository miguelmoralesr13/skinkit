/**
 * generate-catalog-files.mjs — parte dist/catalog/index.js (el bundle único que arma tsup) en un
 * archivo .json por componente, dist/catalog/components/<Name>.json, + un índice liviano
 * dist/catalog/components/_index.json (name/dataSk/category de los ~106, nada de props/parts).
 *
 * Por qué existe: lo único que se publica hoy en npm es el bundle único (dist/catalog/index.js,
 * ~294 KB) — un agente que consume skinkit desde node_modules no puede simplemente `Read` el
 * catalog.ts de un componente puntual (esos .ts sólo existen en el repo fuente de lib-skinkit,
 * no en lo que se instala), y llamar getComponentSpec() a mano requiere correr JS. Con esta
 * carpeta, cualquier agente en cualquier app que tenga `skinkit` instalado hace un `Read` directo
 * de archivo — sin ejecutar nada, sin necesitar el repo fuente cerca. Ver skill `skinkit-usage`
 * (Critical Pattern 3) y `skinkit-screen-pipeline` (Fase 2b) para cómo se usa esto en la práctica.
 *
 * Corre DESPUÉS de tsup en el script "build" — necesita dist/catalog/index.js ya generado.
 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { COMPONENT_CATALOG } from '../dist/catalog/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'dist', 'catalog', 'components')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const index = []
for (const spec of COMPONENT_CATALOG) {
  writeFileSync(join(OUT, `${spec.name}.json`), JSON.stringify(spec, null, 2) + '\n')
  index.push({ name: spec.name, dataSk: spec.dataSk, category: spec.category })
}
writeFileSync(join(OUT, '_index.json'), JSON.stringify(index, null, 2) + '\n')

console.log(`generate-catalog-files: ${COMPONENT_CATALOG.length} componentes → dist/catalog/components/`)
