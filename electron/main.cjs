const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { registerIpcHandlers } = require('./ipc/index.cjs');

const isDevelopment = process.env.NODE_ENV === 'development';
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173';
const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

let mainWindow = null;

function getRendererEntry() {
  return path.join(__dirname, '../dist/index.html');
}

function openExternalUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (ALLOWED_EXTERNAL_PROTOCOLS.has(parsedUrl.protocol)) {
      shell.openExternal(url);
    }
  } catch {
    // Ignore malformed URLs from renderer windows.
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    minWidth: 800,
    minHeight: 500,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url);
    return { action: 'deny' };
  });

  if (isDevelopment) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  mainWindow.loadFile(getRendererEntry());
}

app.whenReady().then(() => {
  registerIpcHandlers(ipcMain);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
