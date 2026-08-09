import { defineConfig } from 'tsup'

// Solo compila el JS/TS + types de los componentes headless.
// El CSS (tokens + skins) se envía tal cual desde src/styles — es CSS externo,
// no se inyecta en runtime ni se hashea (a propósito: así el consumidor lo overridea).
export default defineConfig({
  // `skinkit/form` (DynamicForm) es un entry aparte: sólo él arrastra react-hook-form/zod,
  // el core (src/index.ts) sigue cero-deps.
  entry: ['src/index.ts', 'src/catalog/index.ts', 'src/components/DynamicForm/index.ts'],
  format: ['esm'],
  // Los .d.ts los emite tsgo aparte (tsc -p tsconfig.build.json) — rollup-plugin-dts de tsup no es
  // compatible con TypeScript 7 (tsgo). Ver el script "build" en package.json.
  dts: false,
  clean: true,
  // Sin sourcemaps en el paquete publicado: apuntarían a src/*.ts que no se envía (sólo src/styles).
  sourcemap: false,
  external: ['react', 'react-dom', 'react-hook-form', 'zod', '@hookform/resolvers'],
})
