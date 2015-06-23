"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jsonBeautify = require("json-beautify");

var _jsonBeautify2 = _interopRequireDefault(_jsonBeautify);

var _jspm = require("jspm");

var _jspm2 = _interopRequireDefault(_jspm);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

/// JSPM -> setup
///
function add_jspm_to_package_json(paths, dirs, opts) {
  var package_json_path = paths.base + "/package.json";
  var should_read = true;
  var obj = {};

  try {
    _fs2["default"].accessSync(package_json_path);
  } catch (e) {
    should_read = false;
  }

  if (should_read) {
    obj = JSON.parse(_fs2["default"].readFileSync(package_json_path, { encoding: utils.DEFAULT_ENCODING }));
  }

  if (!obj.jspm) {
    obj.jspm = {
      directories: { packages: opts.assets.jspm_packages_path },
      configFile: opts.assets.jspm_config_path,
      devDependencies: {}
    };

    _fs2["default"].writeFileSync(package_json_path, (0, _jsonBeautify2["default"])(obj, null, 2, 8));
  } else if (!obj.jspm.devDependencies) {
    obj.jspm.devDependencies = {};

    _fs2["default"].writeFileSync(package_json_path, (0, _jsonBeautify2["default"])(obj, null, 2, 8));
  }
}

/// JSPM -> config.js
///
function copy_jspm_config(paths, dirs) {
  _fsExtra2["default"].copySync("" + paths.jspm_config, paths.build + "/" + dirs.assets + "/" + dirs.assets_js + "/" + _path2["default"].basename(paths.jspm_config));
}

/// JSPM -> application.js
///
function run_jspm(paths, dirs, minify) {
  _jspm2["default"].setPackagePath(paths.base);

  // install, build jspm & return promise
  return _jspm2["default"].dlLoader("babel").then(function () {
    return _jspm2["default"].install(true, { quick: true });
  }).then(function () {
    copy_jspm_config(paths, dirs);

    return _jspm2["default"].bundleSFX(paths.assets_js + "/application.js", paths.build + "/" + dirs.assets + "/" + dirs.assets_js + "/application.js", { sourceMaps: !minify, minify: minify });
  }).then(function () {
    console.log(_colors2["default"].green("JSPM install & bundle success"));
  });
}

/// Handlebars templates
///
function build_handlebars_templates(paths, dirs, minify) {
  _fsExtra2["default"].mkdirsSync(paths.build + "/" + dirs.assets + "/" + dirs.assets_js);

  var cmd = [paths.node_modules_sb + "/.bin/handlebars", paths.base + "/templates", "--output " + paths.build + "/" + dirs.assets + "/" + dirs.assets_js + "/handlebars_templates.js", "--commonjs", "--extension hbs", minify ? "--min" : ""];

  (0, _child_process.execSync)(cmd.join(" "));
}

/// <Build>
///

function build(static_base) {
  var minify = arguments[1] === undefined ? false : arguments[1];

  console.log("> Build javascripts");

  var paths = static_base.paths;
  var dirs = static_base.directories;

  if (utils.file_exists(static_base.paths.assets_js + "/application.js")) {
    add_jspm_to_package_json(paths, dirs, static_base.options);

    return Promise.all([run_jspm(paths, dirs, minify), build_handlebars_templates(paths, dirs, minify)]);
  }
}