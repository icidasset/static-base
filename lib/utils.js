/**
 * Cleans up a "path", that is removes trailing slashes,
 * leading slashes or dot-slashes.
 * @param {string} path
 * @param {Object} [options={}]
 * @param {boolean} options.start
 * @param {boolean} options.end
 * @return {string} The cleaned up path
 */
export function cleanPath(path, options = {}) {
  let cleanedPath = path;

  if (options.end) cleanedPath = cleanedPath.replace(/\/+$/g, '');
  if (options.start) cleanedPath = cleanedPath.replace(/^\.*\/+/g, '');

  return cleanedPath;
}
