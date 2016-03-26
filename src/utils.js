/**
 * Cleans up a "path", that is, removes trailing slashes,
 * leading slashes or dot-slashes.
 * @param {string} path
 * @param {Object} [options={}]
 * @param {boolean} options.beginning
 * @param {boolean} options.end
 * @return {string} The cleaned up path
 */
export function cleanPath(path, options = {}) {
  let cleanedPath = path;

  if (options.beginning) cleanedPath = cleanedPath.replace(/(^\.\/+|^\/+|^\.$)/g, '');
  if (options.end) cleanedPath = cleanedPath.replace(/\/+$/g, '');

  return cleanedPath;
}
