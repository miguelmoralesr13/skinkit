# skinkit

Librería de componentes React **headless**: no llevan ni un solo estilo propio. Cada componente
emite estructura + un contrato de atributos estables (`data-sk`, `data-part`, `data-variant`...);
todo lo visual vive en **un único sistema de tokens + CSS Tailwind-nativo**, totalmente
personalizable pisando variables — sin forkear componentes ni elegir entre presets.

- 99 componentes (Botones, formularios, overlays, navegación, feedback, layout...)
- Un sistema de tokens (`--color-sk-*`, `--radius-sk-*`, `--shadow-sk-*`...) con valores por
  defecto listos para usar, y 100% overrideable
- Un catálogo tipado (`skinkit/catalog`) con props/parts/ejemplos de cada componente — pensado para
  generación de UI por IA, pero también sirve como referencia rápida en vez de leer el `.tsx`

## Instalación

```bash
npm install skinkit
# o
bun add skinkit
```

Peer deps: `react` y `react-dom` (>=18) son obligatorias. `react-hook-form`, `zod` y
`@hookform/resolvers` son **opcionales** — sólo hacen falta si usás `skinkit/form`
(ver [Formularios dinámicos](#formularios-dinámicos-dynamicform)); los paquetes `@tiptap/*` también
son **opcionales**, sólo hacen falta si usás `skinkit/editor`
(ver [Editor de texto enriquecido](#editor-de-texto-enriquecido-richtexteditor)); importar `skinkit`
a secas no arrastra ninguno de los dos. `tailwindcss` **no** es una dependencia obligatoria: el CSS
que se importa desde `skinkit/styles/base` ya viene compilado, funciona sin que el consumidor tenga
Tailwind instalado.

## Setup rápido

```tsx
import { SkinkitProvider, Button, Card } from 'skinkit'
import 'skinkit/styles/base'   // tokens + el CSS de cada componente, ya compilado

function App() {
  return (
    <SkinkitProvider>
      <Card>
        <Button variant="filled">Hola</Button>
      </Card>
    </SkinkitProvider>
  )
}
```

`SkinkitProvider` sólo marca la raíz del reset base (`[data-skinkit-root]`). Es opcional: si
preferís no envolver todo el árbol, alcanza con ese atributo a mano en cualquier ancestro (por
ejemplo en `<html>`).

## Personalizar el look

No hay `theme`/`skin` para elegir — hay un solo look, con valores por defecto razonables, y se
personaliza **pisando variables CSS**. Tres formas, de más a menos simple:

**1. CSS plano**, en cualquier selector que envuelva tu app:

```css
[data-skinkit-root] {
  --color-sk-primary: #db2777;
  --radius-sk-md: 4px;
}
```

**2. Tailwind arbitrary values**, si ya usás Tailwind en tu proyecto:

```tsx
<div className="[--color-sk-primary:#db2777]">
  <Button>Hola</Button>
</div>
```

**3. Extender el preset de tokens** en tu propio build de Tailwind v4, para tener las utilities de
skinkit (`bg-sk-primary`, `rounded-sk-lg`...) disponibles en tu propio código además de en los
componentes:

```css
/* tu CSS global */
@import "tailwindcss";
@import "skinkit/tailwind-preset";

@theme {
  --color-sk-primary: #db2777; /* pisa el default */
}
```

Los tokens disponibles — todos con default incluido — son:

```
--color-sk-surface  --color-sk-surface-2  --color-sk-text  --color-sk-text-muted
--color-sk-primary  --color-sk-primary-hover  --color-sk-on-primary
--color-sk-secondary/tertiary/accent/success/warning/info/danger (+ -on-* de cada uno)
--color-sk-border
--radius-sk-sm/md/lg/pill
--shadow-sk-sm/md/lg
--text-sk-sm/md/lg
--font-sk-sans/mono
```

## Componentes disponibles

Los 99 componentes cubren acción (`Button`, `ButtonGroup`, `SplitButton`...), formulario (`Input`,
`Select`, `DatePicker`, `Combobox`, `MultiSelect`, `Slider`, `Rating`...), navegación (`Tabs`,
`Breadcrumb`, `Menu`, `Sidebar`, `Stepper`...), overlays (`Dialog`, `Popover`, `Tooltip`,
`HoverCard`, `CommandMenu`, `FilePreviewer`, `Tour`...), feedback (`Toast`, `Progress`, `Skeleton`,
`EmptyState`...), display (`Card`, `Avatar`, `Badge`, `DataTable`, `Timeline`, `VideoPlayer`,
`AudioPlayer`, `QRCode`...) y layout (`Stack`, `Grid`, `Container`, `AppShell`, `Spacer`...). Todos
se importan igual:

```tsx
import { Tabs, Dialog, Select, DataTable } from 'skinkit'
```

En vez de leer cada `.tsx`, consultá el **catálogo** — es la fuente de la verdad de props, parts y
ejemplos de cada componente:

```tsx
import { COMPONENT_CATALOG, getComponentSpec, getCatalogByCategory } from 'skinkit/catalog'

getComponentSpec('Button')
// → { name, dataSk, category, description, props, parts, examples, usage, a11y }
```

O simplemente levantá el playground (`bun run dev`, puerto 3200) y navegá el catálogo agrupado por
categoría con ejemplos vivos y un panel para probar overrides de color/radio en tiempo real.

## El contrato de atributos

Esto es lo que el CSS de cada componente usa para estilar. El componente pone la estructura y el
estado; nunca el color ni la forma.

| Atributo | Qué es |
|----------|--------|
| `[data-sk="<nombre>"]` | Raíz del componente (uno por componente: `button`, `card`, `dialog`, `dynamic-form`...) |
| `[data-part="<parte>"]` | Sub-parte interna (`label`, `icon`, `header`, `trigger`, `panel`, `field`...) |
| `[data-variant]`, `[data-size]` | Variantes declaradas por props |
| `[data-state="open\|closed"]` | Estado (Accordion, Dialog, Popover...) |
| `[data-error]` | Presente (string vacío) cuando un campo de formulario está en error |
| `[data-skinkit-root]` | El wrapper del provider; scope del reset mínimo |

El set exacto de parts/variantes de un componente puntual vive en su entrada del catálogo
(`getComponentSpec('Accordion').parts`), no en esta tabla — tratala como una guía general del
patrón, no como la lista completa.

## Formularios dinámicos (`DynamicForm`)

Un formulario generado desde JSON, sobre `react-hook-form` + `zod` (autónomo: crea el `useForm` y
el schema Zod por dentro). Soporta validación condicional, mostrar/ocultar y habilitar/deshabilitar
por condición, subformularios, listas y grilla responsive. Vive en su **propio subpath** para no
arrastrar sus dependencias al core:

```bash
npm install react-hook-form zod @hookform/resolvers
```

```tsx
import { DynamicForm } from 'skinkit/form'

const schema = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', validation: [{ type: 'required' }] },
    { name: 'email', type: 'email', label: 'Email', validation: [{ type: 'required' }, { type: 'email' }] },
    { name: 'wantsNewsletter', type: 'switch', label: '¿Newsletter?' },
    {
      name: 'frequency',
      type: 'select',
      label: 'Frecuencia',
      options: [
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensual' },
      ],
      // aparece sólo si el switch está prendido, y ahí es obligatorio
      visibleWhen: { field: 'wantsNewsletter', truthy: true },
      validation: [{ type: 'required', when: { field: 'wantsNewsletter', truthy: true } }],
    },
  ],
}

<DynamicForm schema={schema} onSubmit={(values) => console.log(values)} />
```

Detalles completos (subformularios `object`, listas `array`, condiciones `and`/`or`/`not`, campos
externos vía `externalValues`) en `getComponentSpec('DynamicForm')` del catálogo.

## Editor de texto enriquecido (`RichTextEditor`)

Un editor WYSIWYG tipo Word — negrita/cursiva/subrayado/tachado, títulos, listas, cita, bloque de
código, alineación, color de texto, links, imágenes y tablas —, envolviendo
[Tiptap](https://tiptap.dev) (ProseMirror): selección, undo/redo, pegado y serialización los
resuelve Tiptap; skinkit sólo aporta la estructura, el contrato `data-sk`/`data-part` y reusa sus
propios primitivos (`Toggle`, `Button`, `Toolbar`, `SegmentedControl`, `Select`, `PromptDialog`,
`Prose`) para cada botón. Igual que `DynamicForm`, vive en su **propio subpath**:

```bash
npm install @tiptap/core @tiptap/pm @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-text-style \
  @tiptap/extension-table @tiptap/extension-placeholder
```

```tsx
import { RichTextEditor } from 'skinkit/editor'
import { useState } from 'react'

function Notas() {
  const [html, setHtml] = useState('<p>Escribí algo…</p>')
  return (
    <RichTextEditor content={html} onChange={setHtml} placeholder="Escribí algo…">
      <RichTextEditor.Toolbar>
        <RichTextEditor.BlockType />
        <RichTextEditor.Separator />
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strike />
        <RichTextEditor.Separator />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Link />
        <RichTextEditor.Image />
        <RichTextEditor.Table />
      </RichTextEditor.Toolbar>
      <RichTextEditor.TableControls />
      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
```

`DEFAULT_EXTENSIONS` (el default de la prop `extensions`) ya trae absolutamente todo — no hace
falta armar la lista de extensiones a mano para que un botón funcione; `extensions` sólo sirve para
recortar el set o sumar extensiones propias. Su CSS va incluido dentro del mismo
`skinkit/styles/base` (no hay un import de estilos separado para el editor). Lista completa de
botones/parts en
`getComponentSpec('RichTextEditor')` del catálogo.

## Vista previa de Word/Excel (`skinkit/file-preview-office`)

`FilePreviewer` (core, cero deps) ya previsualiza imagen/video/audio/PDF/código de fábrica; para
Word y Excel muestra un panel de fallback (ícono + nombre + descargar) porque renderizarlos de
verdad requiere parsear formatos binarios (docx/xlsx son zip+XML) — no algo para reinventar a
mano. Ese preview real vive en su **propio subpath opt-in**, mismo patrón que `skinkit/editor`:

```bash
npm install docx-preview xlsx
```

```tsx
import { FilePreviewer } from 'skinkit'
import { officeRenderers } from 'skinkit/file-preview-office'

<FilePreviewer
  open={open}
  onClose={() => setOpen(false)}
  files={archivos}
  renderers={officeRenderers}
/>
```

`officeRenderers` trae `word` (vía `docx-preview`, render fiel a HTML) y `excel` (vía `xlsx`/
SheetJS Community Edition — solo la primera hoja, sin fórmulas/gráficos/formato, una tabla
"básica"). Sin instalar los peers e importar esto, esos dos tipos siguen mostrando el fallback
genérico — nunca rompen, solo no tienen preview real.

## Layout responsive

Los componentes de layout (`Grid`, `Stack`, `AppShell`...) aceptan props "responsive": un valor
plano o un objeto por breakpoint (`base | sm | md | lg | xl`), que se resuelve en CSS puro (media
queries en `styles/layout.css`), sin JS de por medio:

```tsx
<Grid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
  ...
</Grid>
```

## Cambiar el CSS de un componente puntual

Si necesitás algo más que pisar tokens — cambiar cómo se ve un componente específico —, su CSS
vive en un archivo aparte y es editable sin tocar el componente en sí (esto sólo aplica si estás
trabajando sobre este repo, no como consumidor del paquete publicado):

```css
/* src/styles/components/button.css */
[data-sk='button'] {
  @apply inline-flex items-center justify-center gap-2 px-5 py-2 rounded-sk-pill
         bg-sk-primary text-sk-on-primary;
}
```

Ver el skill `skinkit-tokens` para la receta completa.

## Desarrollo local (playground)

Sólo si estás clonando este repo para explorarlo o contribuir (no hace falta para consumir el
paquete publicado):

```bash
bun install     # o npm install
bun run dev     # vite, http://localhost:3200
```

Muestra el catálogo completo agrupado por categoría, con un panel de override de tokens en vivo
(color primario, radio) para probar la personalización sin salir del navegador.

## Estado

99 componentes, un solo sistema de tokens Tailwind-nativo. El catálogo (`skinkit/catalog`) es la
fuente de la verdad para generación de UI asistida por IA: si un componente o prop no está ahí,
para la IA no existe.
