import type { JSX } from 'react'
import { useEffect, useState } from 'react'

export function SettingsScreen(): JSX.Element {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const cfg: { url: string | null } =
          await window.api.settings.proxy.getConfig()
        if (cfg) setUrl(cfg.url ?? '')
      } catch {
        setUrl('')
      }
    })()
  }, [])

  return (
    <div className="h-screen bg-neutral-100 p-6 font-sans text-neutral-800 antialiased">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Settings
      </h1>
      <h2 className="mt-4 text-base font-semibold">Network</h2>

      <form
        className="mt-4 flex gap-2"
        onSubmit={e => {
          e.preventDefault()
          const el = e.currentTarget.elements.namedItem(
            'url'
          ) as HTMLInputElement | null
          const urlValue = el?.value ?? ''
          window.api.settings.proxy.submit(urlValue)
        }}
      >
        <input
          type="text"
          name="url"
          placeholder="http://user:pass@host:port"
          className="flex-1 rounded border border-neutral-300 px-3 py-2"
          value={url}
          onChange={e => setUrl(e.currentTarget.value)}
          required
        />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-white"
        >
          Save & Apply
        </button>
      </form>

      <button
        className="mt-3 text-sm text-neutral-600 underline"
        onClick={() => {
          window.api.settings.close()
        }}
      >
        Close
      </button>
    </div>
  )
}
