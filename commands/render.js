/**
 * Render
 * Render a recording file as an animated gif image
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Create a progress bar for processing frames
 *
 * @param  {String}      operation   a name for the operation
 * @param  {Number}      framesCount
 * @return {ProgressBar}
 */
function getProgressBar(operation, framesCount) {

  return new di.ProgressBar(operation + ' ' + di.chalk.magenta('frame :current/:total') + ' :percent [:bar] :etas', {
    width: 30,
    total: framesCount
  });

}

/**
 * Write the recording data into render/data.json
 * 
 * @param  {Object}  recordingFile
 * @return {Promise}
 */
function writeRecordingData(recordingFile) {

  return new Promise(function(resolve, reject) {

    // Write the data into data.json file in the root path of the app
    di.fs.writeFile(di.path.join(ROOT_PATH, 'render/data.json'), JSON.stringify(recordingFile.json), 'utf8', function(error) {

      if (error) {
        return reject(error);
      }

      resolve();
      
    });
    
  });

}

/**
 * Read and parse a PNG image file
 *
 * @param  {String}  path the absolute path of the image
 * @return {Promise} resolve with the parsed PNG image
 */
function loadPNG(path) {

  return new Promise(function(resolve, reject) {

    di.fs.readFile(path, function(error, imageData) {

      if (error) {
        return reject(error);
      }

      new di.PNG().parse(imageData, function(error, data) {

        if (error) {
          return reject(error);
        }

        resolve(data);

      });
      
    });
    
  });

}

/**
 * Get the dimensions of the first rendered frame
 * 
 * @return {Promise}
 */
function getFrameDimensions() {

  // The path of the first rendered frame
  var framePath = di.path.join(ROOT_PATH, 'render/frames/0.png');

  // Read and parse a PNG image file
  return loadPNG(framePath).then(function(png) {

    return({
      width: png.width,
      height: png.height
    });
  
  });

}

/**
 * Render the frames into PNG images
 * 
 * @param  {Array}   records [{delay, content}, ...]
 * @param  {Object}  options {step}
 * @return {Promise}
 */
function renderFrames(records, options) {

  return new Promise(function(resolve, reject) {

    // The number of frames
    var framesCount = records.length;

    // Create a progress bar
    var progressBar = getProgressBar('Rendering', Math.ceil(framesCount / options.step));

    // Execute the rendering process
    var render = di.spawn(di.electron, [di.path.join(ROOT_PATH, 'render/index.js'), options.step], {detached: false});

    render.stderr.on('data', function(error) {
      render.kill();
      reject(new Error(error));
    });

    render.stdout.on('data', function(data) {

      // Is not a recordIndex (to skip Electron's logs or new lines)
      if (di.is.not.number(parseInt(data.toString()))) {
        return;
      }

      progressBar.tick();

      // Rendering is completed
      if (progressBar.complete) {
        resolve();
      }

    });

  });

}

/**
 * Merge the rendered frames into an animated GIF image
 * 
 * @param  {Array}   records         [{delay, content}, ...]
 * @param  {Object}  options         {quality, repeat, step, outputFile}
 * @param  {Object}  frameDimensions {width, height}
 * @return {Promise}
 */
function mergeFrames(records, options, frameDimensions) {

  return new Promise(function(resolve, reject) {

    // The number of frames
    var framesCount = records.length;

    // Used for the step option
    var stepsCounter = 0;

    // Create a progress bar
    var progressBar = getProgressBar('Merging', Math.ceil(framesCount / options.step));

    // The gif image
    var gif = new di.GIFEncoder(frameDimensions.width, frameDimensions.height, {
      highWaterMark: 5 * 1024 * 1024
    });

    // Pipe
    gif.pipe(di.fs.createWriteStream(options.outputFile));

    // Quality
    gif.setQuality(101 - options.quality);

    // Repeat
    gif.setRepeat(options.repeat);

    // Write the headers
    gif.writeHeader();

    // Foreach frame
    di.async.eachOfSeries(records, function(frame, index, callback) {

      if (stepsCounter != 0) {
        stepsCounter = (stepsCounter + 1) % options.step;
        return callback();
      }

      stepsCounter = (stepsCounter + 1) % options.step;

      // The path of the rendered frame
      var framePath = di.path.join(ROOT_PATH, 'render/frames', index + '.png');

      // Read and parse the rendered frame
      loadPNG(framePath).then(function(png) {

        progressBar.tick();

        // Set the duration (the delay of the next frame)
        // The % is used to take the delay of the first frame
        // as the duration of the last frame
        gif.setDelay(records[(index + 1) % framesCount].delay);

        // Add frames
        gif.addFrame(png.data);

        // Next
        callback();

      }).catch(function(error) {

        callback(error);
        
      });

    }, function(error) {

      if (error) {
        return reject(error);
      }

      // Write the footer
      gif.finish();
      resolve();

    });


  });

}

/**
 * Delete the temporary rendered PNG images 
 * 
 * @return {Promise}
 */
function cleanup() {

  return new Promise(function(resolve, reject) {

    di.fs.emptyDir(di.path.join(ROOT_PATH, 'render/frames'), function(error) {
      
      if (error) {
        return reject(error);
      }

      resolve();

    });

  });

}

/**
 * Executed after the command completes its task
 * 
 * @param {String} outputFile the path of the rendered image
 */
function done(outputFile) {

  console.log('\n' + di.chalk.green('Successfully Rendered'));
  console.log('The animated GIF image is saved into the file:');
  console.log(di.chalk.magenta(outputFile));
  process.exit();

}

/**
 * The command's main function
 * 
 * @param {Object} argv
 */
function command(argv) {

  // Frames
  var records = argv.recordingFile.json.records;
  var config = argv.recordingFile.json.config;

  // Number of frames in the recording file
  var framesCount = records.length;

  // The path of the output file
  var outputFile = di.utility.resolveFilePath('render' + (new Date()).getTime(), 'gif');

  // For adjusting (calculating) the frames delays
  var adjustFramesDelaysOptions = {
    frameDelay: config.frameDelay,
    maxIdleTime: config.maxIdleTime
  };

  // For rendering the frames into PNG images
  var renderingOptions = {
    step: argv.step
  };

  // For merging the rendered frames into an animated GIF image
  var mergingOptions = {
    quality: config.quality,
    repeat: config.repeat,
    step: argv.step,
    outputFile: outputFile
  };

  // Overwrite the quality of the rendered image
  if (argv.quality) {
    mergingOptions.quality = argv.quality;
  }

  // Overwrite the outputFile of the rendered image
  if (argv.output) {
    outputFile = argv.output;
    mergingOptions.outputFile = argv.output;
  }

  // Tasks
  di.asyncPromises.waterfall([

    // Remove all previously rendered frames
    cleanup,

    // Write the recording data into render/data.json
    di._.partial(writeRecordingData, argv.recordingFile),

    // Render the frames into PNG images
    di._.partial(renderFrames, records, renderingOptions),

    // Adjust frames delays
    di._.partial(di.commands.play.adjustFramesDelays, records, adjustFramesDelaysOptions),

    // Get the dimensions of the first rendered frame
    di._.partial(getFrameDimensions),

    // Merge the rendered frames into an animated GIF image
    di._.partial(mergeFrames, records, mergingOptions),

    // Delete the temporary rendered PNG images 
    cleanup

  ]).then(function() {

    done(outputFile);
    
  }).catch(di.errorHandler);

}

////////////////////////////////////////////////////
// Command Definition //////////////////////////////
////////////////////////////////////////////////////

/**
 * Command's usage
 * @type {String}
 */
module.exports.command = 'render <recordingFile>';

/**
 * Command's description
 * @type {String}
 */
module.exports.describe = 'Render a recording file as an animated gif image';

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
module.exports.builder = function(yargs) {

  // Define the recordingFile argument
  yargs.positional('recordingFile', {
    describe: 'The recording file',
    type: 'string',
    coerce: di.utility.loadYAML
  });

  // Define the output option
  yargs.option('o', {
    alias: 'output',
    type: 'string',
    describe: 'A name for the output file',
    requiresArg: true,
    coerce: di._.partial(di.utility.resolveFilePath, di._, 'gif')
  });

  // Define the quality option
  yargs.option('q', {
    alias: 'quality',
    type: 'number',
    describe: 'The quality of the rendered image (1 - 100)',
    requiresArg: true
  });

  // Define the quality option
  yargs.option('s', {
    alias: 'step',
    type: 'number',
    describe: 'To reduce the number of rendered frames (step > 1)',
    requiresArg: true,
    default: 1
  });

};
