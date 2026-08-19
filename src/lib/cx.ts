import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge no conoce nuestros tokens custom (rounded-sk-pill, bg-sk-primary, etc.) por
// defecto — sin decirle el grupo semántico de cada uno, dos utilities de radio/color en conflicto
// (ej. 'rounded-sk-pill' del componente + 'rounded-none' que pisa el consumidor) quedarían AMBAS
// en el className en vez de que gane la última, como espera cualquier consumidor de Tailwind.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ['sk-sm', 'sk-md', 'sk-lg', 'sk-pill'],
      color: [
        'sk-surface',
        'sk-surface-2',
        'sk-text',
        'sk-text-muted',
        'sk-primary',
        'sk-primary-hover',
        'sk-on-primary',
        'sk-secondary',
        'sk-on-secondary',
        'sk-tertiary',
        'sk-on-tertiary',
        'sk-accent',
        'sk-on-accent',
        'sk-success',
        'sk-on-success',
        'sk-warning',
        'sk-on-warning',
        'sk-info',
        'sk-on-info',
        'sk-border',
        'sk-danger',
        'sk-on-danger',
      ],
    },
  },
})

/** Une clases y resuelve conflictos de utilities Tailwind (gana la última). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return twMerge(parts.filter(Boolean).join(' '))
}
