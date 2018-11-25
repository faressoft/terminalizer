/**
 * Dependency injection
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var path = require('path'),
    _ = require('lodash');

/**
 * Dependency injection
 */
function DI() {

  /**
   * Injected dependecies
   * @type {Object}
   */
  this._dependencies = {};

  /**
   * A wrapper proxy object to set traps
   * @type {Proxy}
   */
  this._proxy = new Proxy(this, {
    get: this.getHandler,
    set: this.setHandler
  });

  return this._proxy;

}

/**
 * Trap for getting a property value
 * 
 * @param  {Object} target
 * @param  {String} key
 * @return {*}
 */
DI.prototype.getHandler = function(target, key) {

  if (key in target) {
    return target[key];
  }

  if (key in target._dependencies) {
    return target._dependencies[key];
  }

};

/**
 * Trap for setting a property value
 * 
 * @param  {Object} target
 * @param  {String} key
 * @param  {*}      value
 * @return {*}
 */
DI.prototype.setHandler = function(target, key, value) {

  if (key in target) {
    throw new Error(`It is not allowed to set '${key}'`);
  }

  target._dependencies[key] = value;

  return true;

};

/**
 * Require and set a package
 *
 * - Require the module
 * - Add the module as depndency
 * - Format the key as
 *   - Convert the moduleName to camelCase
 *   - Remove the extension
 * - Resolve third party packages as the native `require`.
 * - Resolve our own scripts with paths relative to
 *   the app's root path `require`.
 * 
 * @param {String} moduleName
 * @param {String} key        (Optional) (Default: the moduleName camel cased)
 */
DI.prototype.require = function(moduleName, key) {

  var parsedModuleName = path.parse(moduleName);

  // Default value for key
  if (typeof key == 'undefined') {
    key = _.camelCase(parsedModuleName.name);
  }

  // Is not a third party package
  if (parsedModuleName.dir != '') {

    // Resolve the path to an absolute path
    moduleName = path.resolve(this._getAppRootPath(), moduleName);

  }

  this._dependencies[key] = require(moduleName);

};

/**
 * Inject a dependency
 * 
 * @param {String} key
 * @param {*}      value
 */
DI.prototype.set = function(key, value) {

  this[key] = value;
  
};

/**
 * Get an injected dependency
 * 
 * @param  {String} key
 * @return {*}
 */
DI.prototype.get = function(key) {

  return this[key];
  
};

/**
 * Get the root path of the app
 *
 * - Follow the module.parent.parent... etc until null
 * 
 * @return {String}
 */
DI.prototype._getAppRootPath = function() {

  var parent = module.parent;

  while (parent.parent) {

    parent = parent.parent;
    
  }

  return path.dirname(parent.filename);

};

module.exports = DI;
