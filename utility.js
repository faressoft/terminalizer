/**
 * Provide utility functions
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

import path from 'path';
import fs from 'fs';
import uuid from 'uuid';
import os from 'os';
import * as yaml from 'js-yaml';

/**
 * Check if a path represents a valid path for a file
 *
 * @param  {String}  filePath an absolute or a relative path
 * @return {Boolean}
 */
function isFile(filePath) {
  // Resolve the path into an absolute path
  filePath = path.resolve(filePath);

  try {
    return fs.statSync(filePath).isFile();
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
  dirPath = path.resolve(dirPath);

  try {
    return fs.statSync(dirPath).isDirectory();
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
    throw new Error("The provided file doesn't exit");
  }

  // Read the file
  try {
    content = fs.readFileSync(filePath);
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
      json: yaml.load(file),
      raw: file.toString(),
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
    file = fs.readFileSync(filePath);
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
 * Resolve to an absolute path
 *
 * Accepts
 *   - FileName
 *   - FileName.ext
 *   - /path/to/FileName
 *   - /path/to/FileName.ext
 *
 * - Add the extension if not already added
 * - Resolve to `/path/to/FileName.ext`
 *
 * @param  {String} filePath  an absolute or a relative path
 * @param  {String} extension
 * @return {String}
 */
function resolveFilePath(filePath, extension) {
  var resolvedPath = path.resolve(filePath);

  // The extension is not added
  if (path.extname(resolvedPath) != '.' + extension) {
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
  var defaultConfigPath = path.join(ROOT_PATH, 'config.yml');
  var globalConfigPath = path.join(getGlobalDirectory(), 'config.yml');

  // The global config file exists
  if (isFile(globalConfigPath)) {
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
 * Get the path of the global config directory
 *
 * - For Windows, get the path of APPDATA
 * - For Linux and MacOS, get the path of the home directory
 *
 * @return {String}
 */
function getGlobalDirectory() {
  // Windows
  if (typeof process.env.APPDATA != 'undefined') {
    return path.join(process.env.APPDATA, 'terminalizer');
  }

  return path.join(process.env.HOME, '.terminalizer');
}

/**
 * Check if the global config directory is created
 *
 * @return {Boolean}
 */
function isGlobalDirectoryCreated() {
  var globalDirPath = getGlobalDirectory();

  return isDir(globalDirPath);
}

/**
 * Generate and save a token to be used for uploading recordings
 *
 * @param  {String} token
 * @return {String}
 */
function generateToken(token) {
  var token = uuid.v4();
  var globalDirPath = getGlobalDirectory();
  var tokenPath = path.join(globalDirPath, 'token.txt');

  fs.writeFileSync(tokenPath, token, 'utf8');

  return token;
}

/**
 * Get registered token for uploading recordings
 *
 * @return {String|Null}
 */
function getToken() {
  var globalDirPath = getGlobalDirectory();
  var tokenPath = path.join(globalDirPath, 'token.txt');

  // The file doesn't exist
  if (!isFile(tokenPath)) {
    return null;
  }

  return fs.readFileSync(tokenPath, 'utf8');
}

/**
 * Remove a registered token
 */
function removeToken() {
  var globalDirPath = getGlobalDirectory();
  var tokenPath = path.join(globalDirPath, 'token.txt');

  // The file doesn't exist
  if (!isFile(tokenPath)) {
    return;
  }

  fs.unlinkSync(tokenPath);
}

/**
 * Get the name of the current OS
 *
 * @return {String} mac, windows, linux
 */
function getOS() {
  // MacOS
  if (os.platform() == 'darwin') {
    return 'mac';

    // Windows
  } else if (os.platform() == 'win32') {
    return 'windows';
  }

  return 'linux';
}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

export default {
  loadYAML: loadYAML,
  loadJSON: loadJSON,
  resolveFilePath: resolveFilePath,
  getDefaultConfig: getDefaultConfig,
  changeYAMLValue: changeYAMLValue,
  getGlobalDirectory: getGlobalDirectory,
  isGlobalDirectoryCreated: isGlobalDirectoryCreated,
  generateToken: generateToken,
  getToken: getToken,
  removeToken: removeToken,
  getOS: getOS,
};
