const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getWeather: (city) => ipcRenderer.invoke('get-weather', city)
});

