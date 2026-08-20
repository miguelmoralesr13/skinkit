import { defineConfig } from 'tsup'

// Solo compila el JS/TS + types de los componentes headless.
// El CSS (tokens + skins) se envía tal cual desde src/styles — es CSS externo,
// no se inyecta en runtime ni se hashea (a propósito: así el consumidor lo overridea).
export default defineConfig({
  // `skinkit/form` (DynamicForm) y `skinkit/editor` (RichTextEditor) son entries aparte: sólo
  // ellos arrastran sus propias deps (react-hook-form/zod / Tiptap), el core (src/index.ts)
  // sigue cero-deps.
  entry: [
    'src/index.ts',
    'src/catalog/index.ts',
    'src/components/DynamicForm/index.ts',
    'src/components/RichTextEditor/index.ts',
    'src/components/FilePreviewer/office/index.tsx',
  ],
  format: ['esm'],
  // Los .d.ts los emite tsgo aparte (tsc -p tsconfig.build.json) — rollup-plugin-dts de tsup no es
  // compatible con TypeScript 7 (tsgo). Ver el script "build" en package.json.
  dts: false,
  clean: true,
  // Sin sourcemaps en el paquete publicado: apuntarían a src/*.ts que no se envía (sólo src/styles).
  sourcemap: false,
  external: [
    'react',
    'react-dom',
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    '@tiptap/core',
    '@tiptap/pm',
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/extension-image',
    '@tiptap/extension-text-align',
    '@tiptap/extension-text-style',
    '@tiptap/extension-table',
    '@tiptap/extension-placeholder',
    'docx-preview',
    'xlsx',
  ],
})
