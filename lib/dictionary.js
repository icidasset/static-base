'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDictionary = buildDictionary;
exports.buildDefinition = buildDefinition;
exports.buildDependencies = buildDependencies;

var _utils = require('./utils');

var _globParent = require('glob-parent');

var _globParent2 = _interopRequireDefault(_globParent);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
function buildDictionary(paths, deps) {
  return paths.map(function (path) {
    return buildDefinition(path, deps);
  });
}

/**
 * Build definition.
 * @param {string} path
 * @param {Dependencies} deps
 * @return {Definition}
 */
function buildDefinition(path, deps) {
  var cleanedPath = (0, _utils.cleanPath)(path, { beginning: true });

  return {
    path: cleanedPath,
    entirePath: _path2['default'].join(deps.root, deps.wd, cleanedPath),

    pattern: deps.pattern,
    wd: deps.wd,
    root: deps.root,

    dirname: (0, _utils.cleanPath)(_path2['default'].dirname(cleanedPath), { beginning: true, end: true }),
    basename: _path2['default'].basename(cleanedPath, _path2['default'].extname(cleanedPath)),
    extname: _path2['default'].extname(cleanedPath)
  };
}

/**
 * Build dependencies.
 * @param {string} pattern
 * @param {string} root
 * @return {Dependencies}
 */
function buildDependencies(pattern, root) {
  var patternParent = pattern.length ? (0, _globParent2['default'])(pattern) : '';

  return {
    pattern: pattern,
    wd: (0, _utils.cleanPath)(patternParent, { beginning: true, end: true }),
    root: (0, _utils.cleanPath)(root, { end: true })
  };
}