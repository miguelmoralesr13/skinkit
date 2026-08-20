import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <FilePreviewer>. Actualizar SIEMPRE que cambie FilePreviewer.tsx. */
export const filePreviewerSpec: ComponentSpec = {
  name: 'FilePreviewer',
  dataSk: 'file-previewer',
  category: 'Overlay',
  description:
    'Modal de vista previa de archivos (imagen/video/audio/pdf/código, con fallback ícono+descarga para lo no reconocido) con navegación anterior/siguiente sobre una lista. Compone <Dialog> por dentro — reusa su contrato de parts (portal/overlay/panel/header/title/body/footer/close).',
  props: [
    { name: 'files', type: 'PreviewFile[]', required: true, description: 'Lista de archivos ({ url, name, size?, type? }). Con 1 solo, prev/next no se renderizan.' },
    { name: 'open', type: 'boolean', required: true, description: 'Controla si el modal está abierto.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Se invoca al pedir cierre (Esc, overlay, botón de cierre).' },
    { name: 'index', type: 'number', required: false, description: 'Posición activa en la galería, controlada.' },
    { name: 'defaultIndex', type: 'number', required: false, default: '0', description: 'Posición inicial, no controlada.' },
    { name: 'onIndexChange', type: '(index: number) => void', required: false, description: 'Se llama al navegar (prev/next).' },
    { name: 'renderers', type: 'Partial<Record<FileKind, (file: PreviewFile) => ReactNode>>', required: false, description: 'Reemplaza o agrega el renderer de un tipo (image/video/audio/pdf/code/word/excel/unknown). Word/Excel no traen renderer por defecto — ver skinkit/file-preview-office.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", required: false, default: "'lg'", description: 'Tamaño del modal (prop de Dialog).' },
    { name: 'downloadText', type: 'string', required: false, default: "'Descargar'", description: 'Texto del botón de descarga.' },
  ],
  parts: [
    { name: 'root', description: 'Reusa el contrato completo de Dialog ([data-sk=dialog], overlay/panel/header/title/body/footer/close) — mismo criterio que ConfirmDialog/PromptDialog. Además, [data-sk=file-previewer] cae sobre el mismo elemento que [data-part=panel] de Dialog (scope propio para las partes nuevas de abajo).' },
    { name: 'pdf-frame', description: '[data-part=pdf-frame]: <iframe> con el visor nativo de PDF del navegador (renderer default de "pdf").' },
    { name: 'fallback', description: '[data-part=fallback]: panel para tipos sin preview real (word/excel/unknown, o código que no cargó) — ícono + nombre + tamaño + descargar.' },
    { name: 'fallback-icon', description: '[data-part=fallback-icon]: ícono SVG del tipo de archivo (ver src/components/FilePreviewer/fileIcons.tsx).' },
    { name: 'fallback-name', description: '[data-part=fallback-name]: nombre del archivo en el panel de fallback.' },
    { name: 'prev / next', description: '[data-part=prev]/[data-part=next]: navegación de galería. NO se renderizan (no solo disabled) cuando `files.length <= 1`.' },
    { name: 'download', description: '[data-part=download]: <a download> nativo del archivo activo.' },
    { name: 'size', description: '[data-part=size]: tamaño formateado (formatBytes) del archivo activo.' },
  ],
  examples: [
    {
      title: 'Un solo archivo',
      code: "import { FilePreviewer } from 'skinkit'\n\n<FilePreviewer\n  open={open}\n  onClose={() => setOpen(false)}\n  files={[{ url: '/foto.jpg', name: 'foto.jpg', size: 240_000, type: 'image/jpeg' }]}\n/>",
    },
    {
      title: 'Galería con navegación',
      code: "<FilePreviewer\n  open={open}\n  onClose={() => setOpen(false)}\n  files={archivos}\n  index={index}\n  onIndexChange={setIndex}\n/>",
    },
    {
      title: 'Renderer personalizado',
      code: "<FilePreviewer\n  open={open}\n  onClose={() => setOpen(false)}\n  files={archivos}\n  renderers={{\n    pdf: (file) => <MiVisorPdf src={file.url} />,\n  }}\n/>",
    },
    {
      title: 'Word/Excel con skinkit/file-preview-office',
      code: "import { FilePreviewer } from 'skinkit'\nimport { officeRenderers } from 'skinkit/file-preview-office'\n\n<FilePreviewer open={open} onClose={() => setOpen(false)} files={archivos} renderers={officeRenderers} />",
    },
  ],
  usage: [
    'Detecta el tipo por `type` (MIME) o, si falta, por la extensión de `name` — no hace falta pasarlo si la URL/nombre ya lo deja claro.',
    'La prop `renderers` es la vía de personalización de QUÉ se muestra (podés reemplazar cualquier tipo, incluso los que ya tienen renderer por defecto); el CSS del componente es la vía de personalización de CÓMO se ve.',
    'Word/Excel muestran el panel de fallback (ícono + descarga) por defecto — para preview real, instalá los peer deps opcionales y pasá `renderers={officeRenderers}` desde `skinkit/file-preview-office`.',
  ],
  a11y: [
    'Hereda el focus trap, cierre con Esc, scroll lock y ARIA (role=dialog, aria-modal) de Dialog — no hay nada adicional que cablear.',
  ],
}
