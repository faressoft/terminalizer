const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('app', {
  close() {
    return ipcRenderer.send('close');
  },
  getOptions() {
    return ipcRenderer.invoke('getOptions');
  },
  capturePage(captureRect, frameIndex) {
    return ipcRenderer.invoke('capturePage', captureRect, frameIndex);
  },
});

// Catch all unhandled errors
window.onerror = function (error) {
  ipcRenderer.send('error', error);
};
