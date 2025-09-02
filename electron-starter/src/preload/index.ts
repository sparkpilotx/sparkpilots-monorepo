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
    }
  }
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
