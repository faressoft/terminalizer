/**
 * Terminalizer
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var yargs         = require('yargs'),
    is            = require('is_js'),
    chalk         = require('chalk'),
    _             = require('lodash'),
    async         = require('async'),
    asyncPromises = require('async-promises'),
    request       = require('request'),
    death         = require('death'),
    stringArgv    = require('string-argv'),
    path          = require('path'),
    ProgressBar   = require('progress'),
    GIFEncoder    = require('gif-encoder'),
    PNG           = require('pngjs').PNG,
    yaml          = require('js-yaml'),
    uuid          = require('uuid'),
    Flowa         = require('flowa'),
    inquirer      = require('inquirer'),
    os            = require('os'),
    spawn         = require('child_process').spawn,
    electron      = require('electron'),
    deepmerge     = require('deepmerge'),
    pty           = require('node-pty-prebuilt'),
    fs            = require('fs-extra'),
    now           = require('performance-now');
var package       = require('./package.json'),
    utility       = require('./utility.js'),
    di            = require('./di.js'),
    play          = require('./commands/play.js');

// Define the DI as a global object
global.di = di;

// Define the the root path of the app as a global constant
global.ROOT_PATH = __dirname;

// The base url of the Terminalizer website
global.BASEURL = 'https://terminalizer.com';

// Dependency Injection
di.set('is', is);
di.set('chalk', chalk);
di.set('_', _);
di.set('async', async);
di.set('asyncPromises', asyncPromises);
di.set('request', request);
di.set('death', death);
di.set('stringArgv', stringArgv);
di.set('path', path);
di.set('ProgressBar', ProgressBar);
di.set('GIFEncoder', GIFEncoder);
di.set('PNG', PNG);
di.set('os', os);
di.set('spawn', spawn);
di.set('electron', electron);
di.set('deepmerge', deepmerge);
di.set('pty', pty);
di.set('fs', fs);
di.set('now', now);
di.set('fs', fs);
di.set('Flowa', Flowa);
di.set('inquirer', inquirer);
di.set('yaml', yaml);
di.set('uuid', uuid);
di.set('utility', utility);
di.set('play', play);
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
yargs.command(require('./commands/init.js'))
     .command(require('./commands/config.js'))
     .command(require('./commands/record.js'))
     .command(require('./commands/play.js'))
     .command(require('./commands/render.js'))
     .command(require('./commands/share.js'))
     .command(require('./commands/generate.js'))

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
  console.error('Hint:\n  Use the ' + chalk.green('--help') + ' option to get help about the usage');
  process.exit(1);

}
