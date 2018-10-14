/**
 * Config
 * Generate a config file in the current directory
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Executed after the command completes its task
 */
function done() {

  console.log(di.chalk.green('Successfully Saved'));
  console.log('The config file is saved into the file:');
  console.log(di.chalk.magenta('config.yml'));

}

/**
 * The command's main function
 * 
 * @param {Object} argv
 */
function command(argv) {

  // Copy the default config file
  di.fs.copySync(di.path.join(ROOT_PATH, 'config.yml'), 'config.yml');

  done();

}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Command's usage
 * @type {String}
 */
module.exports.command = 'config';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Generate a config file in the current directory';

/**
 * Command's handler function
 * @type {Function}
 */
module.exports.handler = command;
