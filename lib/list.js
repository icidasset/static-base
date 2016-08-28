'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = list;

var _utils = require('./utils');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Makes a list of all the files that match the given glob pattern.
 * @param {string} pattern
 * @param {Dependencies} deps
 * @return {string[]} List of file paths relative from deps.wd (paths)
 */
function list(pattern, deps) {
  return new Promise(function (resolve, reject) {
    (0, _glob2['default'])(pattern, { cwd: deps.root }, function (err, matches) {
      if (err) return reject(err);

      var matchesWithoutWorkDirectory = matches.map(function (path) {
        var regex = new RegExp('^' + deps.wd + '/+');
        return (0, _utils.cleanPath)(path, { beginning: true }).replace(regex, '');
      });

      resolve(matchesWithoutWorkDirectory);
    });
  });
}