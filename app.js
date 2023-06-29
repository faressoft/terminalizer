/**
 * Terminalizer
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join as pathJoin } from 'path';
import yargs from 'yargs';
import commands from './commands/index.js';
import errorHandler from './error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { version } = JSON.parse(readFileSync(pathJoin(__dirname, './package.json'), 'utf8'));

// Define the the root path of the app as a global constant
global.ROOT_PATH = __dirname;

// The base url of the Terminalizer website
global.BASEURL = 'https://terminalizer.com';

// Initialize yargs
yargs
  .usage('Usage: $0 <command> [options]')
  // Add link
  .epilogue('For more information, check https://terminalizer.com')
  // Set the version number
  .version(version)
  // Add aliases for version and help options
  .alias({ v: 'version', h: 'help' })
  // Require to pass a command
  .demandCommand(1, 'The command is missing')
  // Strict mode
  .strict()
  // Set width to 90 cols
  .wrap(100)
  // Handle failures
  .fail(errorHandler);

// Load commands
yargs
  .command(commands.init)
  .command(commands.config)
  .command(commands.record)
  .command(commands.play)
  .command(commands.render)
  .command(commands.share)
  .command(commands.generate);

// debugger;

try {
  // Parse the command line arguments
  yargs.parse();
} catch (error) {
  // Print the error
  errorHandler(error);
}
