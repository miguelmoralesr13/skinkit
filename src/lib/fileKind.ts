// Detección de tipo de archivo para FilePreviewer — compartido porque tanto el core
// (src/components/FilePreviewer) como el subpath opt-in (skinkit/file-preview-office) necesitan
// el mismo FileKind para decidir qué renderer usar.

export type FileKind = 'image' | 'video' | 'audio' | 'pdf' | 'code' | 'word' | 'excel' | 'unknown'

export interface PreviewFile {
  url: string
  name: string
  size?: number
  /** MIME type. Si falta (o es genérico como application/octet-stream), se infiere por extensión. */
  type?: string
}

const CODE_EXTENSIONS = new Set([
  'js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'py', 'md', 'yml', 'yaml', 'sh', 'rb', 'go',
  'java', 'c', 'cpp', 'rs', 'php', 'sql',
])
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'])
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'ogv'])
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'm4a'])

function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i < 0 ? '' : name.slice(i + 1).toLowerCase()
}

export function detectFileKind(file: PreviewFile): FileKind {
  const type = file.type
  if (type && type !== 'application/octet-stream') {
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    if (type === 'application/pdf') return 'pdf'
  }

  const ext = extOf(file.name)
  if (ext === 'pdf') return 'pdf'
  if (ext === 'doc' || ext === 'docx') return 'word'
  if (ext === 'xls' || ext === 'xlsx') return 'excel'
  if (CODE_EXTENSIONS.has(ext)) return 'code'
  if (IMAGE_EXTENSIONS.has(ext)) return 'image'
  if (VIDEO_EXTENSIONS.has(ext)) return 'video'
  if (AUDIO_EXTENSIONS.has(ext)) return 'audio'
  return 'unknown'
}

const HASH_COMMENT_LANGS: Record<string, string> = {
  py: 'py',
  sh: 'sh',
  yml: 'yaml',
  yaml: 'yaml',
}

/** Mapea la extensión al `lang` de <Code> — solo importa para distinguir comentarios `#`
 * (bash/py/yaml) del default estilo JS/TS; el resto no necesita `lang` explícito. */
export function detectCodeLang(name: string): string | undefined {
  return HASH_COMMENT_LANGS[extOf(name)]
}
