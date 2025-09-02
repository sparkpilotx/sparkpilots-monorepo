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
      }
    }
  }
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
