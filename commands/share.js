/**
 * Share
 * Upload a recording file and get a link for an online player
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Executed after the command completes its task
 *
 * @param {String} url the url of the uploaded recording
 */
function done(url) {

  console.log(di.chalk.green('Successfully Uploaded'));
  console.log('The recording is available on the link:');
  console.log(di.chalk.magenta(url));
  process.exit();

}

/**
 * Check if the value is not an empty value
 *
 * - Throw `Required field` if empty
 * 
 * @param  {String} input
 * @return {Boolean}
 */
function isSet(input) {

  if (!input) {
    return new Error('Required field');
  }

  return true;

}

/**
 * The command's main function
 * 
 * @param {Object} argv
 */
function command(argv) {

  // No global config
  if (!di.utility.isGlobalDirectoryCreated()) {
    require('./init.js').handler();
  }

}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Command's usage
 * @type {String}
 */
module.exports.command = 'share <recordingFile>';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Upload a recording file and get a link for an online player';

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
    coerce: di._.partial(di.utility.resolveFilePath, di._, 'yml')
  });

};
