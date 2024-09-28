import { app, BrowserWindow } from 'electron';
import io from "socket.io-client";

// Electron things

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
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

console.log("test");

// Socket

let socket = io('https://www.windows93.net:8086', {
    forceNew: true,
    transportOptions: {
        polling: {
            extraHeaders: {
                "Accept": "*/*",
                "Accept-Encoding": "identity",
                "Accept-Language": "*",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Cookie": "",
                "Host": "www.windows93.net",
                "Origin": "http://www.windows93.net",
                "Pragma": "no-cache",
                "Referer": 'http://www.windows93.net/trollbox/index.php',
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
            }
        }
    }
});

// Connection-related events
socket.on('connected', function (data) {
  console.log("Connected");
});

socket.on("connect_error", (error) => {
    if (!socket.active) {
        console.error(error);
        socket.connect();
    }
});

socket.on("disconnect", (reason) => {
    if (!socket.active) {
        console.error(reason);
        // socket.connect();
    }
});

// Trollbox events

socket.on('update history', function (data) {

});

socket.on('update users', function (data) {

});

socket.on('user joined', function (data) {

});

socket.on('user left', function (data) {

});

socket.on('user change nick', function (data) {

});

socket.on('message', function (data) {
    console.log(data);
});

socket.on('cmd', function (data) {
    console.log("Remote command recieved: " + data)
});