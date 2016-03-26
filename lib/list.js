'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (pattern, deps) {
  return new Promise(function (resolve, reject) {
    (0, _glob2['default'])(pattern, { cwd: deps.root }, function (err, matches) {
      if (err) return reject(err);

      var matchesWithoutWorkDirectory = matches.map(function (p) {
        return p.replace(new RegExp('^/?' + deps.wd + '/?'), '');
      });

      resolve(matchesWithoutWorkDirectory);
    });
  });
};

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }