import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <FileUpload>. Actualizar SIEMPRE que cambie FileUpload.tsx. */
export const fileUploadSpec: ComponentSpec = {
  name: 'FileUpload',
  dataSk: 'file-upload',
  category: 'Formulario',
  description:
    'Zona para soltar o elegir archivos (dropzone). Envuelve un <input type="file"> oculto y maneja drag & drop; expone [data-dragging] para que el CSS resalte al arrastrar. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'onFiles', type: '(files: File[]) => void', required: false, description: 'Se invoca con la lista COMPLETA de archivos actuales tras cada cambio (agregar/quitar).' },
    { name: 'accept', type: 'string', required: false, description: 'Tipos aceptados (ej. "image/*,.pdf").' },
    { name: 'multiple', type: 'boolean', required: false, description: 'Permite varios archivos (se acumulan).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita la zona.' },
    { name: 'variant', type: "'dropzone' | 'button'", required: false, default: "'dropzone'", description: 'dropzone = zona grande; button = disparador compacto tipo botón.' },
    { name: 'preview', type: 'boolean', required: false, description: 'Muestra una grilla de previews: miniatura para imágenes, nombre para el resto, con botón de quitar. El componente guarda los archivos y maneja los object URLs.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta arriba de la zona.' },
    { name: 'prompt', type: 'ReactNode', required: false, description: 'Texto/ícono dentro de la zona.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido ([data-error]).' },
    { name: 'classNames', type: 'FileUploadClassNames', required: false, description: 'Clases adicionales por sub-parte (label, dropzone, input, prompt, previews, preview, thumb, filename, remove, helper). Aditivas: nunca reemplazan la clase base.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=file-upload]. Lleva [data-variant] y [data-error].' },
    { name: 'label', description: 'Etiqueta (opcional).' },
    { name: 'dropzone', description: 'Zona clickeable/soltar. Lleva [data-dragging] al arrastrar encima.' },
    { name: 'input', description: 'El <input type=file> (el CSS lo oculta).' },
    { name: 'prompt', description: 'Texto/ícono de la zona.' },
    { name: 'previews', description: 'Grilla de previews (si preview).' },
    { name: 'preview', description: 'Cada archivo. Lleva [data-image] si es imagen.' },
    { name: 'thumb', description: 'Miniatura (<img>) de una imagen.' },
    { name: 'filename', description: 'Nombre (archivos no-imagen).' },
    { name: 'remove', description: 'Botón quitar de cada preview.' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Con previews', code: '<FileUpload label="Fotos" accept="image/*" multiple preview onFiles={setFiles} />' },
    { title: 'Compacto', code: '<FileUpload variant="button" onFiles={setFiles} />' },
  ],
  usage: [
    'onFiles recibe la lista COMPLETA de archivos actuales (no solo el último batch) tras cada agregar/quitar.',
    'Con `preview`, el componente muestra las miniaturas y maneja los object URLs (los libera al quitar/desmontar).',
    'Sin `preview`, renderizá vos la lista (ej. un Tag por archivo).',
    'variant="button" para un disparador compacto; el drag & drop sigue funcionando igual.',
    'accept filtra en el diálogo, no valida el drop: revisá los tipos en onFiles si importa.',
  ],
  a11y: [
    'La zona es un <label> asociado al input: click y teclado (Enter/Espacio) abren el diálogo.',
    'El input queda oculto por el CSS pero accesible/focuseable.',
  ],
}
