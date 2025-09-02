import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { configureGlobalUndiciProxy, saveProxyUrl } from './network/proxy'

export function openSettingsWindow(parent: BrowserWindow): void {
  const child = new BrowserWindow({
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

  child.once('ready-to-show', () => child.show())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    child.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/settings')
  } else {
    child.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'settings'
    })
  }

  const submitProxy = (_: unknown, url: string) => {
    saveProxyUrl(url)
    configureGlobalUndiciProxy(url)
  }
  const close = () => child.close()

  ipcMain.on('settings:proxy:submit', submitProxy)
  ipcMain.on('settings:close', close)

  child.on('closed', () => {
    ipcMain.off('settings:proxy:submit', submitProxy)
    ipcMain.off('settings:close', close)
  })
}
