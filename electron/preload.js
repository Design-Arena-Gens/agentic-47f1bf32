const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openExternal: (url) => ipcRenderer.invoke('openExternal', url),
  isElectron: true,
});
