import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Dialog>. Actualizar SIEMPRE que cambie Dialog.tsx. */
export const dialogSpec: ComponentSpec = {
  name: 'Dialog',
  dataSk: 'dialog',
  category: 'Overlay',
  description:
    'Modal en overlay para contenido o tareas que requieren foco. Compuesto: <Dialog> con Header/Title/Body/Footer/Close. Portaliza a <body>, atrapa el foco, cierra con Esc y bloquea el scroll. Los tokens (--color-sk-*, --radius-sk-*) viven en :root, así que el look se mantiene igual dentro del portal. El colorScheme forzado en SkinkitProvider se replica automáticamente vía contexto, para que el modal no quede colgado del modo del sistema operativo.',
  extends: 'Omit<HTMLAttributes<HTMLDivElement>, "title">',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Si el diálogo está abierto. Vos controlás el estado.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Se invoca al pedir cierre (Esc, click en overlay, botón de cierre).' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'full'",
      required: false,
      default: "'md'",
      description: 'Tamaño del panel. full = pantalla completa. En drawer, controla el ancho (left/right) o el alto (top/bottom).',
    },
    {
      name: 'placement',
      type: "'center' | 'left' | 'right' | 'top' | 'bottom'",
      required: false,
      default: "'center'",
      description: 'Dónde se ancla el panel. center = modal clásico; left/right/top/bottom = drawer/sheet pegado a ese borde.',
    },
    { name: 'closeOnOverlay', type: 'boolean', required: false, default: 'true', description: 'Cerrar al hacer click en el fondo.' },
    { name: 'closeOnEsc', type: 'boolean', required: false, default: 'true', description: 'Cerrar con la tecla Escape.' },
    {
      name: 'classNames',
      type: '{ overlay?: string; panel?: string }',
      required: false,
      description:
        'Clases adicionales por parte interna (overlay/panel). Se agregan, nunca reemplazan la clase base. Para header/title/body/footer/close, pasá className directamente a <Dialog.Header>/<Dialog.Title>/etc.',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor portalizado [data-sk=dialog]. Lleva [data-size].' },
    { name: 'overlay', description: 'Fondo oscuro; cierra al click si closeOnOverlay.' },
    { name: 'panel', description: 'La tarjeta del modal (role=dialog, aria-modal).' },
    { name: 'header', description: 'Cabecera (título + cierre). <Dialog.Header>.' },
    { name: 'title', description: 'Título h2 (aria-labelledby del panel). <Dialog.Title>.' },
    { name: 'body', description: 'Cuerpo (aria-describedby del panel). <Dialog.Body>.' },
    { name: 'footer', description: 'Pie con acciones. <Dialog.Footer>.' },
    { name: 'close', description: 'Botón de cierre. <Dialog.Close>.' },
  ],
  examples: [
    {
      title: 'Header + body + footer',
      code: '<Dialog open={open} onClose={close}>\n  <Dialog.Header>\n    <Dialog.Title>Editar perfil</Dialog.Title>\n    <Dialog.Close />\n  </Dialog.Header>\n  <Dialog.Body>Formulario…</Dialog.Body>\n  <Dialog.Footer>\n    <Button variant="outlined" onClick={close}>Cancelar</Button>\n    <Button onClick={save}>Guardar</Button>\n  </Dialog.Footer>\n</Dialog>',
    },
    { title: 'Fullscreen', code: '<Dialog open={open} onClose={close} size="full"> … </Dialog>' },
    { title: 'Drawer lateral', code: '<Dialog open={open} onClose={close} placement="right"> … </Dialog>' },
  ],
  usage: [
    'Incluí SIEMPRE un <Dialog.Title> (o pasá aria-label al Dialog) para que el modal tenga nombre accesible.',
    'Vos controlás open/onClose; el Dialog no maneja su propio estado.',
    'Para confirmar una acción puntual usá ConfirmDialog; para un aviso de un solo botón, AlertDialog; para pedir un valor, PromptDialog.',
    'size="full" es fullscreen; sm/md/lg son anchos crecientes centrados.',
    'placement="left"/"right" = drawer vertical (size = ancho); "top"/"bottom" = sheet horizontal (size = alto).',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `dialog` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ dialog: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'role=dialog + aria-modal=true; foco atrapado dentro del panel mientras está abierto.',
    'Esc cierra (si closeOnEsc); al cerrar, el foco vuelve al elemento que lo abrió.',
    'Scroll del body bloqueado mientras está abierto.',
  ],
}

/** Fuente de la verdad de <ConfirmDialog>. */
export const confirmDialogSpec: ComponentSpec = {
  name: 'ConfirmDialog',
  dataSk: 'dialog',
  category: 'Overlay',
  description:
    'Diálogo de confirmación (cancelar / confirmar) construido sobre Dialog. Para acciones destructivas usá tone="danger" (botón de confirmar en rojo).',
  extends: '—',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Si está abierto.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Cancelar / cerrar (Esc, overlay, botón Cancelar).' },
    { name: 'onConfirm', type: '() => void', required: true, description: 'Acción al confirmar. Vos cerrás el diálogo después si corresponde.' },
    { name: 'title', type: 'ReactNode', required: true, description: 'La pregunta / encabezado.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Detalle o consecuencia de la acción.' },
    { name: 'confirmText', type: 'string', required: false, default: "'Confirmar' (según locale)", description: 'Texto del botón de confirmar.' },
    { name: 'cancelText', type: 'string', required: false, default: "'Cancelar' (según locale)", description: 'Texto del botón de cancelar.' },
    { name: 'tone', type: "'primary' | 'danger'", required: false, default: "'primary'", description: 'danger = acción destructiva; el confirmar se pinta en rojo.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", required: false, default: "'sm'", description: 'Tamaño del panel.' },
    { name: 'className', type: 'string', required: false, description: 'Clase adicional para la raíz. Se pasa al <Dialog> interno. No reemplaza la clase base.' },
    {
      name: 'classNames',
      type: '{ header?: string; title?: string; body?: string; footer?: string; cancelButton?: string; confirmButton?: string }',
      required: false,
      description:
        'Clases adicionales por sub-parte (header/title/body/footer/cancelButton/confirmButton). Aditivo: nunca reemplaza la clase base.',
    },
  ],
  parts: [{ name: 'root', description: 'Reusa el contrato de parts de Dialog (overlay/panel/header/title/body/footer/close).' }],
  examples: [
    {
      title: 'Confirmar borrado',
      code: '<ConfirmDialog\n  open={open}\n  onClose={() => setOpen(false)}\n  onConfirm={() => { remove(); setOpen(false) }}\n  tone="danger"\n  title="¿Eliminar proyecto?"\n  description="Esta acción no se puede deshacer."\n  confirmText="Eliminar"\n/>',
    },
  ],
  usage: [
    'Usalo para confirmaciones puntuales; para formularios/contenido rico usá Dialog directamente.',
    'tone="danger" para acciones irreversibles (eliminar, revocar): comunica el riesgo en el texto igual.',
    'onConfirm NO cierra solo: llamá onClose (o tu setter) después de confirmar.',
  ],
}

/** Fuente de la verdad de <AlertDialog>. */
export const alertDialogSpec: ComponentSpec = {
  name: 'AlertDialog',
  dataSk: 'dialog',
  category: 'Overlay',
  description:
    'Aviso de un solo botón (acuse de recibo), construido sobre Dialog. Más simple que ConfirmDialog: no hay cancelar. Para informar algo que el usuario debe ver antes de continuar.',
  extends: '—',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Si está abierto.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Cierre (Esc, overlay, botón de acuse).' },
    { name: 'title', type: 'ReactNode', required: true, description: 'Encabezado del aviso.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Detalle del mensaje.' },
    { name: 'actionText', type: 'string', required: false, default: "'Entendido' (según locale)", description: 'Texto del único botón.' },
    { name: 'tone', type: "'primary' | 'danger'", required: false, default: "'primary'", description: 'danger = botón en rojo (avisos de error).' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", required: false, default: "'sm'", description: 'Tamaño del panel.' },
    { name: 'className', type: 'string', required: false, description: 'Clase adicional para la raíz. Se pasa al <Dialog> interno. No reemplaza la clase base.' },
    {
      name: 'classNames',
      type: '{ header?: string; title?: string; body?: string; footer?: string; actionButton?: string }',
      required: false,
      description:
        'Clases adicionales por sub-parte (header/title/body/footer/actionButton). Aditivo: nunca reemplaza la clase base.',
    },
  ],
  parts: [{ name: 'root', description: 'Reusa el contrato de parts de Dialog.' }],
  examples: [
    { title: 'Aviso simple', code: '<AlertDialog open={open} onClose={() => setOpen(false)} title="Sesión expirada" description="Volvé a iniciar sesión." />' },
  ],
  usage: [
    'Para un aviso que solo se acusa (un botón). Si necesitás cancelar/confirmar, usá ConfirmDialog.',
    'tone="danger" para errores.',
  ],
}

/** Fuente de la verdad de <PromptDialog>. */
export const promptDialogSpec: ComponentSpec = {
  name: 'PromptDialog',
  dataSk: 'dialog',
  category: 'Overlay',
  description:
    'Pide un valor de texto en un diálogo, construido sobre Dialog + Input. Enter confirma; el valor llega en onConfirm(value).',
  extends: '—',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Si está abierto.' },
    { name: 'onClose', type: '() => void', required: true, description: 'Cancelar / cerrar.' },
    { name: 'onConfirm', type: '(value: string) => void', required: true, description: 'Recibe el texto ingresado al confirmar.' },
    { name: 'title', type: 'ReactNode', required: true, description: 'Encabezado.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Texto de ayuda arriba del campo.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Label del Input.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder del campo.' },
    { name: 'defaultValue', type: 'string', required: false, default: "''", description: 'Valor inicial (se resetea al abrir).' },
    { name: 'confirmText', type: 'string', required: false, default: "'Aceptar' (según locale)", description: 'Texto del botón de confirmar.' },
    { name: 'cancelText', type: 'string', required: false, default: "'Cancelar' (según locale)", description: 'Texto del botón de cancelar.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", required: false, default: "'sm'", description: 'Tamaño del panel.' },
    { name: 'className', type: 'string', required: false, description: 'Clase adicional para la raíz. Se pasa al <Dialog> interno. No reemplaza la clase base.' },
    {
      name: 'classNames',
      type: '{ header?: string; title?: string; body?: string; description?: string; footer?: string; cancelButton?: string; confirmButton?: string }',
      required: false,
      description:
        'Clases adicionales por sub-parte (header/title/body/description/footer/cancelButton/confirmButton). "description" es el <p> de ayuda dentro del body; "body" es el contenedor completo (form + Input). Aditivo: nunca reemplaza la clase base.',
    },
  ],
  parts: [{ name: 'root', description: 'Reusa el contrato de parts de Dialog; el cuerpo contiene un Input.' }],
  examples: [
    { title: 'Renombrar', code: '<PromptDialog open={open} onClose={close} onConfirm={(name) => rename(name)} title="Renombrar" label="Nuevo nombre" defaultValue={actual} />' },
  ],
  usage: [
    'Para pedir UN dato simple. Para formularios de varios campos, usá Dialog directamente.',
    'Enter en el campo confirma; onConfirm recibe el valor. Vos cerrás después.',
  ],
}
