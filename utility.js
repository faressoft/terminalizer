/**
 * Provide utility functions
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Check if a path represents a valid path for a file
 * 
 * @param  {String}  filePath an absolute or a relative path
 * @return {Boolean}
 */
function isFile(filePath) {

  // Resolve the path into an absolute path
  filePath = di.path.resolve(filePath);

  try {

    return di.fs.statSync(filePath).isFile();

  } catch (error) {

    return false;

  }

}

/**
 * Check if a path represents a valid path for a directory
 * 
 * @param  {String}  dirPath an absolute or a relative path
 * @return {Boolean}
 */
function isDir(dirPath) {

  // Resolve the path into an absolute path
  dirPath = di.path.resolve(dirPath);

  try {

    return di.fs.statSync(dirPath).isDirectory();

  } catch (error) {

    return false;

  }

}

/**
 * Load a file's content
 *
 * - Check if the file exists, if not found check
 *   if the file exists with appending the extension
 *
 * Throws
 * - The provided file doesn't exit
 * - Any reading errors
 * 
 * @param  {String} filePath  an absolute or a relative path
 * @param  {String} extension
 * @return {String}
 */
function loadFile(filePath, extension) {

  var content = null;

  // Resolve the path into an absolute path
  filePath = resolveFilePath(filePath, extension);

  // The file doesn't exist
  if (!isFile(filePath)) {
    throw new Error('The provided file doesn\'t exit');
  }

  // Read the file
  try {
    content = di.fs.readFileSync(filePath);
  } catch (error) {
    throw new Error(error);
  }

  return content;

}

/**
 * Check, load, and parse YAML files
 *
 * - Add .yml extension when needed
 * 
 * Throws
 * - The provided file doesn't exit
 * - The provided file is not a valid YAML file
 * - Any reading errors
 * 
 * @param  {String} filePath an absolute or a relative path
 * @return {Object}
 */
function loadYAML(filePath) {

  var file = loadFile(filePath, 'yml');

  // Parse the file
  try {

    return {
      json: di.yaml.load(file),
      raw: file.toString()
    };

  } catch (error) {

    throw new Error('The provided file is not a valid YAML file');

  }

}

/**
 * Check, load, and parse JSON files
 *
 * - Add .json extension when needed
 * 
 * Throws
 * - The provided file doesn't exit
 * - The provided file is not a valid JSON file
 * - Any reading errors
 * 
 * @param  {String} filePath an absolute or a relative path
 * @return {Object}
 */
function loadJSON(filePath) {

  var file = loadFile(filePath, 'json');

  // Read the file
  try {
    file = di.fs.readFileSync(filePath);
  } catch (error) {
    throw new Error(error);
  }

  // Parse the file
  try {
    return JSON.parse(file);
  } catch (error) {
    throw new Error('The provided file is not a valid JSON file');
  }

}

/**
 * Resolve a path and add an extension to the file name
 *
 * - Add the extension if not already added
 * 
 * @param  {String} filePath  an absolute or a relative path
 * @param  {String} extension
 * @return {String}
 */
function resolveFilePath(filePath, extension) {

  var resolvedPath = di.path.resolve(filePath);

  // The extension is not added
  if (di.path.extname(resolvedPath) != '.' + extension) {
    resolvedPath += '.' + extension;
  }

  return resolvedPath;

}

/**
 * Get the default configurations
 *
 * - Check if there is a global config file
 *   - Found: Get the global config file
 *   - Not Found: Get the default config file
 * 
 * @return {Object} {json, raw}
 */
function getDefaultConfig() {

  var defaultConfigPath = di.path.join(ROOT_PATH, 'config.yml');
  var globalConfigPath = di.path.join(getGlobalDirectory(), 'config.yml');

  // The global config file exists
  if (isFile(globalConfigPath)) {
    console.log('globalConfigPath');
    return loadYAML(globalConfigPath);
  }

  console.log('defaultConfigPath');

  // Load global config file
  return loadYAML(defaultConfigPath);

}

/**
 * Change a value for a specific key in YAML
 * 
 * - Works only with the first level keys
 * - Works only with keys with a single value
 * - Apply the changes on the json and raw
 *
 * @param {Object} data  {json, raw} 
 * @param {String} key
 * @param {*}      value
 */
function changeYAMLValue(data, key, value) {

  data.json[key] = value;
  data.raw = data.raw.replace(new RegExp('^' + key + ':.+$', 'm'), key + ': ' + value);

}

/**
 * Get the path of the global data directory
 *
 * - For Windows, get the path of APPDATA
 * - For Linux and MacOS, get the path of the home directory 
 * 
 * @return {String}
 */
function getGlobalDirectory() {

  return di.path.join(process.env.APPDATA || process.env.HOME, '.terminalizer');

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  loadYAML: loadYAML,
  loadJSON: loadJSON,
  resolveFilePath: resolveFilePath,
  getDefaultConfig: getDefaultConfig,
  changeYAMLValue: changeYAMLValue,
  getGlobalDirectory: getGlobalDirectory
};
