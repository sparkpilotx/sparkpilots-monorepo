import { contextBridge, ipcRenderer } from 'electron'

// Expose a stable API surface on window.api
const api = {
  settings: {
    close() {
      ipcRenderer.send('settings:close')
    },
    proxy: {
      submit(url: string) {
        ipcRenderer.send('settings:proxy:submit', url)
      },
      async getConfig() {
        return ipcRenderer.invoke('settings:proxy:get-config')
      }
    },
    gemini: {
      submit(key: string) {
        ipcRenderer.send('settings:gemini:submit', key)
      },
      async get() {
        return ipcRenderer.invoke('settings:gemini:get')
      },
      async test(key?: string) {
        return ipcRenderer.invoke('settings:gemini:test', key ?? '')
      }
    }
  }
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
