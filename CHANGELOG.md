# Changelog

## 0.9.3

Aditiva y compatible; reúne la 0.9.2 (token `--text-sk-xs`, sin publicar aparte) y tres huecos que Caxuela halló al migrar.

- `RangeSlider`: prop opt-in `wrap` para ejes cíclicos como las horas del día. `[22, 2]` en 0–24 es de 22:00 a 02:00. `value` va en `[min, max)`, `minDistance` se mide sobre el arco y los pulgares nunca se rebasan. El riel pinta el arco partido en dos tramos (`data-part="range-wrap"`, `data-wrap` y `data-crossing` en la raíz). Sin `wrap` no cambia nada.
- `Calendar`: props opt-in `month` (mes visible controlado) y `onMonthChange(month)`: permiten navegar dos calendarios a la par o saltar a un mes. Sin ellas funciona como siempre.
- `SortableList`: en contenedores de 28rem o menos (container query) los botones Subir/Bajar/Quitar bajan a su propia fila bajo el campo, en vez de dejarlo en ~70 px. Marcado sin cambios; la raíz declara `container-type: inline-size` (no la uses en un padre que se ajuste a su contenido). `SortableList` es nuevo de 0.9.0.

## 0.9.2

Aditiva y compatible: solo agrega un escalón a la escala tipográfica.

- Token nuevo `--text-sk-xs` (0.75rem, 12px) con su `--text-sk-xs--line-height` (1rem): genera la clase
  `text-sk-xs` (tamaño + interlineado; `leading-*` sigue mandando). Antes `text-sk-xs` no existía y el texto
  heredaba el tamaño del contenedor. `--text-sk-sm/md/lg` no cambian. Un consumidor que pisa la escala por
  tema define también `--text-sk-xs` (si no, toma el valor por omisión).

## 0.9.0

Versión menor: **todo es aditivo y opt-in**. Sin activar nada, el marcado y el CSS efectivo de los componentes
existentes son los mismos que en 0.8.3 (fijado con pruebas contra una base de 0.8.3). Quien usa `^0.x` no la recibe sola.

### Componentes nuevos
- `Keypad`: teclado numérico en pantalla (dígitos, borrar, limpiar, atajos, `onSubmit`, teclado físico, `captureKeys`); emite enteros de la unidad menor, `decimals` solo afecta al display.
- `RangeSlider`: control de dos extremos (`role=slider`, teclado, arrastre, `minDistance`, partes `track`/`range`/`thumb-start`/`thumb-end`).
- `StackedBar`: barra apilada con segmentos por tono, `role="img"` con `aria-label` generado, leyenda y ancho mínimo para valores pequeños.
- `Heatmap`: matriz de calor como `<table>` accesible; intensidad por `color-mix`; celda «aún no aplica» distinta de 0; el número siempre se escribe.
- `ScheduleGrid`: rejilla filas × columnas con encabezados fijos, varias entradas por celda con `data-state`, celdas vacías accionables, scroll horizontal propio y teclado tipo grid.
- `SortableList`: lista editable y reordenable (agregar, quitar, arrastre, Subir/Bajar, Alt+flechas), numeración automática y anuncios `aria-live`.
- `LocationPicker`: selector de ubicación con pin arrastrable, radio y campos numéricos sobre teselas de proveedor inyectable (`tileUrl`/`renderTiles`); sin proveedor ni red degrada a cuadrícula + campos y no hace peticiones a terceros.

### Props nuevas (opcionales)
- `PinInput`: `autoFocus`, `onClear`, `ref` (`focus()`/`clear()`) y `keypad` (teclado en pantalla).
- `Calendar`: `mode="multiple"` (toque, arrastre, teclado) y `marks`/`markLabels`/`renderDay`.
- `Field`: `associateLabel`. `SegmentedControl`: `scrollable`. `FileUpload`: `anchored`.
- `Popover`, `DatePicker` y `DateRangePicker`: `portal` (panel en `document.body`, se voltea y recorta a la ventana).
- `Disclosure.Trigger`: `badge`. `BottomNav.Item`: `badge`. `Badge`: `variant="soft"` + `tone`.
- `Sidebar`: `flyout` (con `collapsed`, el flyout se abre al tocar/clic y por teclado).
- `ZoneCanvas`: `readOnly`, `items[].tone`, `onItemClick`; genéricos `ZoneCanvas<TItem>`, `applyItemChanges<T>`, `applyZoneChanges<T>`.
- `SkinkitProvider`: `refinements` (activa todas) y sueltas `variantPriority` (en `Button`, `variant` manda sobre el fondo y `tone` sobre el color), `scopedNav` (los items del `Sidebar` no estilan los de un `Menu` anidado), `scopedBody` (el relleno de `Card`/`Dialog` no alcanza a un `Alert` anidado) e `inheritColorScheme` (los portales copian el modo claro/oscuro). Hook `useSkinkitRefinements`.
- Tokens de grosor de borde `--border-sk-width`, `--sk-card-border-width`, `--sk-alert-border-width`, `--sk-input-field-border-width` (valor por omisión 1px: sin cambio visual).
- i18n: claves nuevas `keypad`, `rangeSlider`, `heatmap`, `locationPicker`, `scheduleGrid`, `sortableList`.

## 0.8.3

- `Checkbox`, `Radio` y `Switch` anclan su input nativo oculto (`position: relative` en la raíz). Antes el input
  absoluto se colocaba respecto a otro contenedor y, al marcar una casilla dentro de un `Dialog` con desplazamiento,
  el navegador movía el panel para enfocarlo: se perdía el encabezado, el pie subía y el diálogo quedaba en blanco.
- El panel de `Dialog` usa `overflow: clip` (antes solo `hidden`): no se puede desplazar por código; el cuerpo sigue
  desplazándose igual. Sin cambios de API.

## 0.8.2

- `Dialog` ya no re-enfoca su panel cuando el padre pasa un `onClose` nuevo en cada render: antes,
  un campo dentro del diálogo cuyo valor vive en el padre perdía el foco después de cada letra. El
  foco, el bloqueo de scroll y el teclado se preparan solo al abrir; Esc llama siempre al `onClose`
  más reciente. Sin cambios de API.
- Pruebas con DOM (happy-dom, `src/test/dom.ts`) para los componentes que se montan con
  `react-dom/client`.

## 0.8.1

- `NumberInput` acepta `aria-label` y `aria-labelledby` y los pone en el `<input>` real: antes se
  descartaban y un campo sin `label` visible (una cantidad dentro de una fila) quedaba sin nombre
  para lectores de pantalla. Props opcionales; sin ellas el comportamiento es el mismo.
- Primera prueba de la librería (`bun run test`, `bun test src`, con `react-dom/server`).

## 0.8.0

- Nuevo `ChipGroup`: selección con chips en forma de píldora (una o varias), construido sobre `Toggle`.
- `ToggleTone` ahora se exporta desde la raíz.
