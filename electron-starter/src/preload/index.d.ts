export {}

declare global {
  interface SettingsApi {
    close: () => void
    proxy: {
      submit: (url: string) => void
      getConfig: () => Promise<{ url: string | null }>
    }
  }
  interface Window {
    api: {
      settings: SettingsApi
      [key: string]: unknown
    }
  }
}
