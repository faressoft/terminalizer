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

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as utility from '../utility.js';

/**
 * Executed after the command completes its task
 */
function done() {
  console.log(chalk.green('The global config directory is created at'));
  console.log(chalk.magenta(utility.getGlobalDirectory()));
}

/**
 * The command's main function
 *
 * @param {Object} argv
 */
function command(argv) {
  var globalPath = utility.getGlobalDirectory();

  // Create the global directory
  try {
    fs.mkdirSync(utility.getGlobalDirectory());
  } catch (error) {
    // Ignore `already exists` error
    if (error.code != 'EEXIST') {
      throw error;
    }
  }

  // Copy the default config file
  fs.copySync(path.join(ROOT_PATH, 'config.yml'), path.join(globalPath, 'config.yml'), { overwrite: true });

  done();
}

export default {
  // Command's usage
  command: 'init',
  // Command's description
  describe: 'Create a global config directory',
  // Command's handler function
  handler: command,
};
