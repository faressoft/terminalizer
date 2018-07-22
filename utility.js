/**
 * Provide utility functions
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Check, load, and parse YAML files
 *
 * - Add .yml extension when needed
 * 
 * Throws
 * - The provided file doesn't exit
 * - The provided file is not a valid YAML file
 * 
 * @param  {String} filePath an absolute or a relative path
 * @return {Object}
 */
function loadYAML(filePath) {

  var file = null;

  // Rsolve the path into an absolute path
  filePath = di.path.resolve(filePath);

  // The file doesn't exist
  if (!di.fs.existsSync(filePath)) {

    // A file with .yml suffix also doesn't exist
    if (!di.fs.existsSync(filePath + '.yml')) {
      throw new Error('The provided file doesn\'t exit');
    } else {
      filePath = filePath + '.yml';
    }

  }

  // Read the file
  try {
    file = di.fs.readFileSync(filePath);
  } catch (error) {
    throw new Error(error);
  }

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
 * 
 * @param  {String} filePath an absolute or a relative path
 * @return {Object}
 */
function loadJSON(filePath) {

  var file = null;

  // Rsolve the path into an absolute path
  filePath = di.path.resolve(filePath);

  // The file doesn't exist
  if (!di.fs.existsSync(filePath)) {

    // A file with .json suffix also doesn't exist
    if (!di.fs.existsSync(filePath + '.json')) {
      throw new Error('The provided file doesn\'t exit');
    } else {
      filePath = filePath + '.json';
    }

  }

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
 * @return {Object} {json, raw}
 */
function getDefaultConfig() {

  var filePath = di.path.join(__dirname, 'config.yml');

  return loadYAML(filePath);

}

/**
 * Change a value for a specific key in YAML
 * 
 * - Works only with the first level keys
 * - Workds only with keys with a single value
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

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  loadYAML: loadYAML,
  loadJSON: loadJSON,
  resolveFilePath: resolveFilePath,
  getDefaultConfig: getDefaultConfig,
  changeYAMLValue: changeYAMLValue
};
