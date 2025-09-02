import { BrowserWindow, ipcMain } from 'electron'
import { GoogleGenAI } from '@google/genai'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import {
  loadProxyConfig,
  saveProxyUrl,
  saveGeminiApiKey,
  loadGeminiApiKey
} from './network/proxy'

const settingsWindowRef: { current: BrowserWindow | null } = { current: null }

export function openSettingsWindow(parent: BrowserWindow): void {
  if (settingsWindowRef.current && !settingsWindowRef.current.isDestroyed()) {
    if (!settingsWindowRef.current.isVisible()) settingsWindowRef.current.show()
    settingsWindowRef.current.focus()
    return
  }

  const settingsWindow = new BrowserWindow({
    parent,
    modal: true,
    show: false,
    width: 640,
    height: 420,
    resizable: false,
    minimizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: is.dev
    }
  })

  settingsWindow.once('ready-to-show', () => settingsWindow.show())
  settingsWindowRef.current = settingsWindow

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/settings')
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/settings'
    })
  }

  const submitProxy = (_: unknown, url: string) => {
    saveProxyUrl(url)
    // Renderer setting is applied via storage listeners
  }
  const submitGeminiKey = (_: unknown, key: string) => {
    saveGeminiApiKey(key)
  }
  const close = () => settingsWindow.close()

  ipcMain.on('settings:proxy:submit', submitProxy)
  ipcMain.on('settings:gemini:submit', submitGeminiKey)
  ipcMain.handle('settings:gemini:get', () => loadGeminiApiKey())
  ipcMain.handle('settings:gemini:test', async (_e, key?: string) => {
    try {
      const k =
        typeof key === 'string' && key.length > 0 ? key : loadGeminiApiKey()
      if (!k) return { ok: false, error: 'Missing GEMINI_API_KEY' }
      const ai = new GoogleGenAI({ apiKey: k, vertexai: false })
      await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: 'ping'
      })
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err)
      }
    }
  })
  ipcMain.handle('settings:proxy:get-config', () => loadProxyConfig())
  ipcMain.on('settings:close', close)

  settingsWindow.on('closed', () => {
    ipcMain.off('settings:proxy:submit', submitProxy)
    ipcMain.off('settings:gemini:submit', submitGeminiKey)
    ipcMain.removeHandler('settings:gemini:get')
    ipcMain.removeHandler('settings:gemini:test')
    ipcMain.removeAllListeners('settings:proxy:renderer-toggle')
    ipcMain.removeHandler('settings:proxy:get-config')
    ipcMain.off('settings:close', close)
    settingsWindowRef.current = null
  })
}
