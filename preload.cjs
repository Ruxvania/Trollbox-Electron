const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload Script active");

contextBridge.exposeInMainWorld('electronAPI', {
	onSocketReceive: (callback) => ipcRenderer.on('socketReceive', (_event, value) => callback(value))
});