# Changelog

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
