/**
 * Record
 * Record your terminal and create a recording file
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

import * as os from 'os';
import * as path from 'path';
import * as is from 'is_js';
import * as now from 'performance-now';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as stringArgv from 'string-argv';
import * as pty from 'node-pty-prebuilt-multiarch';
import * as deepmerge from 'deepmerge';
import _ from 'lodash';

import * as utility from '../utility.js';
import share from '../commands/share.js';
import errorHandler from '../error-handler.js';

/**
 * The path of the recording file
 * @type {String}
 */
var recordingFile = null;

/**
 * The normalized configurations
 * @type {Object} {json, raw}
 */
var config = {};

/**
 * To keep tracking of the timestamp
 * of the last inserted record
 * @type {Number}
 */
var lastRecordTimestamp = null;

/**
 * To store the records
 * @type {Array}
 */
var records = [];

/**
 * Normalize the config file
 *
 * - Set default values in the json and raw
 * - Change the formatting of the values in the json and raw
 *
 * @param  {Object} config {json, raw}
 * @return {Object} {json, raw}
 */
function normalizeConfig(config) {
  // Default value for command
  if (!config.json.command) {
    // Windows OS
    if (os.platform() === 'win32') {
      utility.changeYAMLValue(config, 'command', 'powershell.exe');
    } else {
      utility.changeYAMLValue(config, 'command', 'bash -l');
    }
  }

  // Default value for cwd
  if (!config.json.cwd) {
    utility.changeYAMLValue(config, 'cwd', process.cwd());
  } else {
    utility.changeYAMLValue(config, 'cwd', path.resolve(config.json.cwd));
  }

  // Default value for cols
  if (is.not.number(config.json.cols)) {
    utility.changeYAMLValue(config, 'cols', process.stdout.columns);
  }

  // Default value for rows
  if (is.not.number(config.json.rows)) {
    utility.changeYAMLValue(config, 'rows', process.stdout.rows);
  }

  return config;
}

/**
 * Calculate the duration from the last inserted record in ms,
 * and update lastRecordTimestamp
 *
 * @return {Number}
 */
function getDuration() {
  // Calculate the duration from the last inserted record
  var duration = now().toFixed() - lastRecordTimestamp;

  // Update the lastRecordTimestamp
  lastRecordTimestamp = now().toFixed();

  return duration;
}

/**
 * When an input or output is received from the PTY instance
 *
 * @param {Buffer} content
 */
function onData(content) {
  process.stdout.write(content);

  var duration = getDuration();

  if (duration < 5) {
    var lastRecord = records[records.length - 1];
    lastRecord.content += content;
    return;
  }

  records.push({
    delay: duration,
    content: content,
  });
}

/**
 * Executed after the command completes its task
 * Store the output file with reserving the comments
 *
 * @param {Object} argv
 */
function done(argv) {
  var outputYAML = '';

  // Add config parent element
  outputYAML += '# The configurations that used for the recording, feel free to edit them\n';
  outputYAML += 'config:\n\n';

  // Add the configurations with indentation
  outputYAML += config.raw.replace(/^/gm, '  ');

  // Add the records
  outputYAML += '\n# Records, feel free to edit them\n';
  outputYAML += yaml.dump({ records: records });

  // Store the data into the recording file
  try {
    fs.writeFileSync(recordingFile, outputYAML, 'utf8');
  } catch (error) {
    return errorHandler(error);
  }

  console.log(chalk.green('Successfully Recorded'));
  console.log('The recording data is saved into the file:');
  console.log(chalk.magenta(recordingFile));
  console.log('You can edit the file and even change the configurations.');
  console.log('The command ' + chalk.magenta('`terminalizer share`') + 'can be used anytime to share recordings!');

  // Reset STDIN
  process.stdin.setRawMode(false);
  process.stdin.pause();

  if (argv.skipSharing) {
    return;
  }

  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'share',
        message: 'Would you like to share your recording on terminalizer.com?',
      },
    ])
    .then(function (answers) {
      if (!answers.share) {
        return;
      }

      console.log(chalk.green("Let's now share your recording on https://terminalizer.com"));

      // Invoke the share command
      share.handler({
        recordingFile: recordingFile,
      });
    });
}

/**
 * The command's main function
 *
 * @param {Object} argv
 */
function command(argv) {
  // Normalize the configurations
  config = normalizeConfig(argv.config);

  // Store the path of the recordingFile
  recordingFile = argv.recordingFile;

  // Overwrite the command to be executed
  if (argv.command) {
    utility.changeYAMLValue(config, 'command', argv.command);
  }

  // Split the command and its arguments
  var args = stringArgv(config.json.command);
  var command = args[0];
  var commandArguments = args.slice(1);

  // PTY instance
  var ptyProcess = pty.spawn(command, commandArguments, {
    cols: config.json.cols,
    rows: config.json.rows,
    cwd: config.json.cwd,
    env: deepmerge(process.env, config.json.env),
  });

  var onInput = ptyProcess.write.bind(ptyProcess);

  console.log('The recording session is started');
  console.log('Press', chalk.green('CTRL+D'), 'to exit and save the recording');

  // Input and output capturing and redirection
  process.stdin.on('data', onInput);
  ptyProcess.on('data', onData);
  ptyProcess.on('exit', function () {
    process.stdin.removeListener('data', onInput);
    done(argv);
  });

  // Input and output normalization
  process.stdout.setDefaultEncoding('utf8');
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();
}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Handler
 *
 * @param {Object} argv
 */
function handler(argv) {
  // Default value for the config option
  if (typeof argv.config == 'undefined') {
    argv.config = utility.getDefaultConfig();
  }

  // Execute the command
  command(argv);
}

/**
 * Builder
 *
 * @param {Object} yargs
 */
function builder(yargs) {
  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'A name for the recording file',
    type: 'string',
    coerce: _.partial(utility.resolveFilePath, _, 'yml'),
  });

  // Define the config option
  yargs.option('c', {
    alias: 'config',
    type: 'string',
    describe: 'Overwrite the default configurations',
    requiresArg: true,
    coerce: utility.loadYAML,
  });

  // Define the config option
  yargs.option('d', {
    alias: 'command',
    type: 'string',
    describe: 'The command to be executed',
    requiresArg: true,
    default: null,
  });

  // Define the config option
  yargs.option('k', {
    alias: 'skip-sharing',
    type: 'boolean',
    describe: 'Skip sharing and showing the sharing prompt message',
    requiresArg: false,
    default: false,
  });

  // Add examples
  yargs.example('$0 record foo', 'Start recording and create a recording file called foo.yml');
  yargs.example('$0 record foo --config config.yml', 'Start recording with your own configurations');
}

export default {
  // Command's usage
  command: 'record <recordingFile>',
  // Command's description
  describe: 'Record your terminal and create a recording file',
  // Command's handler function
  handler: command,
  builder,
};
