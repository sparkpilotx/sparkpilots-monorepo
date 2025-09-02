export {}

declare global {
  interface SettingsApi {
    close: () => void
    proxy: {
      submit: (url: string) => void
    }
  }
  interface Window {
    api: {
      settings: SettingsApi
      [key: string]: unknown
    }
  }
}
