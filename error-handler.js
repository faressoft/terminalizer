/**
 * Print an error
 *
 * @param {String|Error} error
 */

import chalk from 'chalk';

export default (error) => {
  error = error.toString();

  console.error('Error: \n  ' + error + '\n');
  console.error('Hint:\n  Use the ' + chalk.green('--help') + ' option to get help about the usage');
  process.exit(1);
};
