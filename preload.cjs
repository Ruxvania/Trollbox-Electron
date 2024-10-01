const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload Script active");

contextBridge.exposeInMainWorld('electronAPI', {
	onSocketReceive: function(callback) {
		ipcRenderer.on('socketReceive', (_event, value) => callback(value))
	},
	socketEmit: function(...data) {
		ipcRenderer.send('socketEmit', data);
	}
});