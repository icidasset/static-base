'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (pattern, deps) {
  if (pattern) {
    return _glob2['default'].sync(pattern, { cwd: deps.root }).map(function (p) {
      return p.replace(new RegExp('^' + deps.wd), '');
    });
  }

  return [];
};

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }