function registerIpcHandlers(ipcMain) {
  ipcMain.handle('ping', () => 'pong');
}

module.exports = { registerIpcHandlers };
