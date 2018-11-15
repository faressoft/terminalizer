/**
 * Terminalizer
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var fs                 = require('fs'),
    path               = require('path'),
    async              = require('async'),
    remote             = require('electron').remote,
    ipcRenderer        = require('electron').ipcRenderer,
    terminalizerPlayer = require('terminalizer-player');
var currentWindow      = remote.getCurrentWindow(),
    capturePage        = currentWindow.webContents.capturePage,
    step               = remote.getGlobal('step'),
    renderDir          = remote.getGlobal('renderDir');

// Styles
import '../css/app.css';
import 'terminalizer-player/dist/css/terminalizer.min.css';
import 'xterm/dist/xterm.css';

/**
 * Used for the step option
 * @type {Number}
 */
var stepsCounter = 0;

/**
 * A callback function for the event:
 * When the document is loaded
 */
$(document).ready(function() {
  
  // Initialize the terminalizer plugin
  $('#terminal').terminalizer({
    recordingFile: 'data.json',
    autoplay: true,
    controls: false
  });

  /**
   * A callback function for the event:
   * When the terminal playing is started
   */
  $('#terminal').one('playingStarted', function() {

    var terminalizer = $('#terminal').data('terminalizer');

    // Pause the playing
    terminalizer.pause();

  });

  /**
   * A callback function for the event:
   * When the terminal playing is paused
   */
  $('#terminal').one('playingPaused', function() {

    var terminalizer = $('#terminal').data('terminalizer');

    // Reset the terminal
    terminalizer._terminal.reset();

    // When the terminal's reset is done 
    $('#terminal').one('rendered', render);

  });

});

/**
 * Render each frame and capture it
 */
function render() {

  var terminalizer = $('#terminal').data('terminalizer');
  var framesCount = terminalizer.getFramesCount();

  // Foreach frame
  async.timesSeries(framesCount, function(frameIndex, next) {

    terminalizer._renderFrame(frameIndex, true, function() {
      capture(frameIndex, next);
    });

  }, function(error) {

    if (error) {
      throw new Error(error);
    }

    currentWindow.close();
    
  });

}

/**
 * Capture the current frame
 * 
 * @param {Number}   frameIndex
 * @param {Function} callback
 */
function capture(frameIndex, callback) {

  var width = $('#terminal').width();
  var height = $('#terminal').height();
  var captureRect = {x: 0, y: 0, width: width, height: height};

  if (stepsCounter != 0) {
    stepsCounter = (stepsCounter + 1) % step;
    return callback();
  }

  stepsCounter = (stepsCounter + 1) % step;

  capturePage(captureRect, function(img) {

    var outputPath = path.join(renderDir, frameIndex + '.png');

    fs.writeFileSync(outputPath, img.toPNG());
    ipcRenderer.send('captured', frameIndex);
    callback();

  });

}

/**
 * Catch all unhandled errors
 * 
 * @param {String} error
 */
window.onerror = function(error) {

  ipcRenderer.send('error', error);

};
