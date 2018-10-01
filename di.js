/**
 * Dependency Injection
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Set/Add a dependency
 * 
 * @param {String} key
 * @param {Object} value
 */
module.exports.set = function(key, value) {

  module.exports[key] = value;

};
