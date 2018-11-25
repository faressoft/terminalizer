/**
 * Terminalizer
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var yargs = require('yargs'),
    requireDir = require('require-dir');
var package = require('./package.json'),
    commands = requireDir('./commands'),
    DI = require('./di.js');

// Define the DI as a global object
global.di = new DI();

// Define the the root path of the app as a global constant
global.ROOT_PATH = __dirname;

// The base url of the Terminalizer website
global.BASEURL = 'https://terminalizer.com';

// Dependency Injection
di.require('chalk');
di.require('async');
di.require('request');
di.require('death');
di.require('path');
di.require('os');
di.require('electron');
di.require('deepmerge');
di.require('uuid');
di.require('is_js', 'is');
di.require('lodash', '_');
di.require('fs-extra', 'fs');
di.require('flowa', 'Flowa');
di.require('js-yaml', 'yaml');
di.require('node-pty-prebuilt', 'pty');
di.require('performance-now', 'now');
di.require('async-promises', 'asyncPromises');
di.require('string-argv', 'stringArgv');
di.require('progress', 'ProgressBar');
di.require('gif-encoder', 'GIFEncoder');
di.require('inquirer');

di.set('PNG', require('pngjs').PNG);
di.set('spawn', require('child_process').spawn);
di.set('utility', require('./utility.js'));
di.set('commands', commands);
di.set('errorHandler', errorHandler);

// Initialize yargs
yargs.usage('Usage: $0 <command> [options]')
     // Add link
     .epilogue('For more information, check https://terminalizer.com')
     // Set the version number
     .version(package.version)
     // Add aliases for version and help options
     .alias({v: 'version', h: 'help'})
     // Require to pass a command
     .demandCommand(1, 'The command is missing')
     // Strict mode
     .strict()
     // Set width to 90 cols
     .wrap(100)
     // Handle failures
     .fail(errorHandler);

// Load commands
yargs.command(commands.init)
     .command(commands.config)
     .command(commands.record)
     .command(commands.play)
     .command(commands.render)
     .command(commands.share)
     .command(commands.generate)

debugger;

try {

  // Parse the command line arguments
  yargs.parse();

} catch (error) {

  // Print the error
  errorHandler(error);

}

/**
 * Print an error
 * 
 * @param {String|Error} error
 */
function errorHandler(error) {

  error = error.toString();

  console.error('Error: \n  ' + error + '\n');
  console.error('Hint:\n  Use the ' + di.chalk.green('--help') + ' option to get help about the usage');
  process.exit(1);

}
