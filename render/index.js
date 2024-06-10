/**
 * Render the frames into PNG images
 * An electron app, takes one command line argument `step`
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { BrowserWindow } = require('electron');
const ipcMain = require('electron').ipcMain;
const os = require('os');

let mainWindow = null;

/**
 * The directory to render the frames into
 * @type {String}
 */
const renderDir = process.argv[2];


/**
 * Disable electron hardware acceleration if requested by environment.
 * See https://stackoverflow.com/a/58351011/381166.
 */
if (process.env.ELECTRON_DISABLE_GPU) {
  app.disableHardwareAcceleration();
}

/**
 * The step option
 * To reduce the number of rendered frames (step > 1)
 * @type {Number}
 */
const step = process.argv[3] || 1;

// Hide the Dock for macOS
if (os.platform() == 'darwin') {
  app.dock.hide();
}

// When the app is ready
app.on('ready', createWindow);

/**
 * Create a hidden browser window and load the rendering page
 */
function createWindow() {
  // Create a browser window
  mainWindow = new BrowserWindow({
    show: false,
    width: 8000,
    height: 8000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load index.html
  mainWindow.loadURL('file://' + __dirname + '/index.html');
}

/**
 * A callback function for the event:
 * getOptions to request the options that need
 * to be passed to the renderer
 *
 * @param {Object} event
 */
ipcMain.handle('getOptions', function () {
  return { step };
});

/**
 * A callback function for the event:
 * capturePage
 *
 * @param {Object} event
 */
ipcMain.handle('capturePage', async function (event, captureRect, frameIndex) {
  // To show the cursor for headless browser
  mainWindow.focusOnWebView();
  const img = await mainWindow.webContents.capturePage(captureRect);
  const outputPath = path.join(renderDir, frameIndex + '.png');
  fs.writeFileSync(outputPath, img.toPNG());
  console.log(frameIndex);
});

/**
 * A callback function for the event:
 * Close
 *
 * @param {Object} event
 * @param {String} error
 */
ipcMain.on('close', function (event, error) {
  mainWindow.close();
});

/**
 * A callback function for the event:
 * When something unexpected happened
 *
 * @param {Object} event
 * @param {String} error
 */
ipcMain.on('error', function (event, error) {
  process.stderr.write(error);
});
