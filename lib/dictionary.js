'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.buildDefinition = buildDefinition;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*

Input:

paths = [
  'sub/example.ext',
]

deps = {
  root: '/Users/icidasset/Projects/icid-asset',
  wd: 'src/templates',
}

Output:

[
  {
    path: 'sub/example.ext',
    entirePath: '/Users/icidasset/Projects/icid-asset/src/templates/sub/example.ext',

    wd: 'src/templates',
    root: '/Users/icidasset/Projects/icid-asset',
    dirname: 'sub',
    basename: 'example',
    extname: '.ext',
  }
]

*/
function build(paths, deps) {
  return paths.map(function (path) {
    return buildDefinition(path, deps);
  });
}

function buildDefinition(path, deps) {
  var cleanedPath = (0, _utils.cleanPath)(path, { beginning: true });

  return {
    path: cleanedPath,
    entirePath: _path2['default'].join(deps.root, deps.wd, cleanedPath),

    wd: deps.wd,
    root: deps.root,
    dirname: (0, _utils.cleanPath)(_path2['default'].dirname(cleanedPath), { beginning: true, end: true }),
    basename: _path2['default'].basename(cleanedPath, _path2['default'].extname(cleanedPath)),
    extname: _path2['default'].extname(cleanedPath)
  };
}