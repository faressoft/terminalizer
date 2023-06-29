/**
 * Play
 * Play a recording file on your terminal
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

import * as death from 'death';
import * as async from 'async';
import * as utility from '../utility.js';

/**
 * Print the passed content
 *
 * @param {String}   content
 * @param {Function} callback
 */
function playCallback(content, callback) {
  process.stdout.write(content);
  callback();
}

/**
 * Executed after the command completes its task
 */
function done() {
  // Full reset for the terminal
  process.stdout.write('\\033c');
  process.exit();
}

/**
 * The command's main function
 *
 * @param {Object} argv
 */
function command(argv) {
  process.stdin.pause();

  // Playing options
  var options = {
    frameDelay: argv.recordingFile.json.config.frameDelay,
    maxIdleTime: argv.recordingFile.json.config.maxIdleTime,
  };

  // Use the actual delays between frames as recorded
  if (argv.realTiming) {
    options = {
      frameDelay: 'auto',
      maxIdleTime: 'auto',
    };
  }

  // When app is closing
  death(done);

  // Add the speedFactor option
  options.speedFactor = argv.speedFactor;

  // Adjust frames delays
  adjustFramesDelays(argv.recordingFile.json.records, options);

  // Play the recording records
  play(argv.recordingFile.json.records, playCallback, null, options);
}

/**
 * Adjust frames delays
 *
 * Options:
 *
 * - frameDelay (default: auto)
 *   - Delay between frames in ms
 *   - If the value is `auto` use the actual recording delays
 *
 * - maxIdleTime (default: 2000)
 *   - Maximum delay between frames in ms
 *   - Ignored if the `frameDelay` isn't set to `auto`
 *   - Set to `auto` to prevent limiting the max idle time
 *
 * - speedFactor (default: 1)
 *   - Multiply the frames delays by this factor
 *
 * @param {Array}  records
 * @param {Object} options (optional)
 */
function adjustFramesDelays(records, options) {
  // Default value for options
  if (typeof options === 'undefined') {
    options = {};
  }

  // Default value for options.frameDelay
  if (typeof options.frameDelay === 'undefined') {
    options.frameDelay = 'auto';
  }

  // Default value for options.maxIdleTime
  if (typeof options.maxIdleTime === 'undefined') {
    options.maxIdleTime = 2000;
  }

  // Default value for options.speedFactor
  if (typeof options.speedFactor === 'undefined') {
    options.speedFactor = 1;
  }

  // Foreach record
  records.forEach(function (record) {
    // Adjust the delay according to the options
    if (options.frameDelay != 'auto') {
      record.delay = options.frameDelay;
    } else if (options.maxIdleTime != 'auto' && record.delay > options.maxIdleTime) {
      record.delay = options.maxIdleTime;
    }

    // Apply speedFactor
    record.delay = record.delay * options.speedFactor;
  });
}

/**
 * Play recording records
 *
 * @param {Array}         records
 * @param {Function}      playCallback
 * @param {Function|Null} doneCallback
 */
function play(records, playCallback, doneCallback) {
  var tasks = [];

  // Default value for doneCallback
  if (typeof doneCallback === 'undefined') {
    doneCallback = null;
  }

  // Foreach record
  records.forEach(function (record) {
    tasks.push(function (callback) {
      setTimeout(function () {
        playCallback(record.content, callback);
      }, record.delay);
    });
  });

  async.series(tasks, function (error, results) {
    if (doneCallback) {
      doneCallback();
    }
  });
}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

function builder(yargs) {
  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'The recording file',
    type: 'string',
    coerce: utility.loadYAML,
  });

  // Define the real-timing option
  yargs.option('r', {
    alias: 'real-timing',
    describe: 'Use the actual delays between frames as recorded',
    type: 'boolean',
    default: false,
  });

  // Define the speed-factor option
  yargs.option('s', {
    alias: 'speed-factor',
    describe: 'Speed factor, multiply the frames delays by this factor',
    type: 'number',
    default: 1.0,
  });
}

export default {
  // Command's usage
  command: 'play <recordingFile>',
  // Command's description
  describe: 'Play a recording file on your terminal',
  // Command's handler function
  handler: command,
  builder,
  // Play recording records
  play,
  // Adjust frames delays
  adjustFramesDelays,
};
