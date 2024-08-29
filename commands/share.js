/**
 * Share
 * Upload a recording file and get a link for an online player
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Executed after the command completes its task
 *
 * @param {String} url the url of the uploaded recording
 */
function done(url) {
  console.log(di.chalk.green('Successfully Uploaded'));
  console.log('The recording is available on the link:');
  console.log(di.chalk.magenta(url));
  process.exit();
}

/**
 * Check if the value is not an empty value
 *
 * - Throw `Required field` if empty
 *
 * @param  {String} input
 * @return {Boolean}
 */
function isSet(input) {
  if (!input) {
    return new Error('Required field');
  }

  return true;
}

/**
 * Get a token for uploading recordings
 *
 * - Check if already registered
 *   - Yes: use the token
 *   - No: Generate a new one and ask the user to register it
 *
 * @return {Promise}
 */
function getToken(context) {
  var token = di.utility.getToken();

  // Already registered
  if (token) {
    return Promise.resolve(token);
  }

  token = di.utility.generateToken();

  console.log('Open the following link in your browser and login into your account');
  console.log(di.chalk.dim(BASEURL + '/token?token=' + token) + '\n');

  // Continue action
  return new Promise(function (resolve, reject) {
    console.log('When you do it, press any key to continue');
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.once('data', function handler(data) {
      // Check if CTRL+C is pressed to exit
      if (data == '\u0003' || data == '\u0003') {
        process.exit();
      }

      console.log(di.chalk.dim('Enjoy !') + '\n');
      process.stdin.pause();
      process.stdin.setRawMode(false);

      resolve(token);
    });
  });
}

/**
 * Ask the user to enter meta data about the recording
 *
 * - Skip the task if already executed before
 *   and resolve with the last result
 *
 * @param  {Object}  context
 * @return {Promise}
 */
function getMeta(context) {
  var platform = di.utility.getOS();

  // Already executed
  if (typeof context.getMeta != 'undefined') {
    return Promise.resolve(context.getMeta);
  }

  console.log('Please enter some details about your recording');

  return di.inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Title',
        validate: isSet,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        validate: isSet,
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags ' + di.chalk.dim('such as git,bash,game'),
        validate: isSet,
        default: platform,
      },
    ])
    .then(function (answers) {
      var params = Object.assign({}, answers);

      // Add the platform
      params.platform = platform;

      // Print a new line
      console.log();

      return params;
    });
}

/**
 * Upload the recording
 *
 * - If the token is rejected
 *   - Delete the token
 *   - Jump into the getToken task
 *
 * - Resolve with the url of the uploaded recording
 *
 * @param  {Object}  context
 * @return {Promise}
 */
function shareRecording(context) {
  var self = this;
  var token = context.getToken;
  var meta = context.getMeta;
  var recordingFile = context.recordingFile;

  var options = {
    method: 'POST',
    url: BASEURL + '/v1/recording',
    formData: {
      title: meta.title,
      description: meta.description,
      tags: meta.tags,
      platform: meta.platform,
      token: token,
      file: {
        value: di.fs.createReadStream(recordingFile),
        options: {
          filename: 'recording.yml',
          contentType: 'application/x-yaml',
        },
      },
    },
  };

  return di
    .axios(options)
    .then((response) => {
      // Internal server error
      if (response.status === 500) {
        throw new Error(response.data.errors.join('\n'));
      }

      // Invalid input
      if (response.status === 400) {
        throw new Error(response.data.errors.join('\n'));
      }

      // Invalid token
      if (response.status === 401) {
        di.utility.removeToken();
        self.jump('getToken');
        return;
      }

      // Unexpected error
      if (response.status !== 200) {
        throw new Error('Something went wrong, try again later');
      }

      // Resolve with the URL from the response body
      return response.data.url;
    })
    .catch((error) => {
      // Reject the promise with the error
      throw error;
    });
}

/**
 * The command's main function
 *
 * @param {Object} argv
 */
function command(argv) {
  // No global config
  if (!di.utility.isGlobalDirectoryCreated()) {
    require('./init.js').handler();
  }

  var context = { ...argv };

  // Get a token for uploading recordings
  getToken(context)
    .then(function (token) {
      context.getToken = token;
      // Ask the user to enter meta data about the recording
      return getMeta(context);
    })
    .then(function (meta) {
      context.getMeta = meta;
      // Upload the recording
      return shareRecording(context);
    })
    .then(function (url) {
      done(url);
    })
    .catch(di.errorHandler);
}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Command's usage
 * @type {String}
 */
module.exports.command = 'share <recordingFile>';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Upload a recording file and get a link for an online player';

/**
 * Command's handler function
 * @type {Function}
 */
module.exports.handler = command;

/**
 * Builder
 *
 * @param {Object} yargs
 */
module.exports.builder = function (yargs) {
  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'the recording file',
    type: 'string',
    coerce: di._.partial(di.utility.resolveFilePath, di._, 'yml'),
  });
};
