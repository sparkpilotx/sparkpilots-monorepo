import { app, shell, BrowserWindow, Menu } from 'electron'
import { join } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'
import { configureGlobalUndiciProxy, hasStoredProxyUrl } from './network/proxy'
import { openSettingsWindow } from './settings-window'

function createWindow(): BrowserWindow {
  const ASPECT_RATIO = 16 / 9
  const MIN_WIDTH = 800
  const INITIAL_WIDTH = 900

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: INITIAL_WIDTH,
    height: Math.round(INITIAL_WIDTH / ASPECT_RATIO),
    minWidth: MIN_WIDTH,
    minHeight: Math.round(MIN_WIDTH / ASPECT_RATIO),
    maximizable: false,
    fullscreenable: false,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: is.dev
    }
  })

  // Set aspect ratio after creating the window to bypass faulty types
  mainWindow.setAspectRatio(ASPECT_RATIO)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('console-message', event => {
    console.log(`[Renderer Console] ${event.message}`)
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return mainWindow
}

function buildAppMenu(getMain: () => BrowserWindow | undefined): void {
  const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] =
    [
      {
        label: app.name,
        submenu: [
          {
            label: 'Preferences…',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              const win = getMain()
              if (win) openSettingsWindow(win)
            }
          },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        role: 'editMenu'
      }
    ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  configureGlobalUndiciProxy()
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  let mainWindow = createWindow()
  buildAppMenu(() => mainWindow)
  if (!hasStoredProxyUrl()) {
    openSettingsWindow(mainWindow)
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow()
  })
})
