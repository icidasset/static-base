import globParent from 'glob-parent';
import pathUtils from 'path';

import { cleanPath } from './utils';


/**
 * A dictionary item, a definition.
 * @typedef {Object} Definition
 * @property {string} path        - e.g. `sub/example.ext`
 * @property {string} entirePath  - e.g. `/Users/icidasset/Projects/portfolio/src/templates/sub/example.ext`
 * @property {string} wd          - e.g. `src/templates`
 * @property {string} root        - e.g. `/Users/icidasset/Projects/portfolio`
 * @property {string} dirname     - e.g. `sub`
 * @property {string} basename    - e.g. `example`
 * @property {string} extname     - e.g. `.ext`
 * @property {string} pattern     - e.g. `** / *.ext` (without the spaces)
 */


/**
 * A dictionary.
 * @typedef {Definition[]} Dictionary
 */


/**
 * A subset of a Definition, is used to initially build a Definition.
 * @typedef {Object} Dependencies
 * @property {string} pattern
 * @property {string} wd
 * @property {string} root
 */


/**
 * Build dictionary.
 * @param {string[]} paths
 * @param {Dependencies} deps
 * @return {Dictionary}
 */
export function buildDictionary(paths, deps) {
  return paths.map((path) => buildDefinition(path, deps));
}


/**
 * Build definition.
 * @param {string} path
 * @param {Dependencies} deps
 * @return {Definition}
 */
export function buildDefinition(path, deps) {
  const cleanedPath = cleanPath(path, { beginning: true });

  return {
    path: cleanedPath,
    entirePath: pathUtils.join(deps.root, deps.wd, cleanedPath),

    pattern: deps.pattern,
    wd: deps.wd,
    root: deps.root,

    dirname: cleanPath(pathUtils.dirname(cleanedPath), { beginning: true, end: true }),
    basename: pathUtils.basename(cleanedPath, pathUtils.extname(cleanedPath)),
    extname: pathUtils.extname(cleanedPath),
  };
}


/**
 * Build dependencies.
 * @param {string} pattern
 * @param {string} root
 * @return {Dependencies}
 */
export function buildDependencies(pattern, root) {
  const patternParent = pattern.length ? globParent(pattern) : '';

  return {
    pattern: pattern,
    wd: cleanPath(patternParent, { beginning: true, end: true }),
    root: cleanPath(root, { end: true }),
  };
}
