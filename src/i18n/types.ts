/**
 * Todos los textos que la librería emite por defecto (aria-labels, placeholders, botones de
 * diálogos, textos de vacío…), agrupados por componente. Es la forma que tienen los diccionarios
 * `es`/`en` y lo que acepta `<SkinkitProvider messages>` (parcial) para pisar cualquiera.
 *
 * Los que interpolan usan placeholders `{nombre}` — se resuelven con `formatMessage()`.
 * Regla: ningún componente hardcodea un string visible/accesible; si necesita uno nuevo, se agrega
 * acá y en AMBOS diccionarios en el mismo cambio.
 */
export interface SkinkitMessages {
  alert: { close: string }
  backTop: { label: string }
  banner: { close: string }
  breadcrumb: { label: string }
  bottomNav: { submenu: string }
  calendar: { previousMonth: string; nextMonth: string }
  carousel: { label: string; previous: string; next: string; goToSlide: string; slides: string }
  checkboxCardGroup: { label: string }
  code: { copy: string; copied: string }
  copyButton: { copy: string; copied: string }
  combobox: { empty: string }
  commandMenu: { label: string; placeholder: string; empty: string }
  comparisonSlider: { label: string }
  dataTable: {
    empty: string
    filterPlaceholder: string
    selectRow: string
    selectAll: string
    selectCard: string
    search: string
    viewAsCards: string
    viewAsTable: string
    cards: string
    table: string
    rowsPerPage: string
    previousPage: string
    nextPage: string
  }
  datePicker: { placeholder: string }
  dateRangePicker: { placeholder: string }
  dialog: { close: string; alertAction: string; confirm: string; cancel: string; promptConfirm: string }
  dynamicForm: { submit: string; add: string; remove: string }
  editable: { placeholder: string }
  filePreviewer: { download: string; previous: string; next: string; loading: string }
  fileUpload: { chooseFiles: string; dropHint: string; remove: string }
  flow: { zoomIn: string; zoomOut: string; fitView: string; resetView: string }
  list: { empty: string; search: string; filterPlaceholder: string }
  /** Compartido por AudioPlayer y VideoPlayer. */
  mediaPlayer: {
    play: string
    pause: string
    skipBack: string
    skipForward: string
    mute: string
    unmute: string
    playbackRate: string
    volume: string
    seek: string
    fullscreen: string
    exitFullscreen: string
    pip: string
    exitPip: string
  }
  multiSelect: { empty: string; remove: string }
  numberInput: { increment: string; decrement: string }
  pagination: { label: string; previous: string; next: string; page: string }
  passwordInput: { show: string; hide: string }
  pinInput: { digit: string }
  popconfirm: { confirm: string; cancel: string }
  qrCode: { label: string }
  radioCardGroup: { label: string }
  rating: { label: string }
  richTextEditor: {
    align: string
    textColor: string
    bulletList: string
    orderedList: string
    blockquote: string
    codeBlock: string
    horizontalRule: string
    blockStyle: string
    undo: string
    redo: string
    bold: string
    italic: string
    underline: string
    strike: string
    paragraph: string
    heading1: string
    heading2: string
    heading3: string
    image: string
    insertImage: string
    insert: string
    link: string
    editLink: string
    insertLink: string
    insertTable: string
    tableControls: string
    imageUrl: string
    linkUrl: string
    update: string
    addRow: string
    removeRow: string
    addColumn: string
    removeColumn: string
    deleteTable: string
  }
  segmentedControl: { label: string }
  sidebar: { toggle: string }
  spinner: { label: string }
  splitButton: { moreActions: string }
  tag: { remove: string }
  tagInput: { remove: string }
  toast: { close: string }
  topbar: { openMenu: string }
  tour: { close: string }
}

/** Versión recursivamente opcional de `SkinkitMessages` — lo que acepta `<SkinkitProvider messages>`. */
export type SkinkitMessagesOverrides = {
  [K in keyof SkinkitMessages]?: Partial<SkinkitMessages[K]>
}

/** Idiomas con diccionario incluido en la librería. Cualquier otro `locale` cae a `es`. */
export type SkinkitBuiltinLocale = 'es' | 'en'
