import { contextBridge } from 'electron'

// Add a placeholder API to the window object
const api = {}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
