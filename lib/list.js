import glob from 'glob';

import dictionary from './dictionary';


/**
 * Makes a list of all the files that match the given glob pattern,
 * and then translates that to a dictionary.
 * @param {string} pattern
 * @param {Object} deps - See index.js for a description of this param
 * @return {Object[]} dictionary - See dictionary.js for a description of this param
 */
export default function(pattern, deps) {
  return dictionary(
    glob.sync(pattern, { cwd: deps.wd }),
    deps
  );
}
