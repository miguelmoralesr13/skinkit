import { useState, type ReactNode } from 'react'
import { Dialog, type DialogSize } from '../Dialog'
import { Image } from '../Image'
import { VideoPlayer } from '../VideoPlayer'
import { AudioPlayer } from '../AudioPlayer'
import { Code } from '../Code'
import { detectFileKind, detectCodeLang, type FileKind, type PreviewFile } from '../../lib/fileKind'
import { formatBytes } from '../../lib/formatBytes'
import { cx } from '../../lib/cx'
import { useTextContent } from './useTextContent'
import { IconFileGeneric, IconFilePdf, IconFileWord, IconFileExcel, IconFileCode, IconDownload } from './fileIcons'

// FilePreviewer NO es una familia compuesta como VideoPlayer/RichTextEditor: es un componente
// plano y declarativo (sin children, sin sub-partes estáticas), mismo molde que PromptDialog —
// compone <Dialog> por dentro. La extensibilidad que pide "personalizado" la resuelve la prop
// `renderers` (qué se muestra por tipo de archivo) + overrides de CSS (cómo se ve), no una API
// de sub-componentes: no hay evidencia de que un consumidor necesite reordenar partes sueltas
// como sí pasa con los botones de un toolbar.

export type PreviewRenderer = (file: PreviewFile) => ReactNode

export interface FilePreviewerProps {
  files: PreviewFile[]
  open: boolean
  onClose: () => void
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Reemplaza o agrega el renderer de un tipo. Ver skinkit/file-preview-office para Word/Excel
   * (sin eso, esos dos tipos caen al panel de fallback genérico: ícono + nombre + tamaño + descargar). */
  renderers?: Partial<Record<FileKind, PreviewRenderer>>
  size?: DialogSize
  downloadText?: string
  className?: string
}

const FALLBACK_ICONS: Partial<Record<FileKind, (props: object) => ReactNode>> = {
  pdf: IconFilePdf,
  word: IconFileWord,
  excel: IconFileExcel,
  code: IconFileCode,
}

function FallbackPane({ file, kind }: { file: PreviewFile; kind: FileKind }) {
  const Icon = FALLBACK_ICONS[kind] ?? IconFileGeneric
  return (
    <div data-part="fallback">
      <div data-part="fallback-icon">
        <Icon />
      </div>
      <p data-part="fallback-name">{file.name}</p>
      {file.size != null ? <p data-part="size">{formatBytes(file.size)}</p> : null}
    </div>
  )
}

function CodePreview({ file }: { file: PreviewFile }) {
  const { status, text } = useTextContent(file.url)
  if (status === 'loading') return <p data-part="loading">Cargando…</p>
  if (status === 'error') return <FallbackPane file={file} kind="code" />
  return (
    <Code block lang={detectCodeLang(file.name)} copyable>
      {text}
    </Code>
  )
}

function defaultRenderers(): Partial<Record<FileKind, PreviewRenderer>> {
  return {
    image: (file) => <Image src={file.url} alt={file.name} fit="contain" />,
    pdf: (file) => <iframe src={file.url} title={file.name} data-part="pdf-frame" />,
    video: (file) => (
      <VideoPlayer src={file.url}>
        <VideoPlayer.Controls>
          <VideoPlayer.PlayButton />
          <VideoPlayer.SkipBack />
          <VideoPlayer.SkipForward />
          <VideoPlayer.Seek />
          <VideoPlayer.Time />
          <VideoPlayer.Separator />
          <VideoPlayer.VolumeButton />
          <VideoPlayer.VolumeSlider />
          <VideoPlayer.Separator />
          <VideoPlayer.FullscreenButton />
        </VideoPlayer.Controls>
      </VideoPlayer>
    ),
    audio: (file) => (
      <AudioPlayer src={file.url}>
        <AudioPlayer.Controls>
          <AudioPlayer.PlayButton />
          <AudioPlayer.SkipBack />
          <AudioPlayer.SkipForward />
          <AudioPlayer.Seek />
          <AudioPlayer.Time />
          <AudioPlayer.Separator />
          <AudioPlayer.VolumeButton />
          <AudioPlayer.VolumeSlider />
        </AudioPlayer.Controls>
      </AudioPlayer>
    ),
    code: (file) => <CodePreview file={file} />,
  }
}

/**
 * FilePreviewer — modal de vista previa (imagen/video/audio/pdf/código, con fallback genérico
 * ícono+descarga para lo no reconocido) sobre una lista de archivos, con navegación anterior/
 * siguiente. Compone <Dialog> por dentro (headless, sin estilo propio).
 *
 * Contrato: reusa el de <Dialog> (portal/overlay/panel/header/title/body/footer/close) más:
 *   [data-part="fallback"]     panel de tipos sin preview real (ícono+nombre+tamaño+descargar)
 *   [data-part="prev"]/[data-part="next"]   navegación de galería (ausentes si hay 1 solo archivo)
 *   [data-part="download"]     <a download> del archivo activo
 *   [data-part="size"]         tamaño formateado del archivo activo
 */
export function FilePreviewer({
  files,
  open,
  onClose,
  index,
  defaultIndex = 0,
  onIndexChange,
  renderers,
  size = 'lg',
  downloadText = 'Descargar',
  className,
}: FilePreviewerProps) {
  const isControlled = index !== undefined
  const [internal, setInternal] = useState(defaultIndex)
  const current = Math.min(isControlled ? index : internal, Math.max(files.length - 1, 0))

  const go = (to: number) => {
    const next = Math.min(Math.max(to, 0), files.length - 1)
    if (!isControlled) setInternal(next)
    onIndexChange?.(next)
  }

  const file = files[current]
  if (!file) return null

  const kind = detectFileKind(file)
  const render = { ...defaultRenderers(), ...renderers }[kind]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size={size}
      className={cx('sk-file-previewer', className)}
      data-sk="file-previewer"
    >
      <Dialog.Header>
        <Dialog.Title>{file.name}</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body>{render ? render(file) : <FallbackPane file={file} kind={kind} />}</Dialog.Body>
      <Dialog.Footer>
        {files.length > 1 ? (
          <button type="button" data-part="prev" aria-label="Anterior" disabled={current <= 0} onClick={() => go(current - 1)}>
            ‹
          </button>
        ) : null}
        {file.size != null ? <span data-part="size">{formatBytes(file.size)}</span> : null}
        <a data-part="download" href={file.url} download target="_blank" rel="noopener">
          <IconDownload />
          {downloadText}
        </a>
        {files.length > 1 ? (
          <button
            type="button"
            data-part="next"
            aria-label="Siguiente"
            disabled={current >= files.length - 1}
            onClick={() => go(current + 1)}
          >
            ›
          </button>
        ) : null}
      </Dialog.Footer>
    </Dialog>
  )
}
