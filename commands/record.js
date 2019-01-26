/**
 * Record
 * Record your terminal and create a recording file
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

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
    if (di.os.platform() === 'win32') {
      di.utility.changeYAMLValue(config, 'command', 'powershell.exe');
    } else {
      di.utility.changeYAMLValue(config, 'command', 'bash -l');
    }

  }

  // Default value for cwd
  if (!config.json.cwd) {
    di.utility.changeYAMLValue(config, 'cwd', process.cwd());
  } else {
    di.utility.changeYAMLValue(config, 'cwd', di.path.resolve(config.json.cwd));
  }

  // Default value for cols
  if (di.is.not.number(config.json.cols)) {
    di.utility.changeYAMLValue(config, 'cols', process.stdout.columns);
  }

  // Default value for rows
  if (di.is.not.number(config.json.rows)) {
    di.utility.changeYAMLValue(config, 'rows', process.stdout.rows);
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
  var duration = di.now().toFixed() - lastRecordTimestamp;

  // Update the lastRecordTimestamp
  lastRecordTimestamp = di.now().toFixed();

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
    content: content
  });

}

/**
 * Executed after the command completes its task
 * Store the output file with reserving the comments
 */
function done() {

  var outputYAML = '';

  // Add config parent element
  outputYAML += '# The configurations that used for the recording, feel free to edit them\n';
  outputYAML += 'config:\n\n';

  // Add the configurations with indentation
  outputYAML += config.raw.replace(/^/gm, '  ');

  // Add the records
  outputYAML += '\n# Records, feel free to edit them\n';
  outputYAML += di.yaml.dump({records: records});

  // Store the data into the recording file
  try {

    di.fs.writeFileSync(recordingFile, outputYAML, 'utf8');

  } catch (error) {

    return di.errorHandler(error);

  }

  console.log(di.chalk.green('Successfully Recorded'));
  console.log('The recording data is saved into the file:');
  console.log(di.chalk.magenta(recordingFile));
  console.log('You can edit the file and even change the configurations.\n');

  console.log(di.chalk.green('Let\'s now share your recording on https://terminalizer.com'));
  console.log('The command ' + di.chalk.magenta('`terminalizer share`') + 'can be used anytime to share recordings!\n');

  // Reset STDIN
  process.stdin.removeAllListeners();
  process.stdin.setRawMode(false);
  process.stdin.pause();

  // Invoke the share command
  di.commands.share.handler({
    recordingFile: recordingFile
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
    di.utility.changeYAMLValue(config, 'command', argv.command);
  }

  // Split the command and its arguments
  var args = di.stringArgv(config.json.command);
  var command = args[0];
  var commandArguments = args.slice(1);

  // PTY instance
  var ptyProcess = di.pty.spawn(command, commandArguments, {
    cols: config.json.cols,
    rows: config.json.rows,
    cwd: config.json.cwd,
    env: di.deepmerge(process.env, config.json.env)
  });

  console.log('The recording session is started');
  console.log('Press', di.chalk.green('CTRL+D'), 'to exit and save the recording');

  // Input and output capturing and redirection
  ptyProcess.on('data', onData);
  ptyProcess.on('exit', done);
  process.stdin.on('data', ptyProcess.write.bind(ptyProcess));

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
 * Command's usage
 * @type {String}
 */
module.exports.command = 'record <recordingFile>';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Record your terminal and create a recording file';

/**
 * Handler
 * 
 * @param {Object} argv
 */
module.exports.handler = function(argv) {

  // Default value for the config option
  if (typeof argv.config == 'undefined') {
    argv.config = di.utility.getDefaultConfig();
  }

  // Execute the command
  command(argv);
  
};

/**
 * Builder
 * 
 * @param {Object} yargs
 */
module.exports.builder = function(yargs) {

  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'A name for the recording file',
    type: 'string',
    coerce: di._.partial(di.utility.resolveFilePath, di._, 'yml')
  });

  // Define the config option
  yargs.option('c', {
    alias: 'config',
    type: 'string',
    describe: 'Overwrite the default configurations',
    requiresArg: true,
    coerce: di.utility.loadYAML
  });

  // Define the config option
  yargs.option('d', {
    alias: 'command',
    type: 'string',
    describe: 'The command to be executed',
    requiresArg: true,
    default: null
  });

  // Add examples
  yargs.example('$0 record foo', 'Start recording and create a recording file called foo.yml');
  yargs.example('$0 record foo --config config.yml', 'Start recording with your own configurations');

};
