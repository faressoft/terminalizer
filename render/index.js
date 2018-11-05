/**
 * Render the frames into PNG images
 * An electron app, takes one command line argument `step`
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var path          = require('path'),
    app           = require('electron').app,
    BrowserWindow = require('electron').BrowserWindow,
    ipcMain       = require('electron').ipcMain,
    os            = require('os');

/**
 * The step option
 * To reduce the number of rendered frames (step > 1)
 * @type {Number}
 */
global.step = process.argv[2] || 1;

/**
 * The temporary rendering directory's path
 * @type {String}
 */
global.renderDir = path.join(__dirname, 'frames');

// Set the display scale factor to 1
app.commandLine.appendSwitch('force-device-scale-factor', 1);

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
  var win = new BrowserWindow({
    show: false,
    width: 8000,
    height: 8000
  });

  // Load index.html 
  win.loadURL('file://' + __dirname + '/index.html');

}

/**
 * A callback function for the event:
 * When a frame is captured
 * 
 * @param {Object} event
 * @param {Number} recordIndex
 */
ipcMain.on('captured', function(event, recordIndex) {

  console.log(recordIndex);
  
});

/**
 * A callback function for the event:
 * When something unexpected happened
 *
 * @param {Object} event
 * @param {String} error
 */
ipcMain.on('error', function(event, error) {

  process.stderr.write(error);
  
});
