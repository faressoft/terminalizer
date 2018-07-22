/**
 * Dependency Injection
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var is = require('is_js');

/**
 * Dependencies
 * @type {Object}
 */
var dependency = {};

/**
 * Get a specific dependency
 * 
 * @param  {String}      key
 * @return {Object|Null} return null if not found
 */
module.exports.get = function(key) {

  // Not found
  if (is.not.propertyDefined(dependency, key)) {
    return null;
  }

  return dependency[key];
  
};

/**
 * Set/Add a dependency
 * 
 * @param {String} key
 * @param {Object} value
 */
module.exports.set = function(key, value) {

  dependency[key] = value;
  module.exports[key] = value;

};
