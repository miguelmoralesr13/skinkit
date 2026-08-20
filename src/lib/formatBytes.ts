/** "512 B" | "340 KB" | "1.2 MB" — base binaria (1024) pero etiquetas B/KB/MB/GB (no "KiB"
 * IEC), igual que lo que muestra cualquier explorador de archivos del sistema operativo. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`
}
