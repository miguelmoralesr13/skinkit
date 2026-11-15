import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages, formatMessage } from '../../i18n/context'

export type FileUploadVariant = 'dropzone' | 'button'

interface UploadItem {
  id: string
  file: File
  url?: string
}

export interface FileUploadClassNames {
  label?: string
  dropzone?: string
  input?: string
  prompt?: string
  previews?: string
  preview?: string
  thumb?: string
  filename?: string
  remove?: string
  helper?: string
}

export interface FileUploadProps {
  /** Se invoca con la lista COMPLETA de archivos actuales tras cada cambio (agregar/quitar). */
  onFiles?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  label?: ReactNode
  prompt?: ReactNode
  helper?: ReactNode
  error?: boolean
  /** dropzone = zona grande (default); button = disparador compacto. */
  variant?: FileUploadVariant
  /** Muestra una grilla de previews: miniatura para imágenes, nombre para el resto, con quitar. */
  preview?: boolean
  /**
   * Opt-in. Ancla el `<input>` oculto a la propia raíz (`position: relative`, `[data-anchored]`):
   * dentro de un `Dialog` o de otro contenedor con scroll el input ya no cuelga del documento ni
   * desplaza el panel al recibir el foco. Default `false` (sin cambio).
   */
  anchored?: boolean
  className?: string
  id?: string
  /** Clases adicionales por sub-parte (aditivas, nunca reemplazan la clase base). */
  classNames?: FileUploadClassNames
}

/**
 * FileUpload (Dropzone) headless — soltar o elegir archivos. Envuelve un <input type="file">
 * oculto; maneja drag & drop y expone [data-dragging]. Con `preview` guarda los archivos y
 * muestra miniaturas (crea/libera object URLs). `variant` cambia la anatomía del disparador.
 *
 * Contrato:
 *   [data-sk="file-upload"]   [data-variant] · [data-error] · [data-anchored]   raíz
 *   [data-part="label"]       etiqueta (opcional)
 *   [data-part="dropzone"]    zona clickeable/soltar · [data-dragging] al arrastrar encima
 *   [data-part="input"]       el <input type=file> (el CSS lo oculta)
 *   [data-part="prompt"]      texto/ícono de la zona
 *   [data-part="previews"]    grilla de previews (si preview)
 *   [data-part="preview"]     [data-image]   cada archivo
 *   [data-part="thumb"]       miniatura (<img>) de una imagen
 *   [data-part="filename"]    nombre (archivos no-imagen)
 *   [data-part="remove"]      botón quitar de cada preview
 *   [data-part="helper"]      ayuda / error
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    onFiles,
    accept,
    multiple,
    disabled,
    label,
    prompt,
    helper,
    error,
    variant = 'dropzone',
    preview,
    anchored,
    className,
    id,
    classNames,
  },
  ref,
) {
  const m = useSkinkitMessages()
  const [dragging, setDragging] = useState(false)
  const [items, setItems] = useState<UploadItem[]>([])
  const idRef = useRef(0)
  const itemsRef = useRef<UploadItem[]>([])
  itemsRef.current = items
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = helper ? `${fieldId}-helper` : undefined

  // Libera los object URLs pendientes al desmontar.
  useEffect(
    () => () => {
      itemsRef.current.forEach((it) => it.url && URL.revokeObjectURL(it.url))
    },
    [],
  )

  const toItem = (file: File): UploadItem => ({
    id: `f${idRef.current++}`,
    file,
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  })

  const commit = (next: UploadItem[]) => {
    setItems(next)
    onFiles?.(next.map((it) => it.file))
  }

  const emit = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const incoming = Array.from(list).map(toItem)
    if (multiple) {
      commit([...items, ...incoming])
    } else {
      items.forEach((it) => it.url && URL.revokeObjectURL(it.url))
      commit(incoming)
    }
  }

  const remove = (rid: string) => {
    const it = items.find((x) => x.id === rid)
    if (it?.url) URL.revokeObjectURL(it.url)
    commit(items.filter((x) => x.id !== rid))
  }

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    emit(e.dataTransfer.files)
  }
  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    if (!disabled) setDragging(true)
  }
  const onDragLeave = () => setDragging(false)

  return (
    <div
      data-sk="file-upload"
      data-variant={variant}
      data-error={error ? '' : undefined}
      data-anchored={anchored ? '' : undefined}
      className={cx('sk-file-upload', className)}
    >
      {label ? (
        <label
          data-part="label"
          htmlFor={fieldId}
          className={cx('sk-file-upload__label', classNames?.label)}
        >
          {label}
        </label>
      ) : null}
      <label
        data-part="dropzone"
        data-dragging={dragging ? '' : undefined}
        htmlFor={fieldId}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cx('sk-file-upload__dropzone', classNames?.dropzone)}
      >
        <input
          ref={ref}
          id={fieldId}
          type="file"
          data-part="input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={helperId}
          onChange={(e) => emit(e.target.files)}
          className={cx('sk-file-upload__input', classNames?.input)}
        />
        <span data-part="prompt" className={cx('sk-file-upload__prompt', classNames?.prompt)}>
          {prompt ??
            (variant === 'button'
              ? m.fileUpload.chooseFiles
              : m.fileUpload.dropHint)}
        </span>
      </label>

      {preview && items.length > 0 ? (
        <div data-part="previews" className={cx('sk-file-upload__previews', classNames?.previews)}>
          {items.map((it) => (
            <div
              key={it.id}
              data-part="preview"
              data-image={it.url ? '' : undefined}
              className={cx('sk-file-upload__preview', classNames?.preview)}
            >
              {it.url ? (
                <img
                  data-part="thumb"
                  src={it.url}
                  alt={it.file.name}
                  className={cx('sk-file-upload__thumb', classNames?.thumb)}
                />
              ) : (
                <span
                  data-part="filename"
                  className={cx('sk-file-upload__filename', classNames?.filename)}
                >
                  {it.file.name}
                </span>
              )}
              <button
                type="button"
                data-part="remove"
                aria-label={formatMessage(m.fileUpload.remove, { name: it.file.name })}
                onClick={() => remove(it.id)}
                className={cx('sk-file-upload__remove', classNames?.remove)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {helper ? (
        <span data-part="helper" id={helperId} className={cx('sk-file-upload__helper', classNames?.helper)}>
          {helper}
        </span>
      ) : null}
    </div>
  )
})
