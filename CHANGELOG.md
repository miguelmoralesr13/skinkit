# Changelog

## 0.8.1

- `NumberInput` acepta `aria-label` y `aria-labelledby` y los pone en el `<input>` real: antes se
  descartaban y un campo sin `label` visible (una cantidad dentro de una fila) quedaba sin nombre
  para lectores de pantalla. Props opcionales; sin ellas el comportamiento es el mismo.
- Primera prueba de la librería (`bun run test`, `bun test src`, con `react-dom/server`).

## 0.8.0

- Nuevo `ChipGroup`: selección con chips en forma de píldora (una o varias), construido sobre `Toggle`.
- `ToggleTone` ahora se exporta desde la raíz.
