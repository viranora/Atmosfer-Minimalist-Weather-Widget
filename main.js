const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

// API Anahtarınız
const API_KEY = '3a2050915128742b1810653c19d72b2c';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 350,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'), 
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

}

app.on('ready', createWindow);

ipcMain.handle('get-weather', async (event, city) => {
  
  if (!API_KEY || API_KEY === 'SENIN_API_ANAHTARIN_BURAYA') {
    return { error: 'API Anahtarı eksik! Lütfen main.js dosyasına ekleyin.' };
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;
  
  try {
    const response = await axios.get(url);

    return response.data; 
  } catch (error) {
    console.error('API Hatası:', error.message);
    if (error.response && error.response.status === 401) {
        return { error: 'API Anahtarı geçersiz veya henüz aktif değil. Lütfen bekleyin.' };
    }
    return { error: 'Veri çekilemedi.' };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
