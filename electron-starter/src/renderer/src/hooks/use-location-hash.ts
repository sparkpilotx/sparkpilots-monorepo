import { useSyncExternalStore } from 'react'

export function useLocationHash(): string {
  return useSyncExternalStore(
    (cb: () => void) => {
      window.addEventListener('hashchange', cb)
      return () => window.removeEventListener('hashchange', cb)
    },
    () => window.location.hash,
    () => '#'
  )
}
