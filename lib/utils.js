'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanPath = cleanPath;
/**
 * Cleans up a "path", that is, removes trailing slashes,
 * leading slashes or dot-slashes.
 * @param {string} path
 * @param {Object} [options={}]
 * @param {boolean} options.beginning
 * @param {boolean} options.end
 * @return {string} The cleaned up path
 */
function cleanPath(path) {
  var options = arguments.length <= 1 || arguments[1] === void 0 ? {} : arguments[1];

  var cleanedPath = path;

  if (options.beginning) cleanedPath = cleanedPath.replace(/(^\.\/+|^\/+|^\.$)/g, '');
  if (options.end) cleanedPath = cleanedPath.replace(/\/+$/g, '');

  return cleanedPath;
}