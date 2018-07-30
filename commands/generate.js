/**
 * Generate
 * Generate a web player for a recording file
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Executed after the command completes its task
 */
function done() {

  // Terminate the app
  process.exit();

}

/**
 * The command's main function
 * 
 * @param {Object} argv
 */
function command(argv) {

  console.log('This command is not implemented yet. It will be available in the next versions');

}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Command's usage
 * @type {String}
 */
module.exports.command = 'generate <recordingFile>';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Generate a web player for a recording file';

/**
 * Command's handler function
 * @type {Function}
 */
module.exports.handler = command;

/**
 * Builder
 * 
 * @param {Object} yargs
 */
module.exports.builder = function(yargs) {

  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'the recording file',
    type: 'string',
    coerce: di.utility.loadYAML
  });

};
