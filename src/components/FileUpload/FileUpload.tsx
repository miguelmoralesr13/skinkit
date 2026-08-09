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

export type FileUploadVariant = 'dropzone' | 'button'

interface UploadItem {
  id: string
  file: File
  url?: string
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
  className?: string
  id?: string
}

/**
 * FileUpload (Dropzone) headless — soltar o elegir archivos. Envuelve un <input type="file">
 * oculto; maneja drag & drop y expone [data-dragging]. Con `preview` guarda los archivos y
 * muestra miniaturas (crea/libera object URLs). `variant` cambia la anatomía del disparador.
 *
 * Contrato:
 *   [data-sk="file-upload"]   [data-variant] · [data-error]   raíz
 *   [data-part="label"]       etiqueta (opcional)
 *   [data-part="dropzone"]    zona clickeable/soltar · [data-dragging] al arrastrar encima
 *   [data-part="input"]       el <input type=file> (el skin lo oculta)
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
    className,
    id,
  },
  ref,
) {
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
      className={cx('sk-file-upload', className)}
    >
      {label ? (
        <label data-part="label" htmlFor={fieldId}>
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
        />
        <span data-part="prompt">
          {prompt ??
            (variant === 'button'
              ? 'Elegir archivos'
              : 'Arrastrá archivos acá o hacé click para elegir')}
        </span>
      </label>

      {preview && items.length > 0 ? (
        <div data-part="previews">
          {items.map((it) => (
            <div key={it.id} data-part="preview" data-image={it.url ? '' : undefined}>
              {it.url ? (
                <img data-part="thumb" src={it.url} alt={it.file.name} />
              ) : (
                <span data-part="filename">{it.file.name}</span>
              )}
              <button
                type="button"
                data-part="remove"
                aria-label={`Quitar ${it.file.name}`}
                onClick={() => remove(it.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {helper ? (
        <span data-part="helper" id={helperId}>
          {helper}
        </span>
      ) : null}
    </div>
  )
})
