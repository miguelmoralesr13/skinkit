import { useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import { read, utils } from 'xlsx'
import type { FileKind, PreviewFile } from '../../../lib/fileKind'
import type { PreviewRenderer } from '../FilePreviewer'
import { useSkinkitMessages } from '../../../i18n/context'

// Subpath opt-in `skinkit/file-preview-office` — arrastra docx-preview/xlsx (peerDependencies
// opcionales, ver package.json). El core `FilePreviewer`/`skinkit` sigue cero-deps: sin esto,
// word/excel caen al panel de fallback genérico (ícono + descarga). Uso:
//   import { officeRenderers } from 'skinkit/file-preview-office'
//   <FilePreviewer files={...} renderers={officeRenderers} />

type Status = 'loading' | 'loaded' | 'error'

function WordPreview({ file }: { file: PreviewFile }) {
  const m = useSkinkitMessages()
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(file.url)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled || !containerRef.current) return
        return renderAsync(blob, containerRef.current)
      })
      .then(() => {
        if (!cancelled) setStatus('loaded')
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('skinkit: FilePreviewer no pudo renderizar el .docx', file.url, err)
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [file.url])

  return (
    <div data-part="office-word">
      {status === 'loading' ? <p data-part="loading">{m.filePreviewer.loading}</p> : null}
      {status === 'error' ? <p data-part="loading">No se pudo cargar el documento.</p> : null}
      <div ref={containerRef} />
    </div>
  )
}

function ExcelPreview({ file }: { file: PreviewFile }) {
  const m = useSkinkitMessages()
  const [status, setStatus] = useState<Status>('loading')
  const [rows, setRows] = useState<unknown[][]>([])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(file.url)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (cancelled) return
        const book = read(buffer)
        const sheet = book.Sheets[book.SheetNames[0]]
        const data = utils.sheet_to_json<unknown[]>(sheet, { header: 1 })
        setRows(data)
        setStatus('loaded')
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('skinkit: FilePreviewer no pudo renderizar el .xlsx', file.url, err)
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [file.url])

  if (status === 'loading') return <p data-part="loading">{m.filePreviewer.loading}</p>
  if (status === 'error') return <p data-part="loading">No se pudo cargar la planilla.</p>

  return (
    <table data-part="office-excel">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell == null ? '' : String(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const officeRenderers: Partial<Record<FileKind, PreviewRenderer>> = {
  word: (file) => <WordPreview file={file} />,
  excel: (file) => <ExcelPreview file={file} />,
}
