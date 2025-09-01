import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow(): void {
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
      sandbox: true // `sandbox: true` requires CJS preload script
    }
  })

  // Set aspect ratio after creating the window to bypass faulty types
  mainWindow.setAspectRatio(ASPECT_RATIO)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('console-message', (event) => {
    console.log(`[Renderer Console] ${event.message}`)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
