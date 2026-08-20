import {
  Download,
  File,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileType,
  type LucideProps,
} from 'lucide-react'

// Set chico de íconos para el panel de fallback de FilePreviewer — wrappers de lucide-react,
// mismo criterio que src/lib/mediaIcons.tsx. Local a este directorio: un solo consumidor
// (FilePreviewer), a diferencia de mediaIcons.tsx que comparten VideoPlayer y AudioPlayer.

type IconProps = LucideProps

const badgeDefaults: LucideProps = { size: 40, strokeWidth: 1.5 }
const smallDefaults: LucideProps = { size: 18, strokeWidth: 1.5 }

export function IconFileGeneric(props: IconProps) {
  return <File {...badgeDefaults} {...props} />
}

export function IconFilePdf(props: IconProps) {
  return <FileText {...badgeDefaults} {...props} />
}

export function IconFileWord(props: IconProps) {
  return <FileType {...badgeDefaults} {...props} />
}

export function IconFileExcel(props: IconProps) {
  return <FileSpreadsheet {...badgeDefaults} {...props} />
}

export function IconFileCode(props: IconProps) {
  return <FileCode {...badgeDefaults} {...props} />
}

export function IconDownload(props: IconProps) {
  return <Download {...smallDefaults} {...props} />
}
