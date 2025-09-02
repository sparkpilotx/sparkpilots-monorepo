import type { JSX } from 'react'
import { useEffect, useState } from 'react'

export function SettingsScreen(): JSX.Element {
  const [url, setUrl] = useState<string>('')
  const [geminiKey, setGeminiKey] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const cfg: { url: string | null } =
          await window.api.settings.proxy.getConfig()
        if (cfg) setUrl(cfg.url ?? '')
        const key = await window.api.settings.gemini.get()
        if (typeof key === 'string') setGeminiKey(key)
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

      <h2 className="mt-6 text-base font-semibold">AI</h2>
      <form
        className="mt-2 flex gap-2"
        onSubmit={e => {
          e.preventDefault()
          const el = e.currentTarget.elements.namedItem(
            'geminiKey'
          ) as HTMLInputElement | null
          const key = el?.value ?? ''
          window.api.settings.gemini.submit(key)
        }}
      >
        <input
          type="text"
          name="geminiKey"
          placeholder="GEMINI_API_KEY"
          className="flex-1 rounded border border-neutral-300 px-3 py-2"
          value={geminiKey}
          onChange={e => setGeminiKey(e.currentTarget.value)}
        />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-white"
        >
          Save
        </button>
        <button
          type="button"
          className="rounded bg-neutral-700 px-4 py-2 text-white"
          onClick={async () => {
            const result = await window.api.settings.gemini.test(geminiKey)
            alert(
              result.ok
                ? 'Gemini API: OK'
                : `Gemini API Error: ${result.error ?? 'Unknown'}`
            )
          }}
        >
          Test
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
