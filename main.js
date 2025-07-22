const { Notification,ipcRenderer, app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require('path');
const RPC = require('discord-rpc');
const clientId = '1390001107878543463';

let showDCrpc = false;

function createWindow() {
  app.setName("Focus Forge");
  app.setAppUserModelId("com.zekiel.focusforge"); 
  app.focus();
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: 800,
    height: height,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'src/icon/icon.ico') 
    
 });
 win.loadFile("src/index.html");
 win.webContents.openDevTools();
}

ipcMain.on('notification',(event,title,body)=>{
  new Notification({
    title: title,
    body: body,
    // icon: path.join(__dirname, 'src/icon/icon.ico')
  }).show();
})

app.whenReady().then(createWindow);

//discrod rpc configuration
const rpc = new RPC.Client({ transport: 'ipc' });

const time = new Date();
async function setActivity(details) {
  if (!rpc) {
    return;
  }
  if (!showDCrpc) return 
  rpc.setActivity({
    details: 'Idling', // Baris teks utama
    instance: false,
    // startTimestamp: time,
  });
}

// Saat RPC sudah siap, jalankan setActivity
rpc.on('ready', () => {
  if (!showDCrpc) return 
  setActivity();
});

ipcMain.on('update-discord-details', (event, activity, state) => {
  if (!rpc) return;
  if (!showDCrpc) return 
  rpc.setActivity({
    details: activity, // Baris teks utama
    state: state, // Baris teks kedua
    startTimestamp: time,
    instance: false,
  });
});

ipcMain.on('focus-whithout-todo', (event) => {
  if (!rpc) return;
  if (!showDCrpc) return 
  rpc.setActivity({
    details: "Focus",
    startTimestamp: time,
    instance: false,
  });
});

ipcMain.on('reset', (event) => {
  if (!rpc) return;
  if (!showDCrpc) return 
  rpc.setActivity({
    details: 'Idling', // Baris teks utama
    instance: false,
    startTimestamp: time,
  });
});

ipcMain.on('DCrpcVisibility', (event)=>{
  rpc.clearActivity();
  showDCrpc = !showDCrpc;
})


// Login ke RPC dengan Client ID
rpc.login({ clientId }).catch(console.error);