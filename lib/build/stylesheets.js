"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _nodeBourbon = require("node-bourbon");

var _nodeBourbon2 = _interopRequireDefault(_nodeBourbon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _nodeSass = require("node-sass");

var _nodeSass2 = _interopRequireDefault(_nodeSass);

/// application.css
///
function build_application_css(paths, dirs) {
  var result = _nodeSass2["default"].renderSync({
    file: "" + paths.assets_css + "/application.scss",
    includePaths: [].concat(_nodeBourbon2["default"].includePaths),
    outputStyle: "compressed"
  });

  _fsExtra2["default"].mkdirsSync("" + paths.build + "/" + dirs.assets + "/" + dirs.assets_css);
  _fs2["default"].writeFileSync("" + paths.build + "/" + dirs.assets + "/" + dirs.assets_css + "/application.css", result.css);
}

/// <Build>
///

function build(static_base) {
  console.log("> Build stylesheets");

  var paths = static_base.paths;
  var dirs = static_base.directories;

  build_application_css(paths, dirs);
}