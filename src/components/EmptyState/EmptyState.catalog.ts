import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <EmptyState>. Actualizar SIEMPRE que cambie EmptyState.tsx. */
export const emptyStateSpec: ComponentSpec = {
  name: 'EmptyState',
  dataSk: 'empty',
  category: 'Display',
  description:
    'Mensaje para cuando no hay contenido (lista vacía, sin resultados de búsqueda, primer uso). Ícono + título + descripción + acciones opcionales. La forma la da el skin.',
  extends: 'Omit<HTMLAttributes<HTMLDivElement>, "title">',
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Frase principal (ej. "Sin resultados").' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Texto de apoyo que explica o sugiere una acción.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Ícono o ilustración arriba del título.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Acciones (ej. un Button) al pie.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=empty].' },
    { name: 'icon', description: 'Ícono/ilustración (opcional).' },
    { name: 'title', description: 'Título.' },
    { name: 'description', description: 'Texto de apoyo (opcional).' },
    { name: 'actions', description: 'Acciones (children, opcional).' },
  ],
  examples: [
    {
      title: 'Sin resultados',
      code: '<EmptyState icon={<SearchIcon />} title="Sin resultados" description="Probá con otros términos.">\n  <Button variant="outlined">Limpiar filtros</Button>\n</EmptyState>',
    },
  ],
  usage: [
    'Dale al usuario una salida: incluí una acción (children) cuando tenga sentido.',
    'La descripción debe sugerir qué hacer, no solo constatar el vacío.',
    'Para carga (no vacío), usá Skeleton/Spinner; EmptyState es para "no hay nada".',
  ],
}
