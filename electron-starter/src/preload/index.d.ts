export {}

declare global {
  interface SettingsApi {
    close: () => void
    proxy: {
      submit: (url: string) => void
      getConfig: () => Promise<{ url: string | null }>
    }
    gemini: {
      submit: (key: string) => void
      get: () => Promise<string | null>
      test: (key?: string) => Promise<{ ok: boolean; error?: string }>
    }
  }
  interface Window {
    api: {
      settings: SettingsApi
      [key: string]: unknown
    }
  }
}
