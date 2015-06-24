"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _nodeBourbon = require("node-bourbon");

var _nodeBourbon2 = _interopRequireDefault(_nodeBourbon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _nodeSass = require("node-sass");

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

/// application.css
///
function build_application_css(paths, dirs, options) {
  return new Promise(function (resolve, reject) {

    var result = undefined;

    try {
      result = _nodeSass2["default"].renderSync({
        file: paths.assets_css + "/application.scss",
        includePaths: [].concat(_nodeBourbon2["default"].includePaths),
        outputStyle: options.minify ? "compressed" : "nested"
      });
    } catch (err) {
      reject("(" + dirs.assets_css + ") " + err);
    }

    var css = result.css;

    _fsExtra2["default"].mkdirsSync(paths.build + "/" + dirs.assets + "/" + dirs.assets_css);
    _fs2["default"].writeFileSync(paths.build + "/" + dirs.assets + "/" + dirs.assets_css + "/application.css", css);

    resolve();
  });
}

/// <Build>
///

function build(static_base) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  console.log("> Build stylesheets");

  if (utils.file_exists(static_base.paths.assets_css + "/application.scss")) {
    return build_application_css(static_base.paths, static_base.directories, options);
  }
}