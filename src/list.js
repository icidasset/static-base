import glob from 'glob';


/**
 * Makes a list of all the files that match the given glob pattern.
 * @param {string} pattern
 * @param {Object} deps - See index.js for a description of this param
 * @return {string[]} List of file paths relative from deps.wd
 */
export default function(pattern, deps) {
  if (pattern) {
    return glob
    .sync(pattern, { cwd: deps.root })
    .map(p => p.replace(new RegExp(`^${deps.wd}`), ''));
  }

  return [];
}
