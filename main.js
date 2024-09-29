import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import io from "socket.io-client";

// Socket

export let socket = await io('wss://www.windows93.net:8086', {
	forceNew: true,
	transportOptions: {
		polling: {
			extraHeaders: {
				"Accept-Encoding": "identity",
				"Accept-Language": "en-US,en;",
				"Cache-Control": "no-cache",
				"Connection": "keep-alive",
				"Cookie": "",
				"Host": "www.windows93.net:8086",
				"Origin": "https://www.windows93.net",
				"Pragma": "no-cache",
				"Referer": 'http://www.windows93.net/trollbox/index.php',
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
			}
		}
	}
});

// Electron things

// await Menu.setApplicationMenu(null);

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			preload: path.join(import.meta.dirname, "preload.cjs"),
			devTools: true
		}
	})

	win.loadFile('index.html')

	function sendEventToWindow(name, data) {
		win.webContents.send('socketReceive', {
			name: name,
			data: data
		})
	};

	socket.removeAllListeners();

	// Connection-related events
	socket.on('connected', function (data) {
		sendEventToWindow("connected", data);
		console.log("Connected");
	});

	socket.on("connect_error", (error) => {
		sendEventToWindow("connect_error", error);
		if (!socket.active) {
			console.error(error);
			socket.connect();
		}
	});

	socket.on("disconnect", (reason) => {
		sendEventToWindow("disconnect", reason);
		if (!socket.active) {
			console.error(reason);
			socket.connect();
		}
	});

	// Trollbox events

	socket.on('update history', function (data) {
		sendEventToWindow("update history", data);
	});

	socket.on('update users', function (data) {
		sendEventToWindow("update users", data);
		console.log(data);
	});

	socket.on('user joined', function (data) {
		sendEventToWindow("user joined", data);
	});

	socket.on('user left', function (data) {
		sendEventToWindow("user left", data);
	});

	socket.on('user change nick', function (data) {
		sendEventToWindow("user change nick", data);
	});

	socket.on('message', function (data) {
		sendEventToWindow("message", data);
	});

	socket.on('cmd', function (data) {
		sendEventToWindow("cmd", data);
		console.log("Remote command received: " + data);
	});
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
