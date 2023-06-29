/**
 * Generate
 * Generate a web player for a recording file
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

import * as utility from '../utility.js';

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

/**
 * Builder
 *
 * @param {Object} yargs
 */
function builder(yargs) {
  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'the recording file',
    type: 'string',
    coerce: utility.loadYAML,
  });
}

export default {
  // Command's usage
  command: 'generate <recordingFile>',
  // Command's description
  describe: 'Generate a web player for a recording file',
  // Command's handler function
  handler: command,
  builder: builder,
};
