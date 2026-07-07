const IPC_CHANNELS = Object.freeze({
  PING: 'ping'
});

function registerIpcHandlers(ipcMain) {
  ipcMain.removeHandler(IPC_CHANNELS.PING);
  ipcMain.handle(IPC_CHANNELS.PING, () => 'pong');
}

module.exports = { registerIpcHandlers, IPC_CHANNELS };
