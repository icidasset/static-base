"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jsonBeautify = require("json-beautify");

var _jsonBeautify2 = _interopRequireDefault(_jsonBeautify);

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

function add_jspm_to_package_json(static_base) {
  var package_json_path = "" + static_base.paths.base + "/package.json";
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
      directories: { packages: "build/assets/jspm_packages" },
      configFile: "lib/jspm_config.js"
    };

    _fs2["default"].writeFileSync(package_json_path, (0, _jsonBeautify2["default"])(obj, null, 2, 8));
  }
}

exports["default"] = function (static_base) {
  add_jspm_to_package_json(static_base);
};

module.exports = exports["default"];