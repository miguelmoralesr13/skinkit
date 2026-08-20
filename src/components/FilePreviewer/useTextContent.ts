import { useEffect, useState } from 'react'

export interface TextContentState {
  status: 'loading' | 'loaded' | 'error'
  text: string
}

/** Trae el contenido de texto de una URL — usado por el renderer de código (<Code>). */
export function useTextContent(url: string): TextContentState {
  const [state, setState] = useState<TextContentState>({ status: 'loading', text: '' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', text: '' })
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setState({ status: 'loaded', text })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', text: '' })
      })
    return () => {
      cancelled = true
    }
  }, [url])

  return state
}
