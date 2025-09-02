import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { configureGlobalUndiciProxy, saveProxyUrl } from './network/proxy'

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
    configureGlobalUndiciProxy(url)
  }
  const close = () => settingsWindow.close()

  ipcMain.on('settings:proxy:submit', submitProxy)
  ipcMain.on('settings:close', close)

  settingsWindow.on('closed', () => {
    ipcMain.off('settings:proxy:submit', submitProxy)
    ipcMain.off('settings:close', close)
    settingsWindowRef.current = null
  })
}
