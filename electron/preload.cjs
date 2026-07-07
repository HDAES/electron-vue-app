const { contextBridge, ipcRenderer } = require('electron');

const runtimeVersions = Object.freeze({
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron
});

const electronAPI = Object.freeze({
  platform: process.platform,
  versions: runtimeVersions,
  ping: async () => String(await ipcRenderer.invoke('ping'))
});

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
