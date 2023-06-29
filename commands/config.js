/**
 * Config
 * Generate a config file in the current directory
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

/**
 * Executed after the command completes its task
 */
function done() {
  console.log(chalk.green('Successfully Saved'));
  console.log('The config file is saved into the file:');
  console.log(chalk.magenta('config.yml'));
}

/**
 * The command's main function
 *
 * @param {Object} argv
 */
function command(argv) {
  // Copy the default config file
  fs.copySync(path.join(ROOT_PATH, 'config.yml'), 'config.yml');

  done();
}

export default {
  // Command's usage
  command: 'config',
  // Command's description
  describe: 'Generate a config file in the current directory',
  // Command's handler function
  handler: command,
};
