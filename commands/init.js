/**
 * Init
 * Create a global config directory for Terminalizer
 *
 * - Create a global config directory
 *   - For Windows, create it under `APPDATA`
 *   - For Linux and MacOS, create it under the home directory 
 * - Copy the default config into it
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Executed after the command completes its task
 */
function done() {

  console.log(di.chalk.green('The global config directory is created at'));
  console.log(di.chalk.magenta(di.utility.getGlobalDirectory()));

}

/**
 * The command's main function
 * 
 * @param {Object} argv
 */
function command(argv) {

  var globalPath = di.utility.getGlobalDirectory();

  // Create the global directory
  try {

    di.fs.mkdirSync(di.utility.getGlobalDirectory());

  } catch (error) {

    // Ignore `already exists` error
    if (error.code != 'EEXIST') {
      throw error;
    }

  }

  // Copy the default config file
  di.fs.copySync(di.path.join(ROOT_PATH, 'config.yml'), 
                 di.path.join(globalPath, 'config.yml'),
                 {overwrite: true});

  done();

}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Command's usage
 * @type {String}
 */
module.exports.command = 'init';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Create a global config directory';

/**
 * Command's handler function
 * @type {Function}
 */
module.exports.handler = command;
