"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jspm = require("jspm");

var _jspm2 = _interopRequireDefault(_jspm);

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

/// JSPM -> application.js
///
function copy_jspm_config(paths, dirs) {
  _fsExtra2["default"].copySync("" + paths.jspm_config, "" + paths.build + "/" + dirs.assets + "/" + dirs.assets_js + "/jspm_config.js");
}

function run_jspm(paths, dirs) {
  _jspm2["default"].setPackagePath(paths.base);
  _jspm2["default"].dlLoader().then(function () {
    return _jspm2["default"].install(true, { quick: true });
  }).then(function () {
    copy_jspm_config(paths, dirs);

    return _jspm2["default"].bundleSFX("" + paths.assets_js + "/application.js", "" + paths.build + "/" + dirs.assets + "/" + dirs.assets_js + "/application.js", { mangle: false, sourceMaps: false });
  }).then(function () {
    console.log(_colors2["default"].green("JSPM install & bundle success"));
  });
}

/// <Build>
///

function build(static_base) {
  console.log("> Build javascripts");

  if (utils.file_exists("" + static_base.paths.assets_js + "/application.js")) {
    run_jspm(static_base.paths, static_base.directories);
  }
}