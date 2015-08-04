"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require("child_process");

function build_command(static_base) {
  var hard = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var build_path = static_base.paths.build;

  var cmd = ["find " + build_path];

  var ignore = [build_path + "$"].concat(hard ? [] : [build_path + "/" + static_base.directories.assets + "/" + static_base.directories.assets_js, build_path + "/" + static_base.directories.assets + "$", "" + static_base.options.assets.jspm_packages_path]);

  cmd = cmd.concat(ignore.map(function (i) {
    return "grep -v \"" + i + "\"";
  }));

  cmd.push("xargs rm -rf");
  return cmd.join(" | ");
}

exports["default"] = function (static_base) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log("> Clean");
  (0, _child_process.execSync)(build_command(static_base, options.hard));
};

module.exports = exports["default"];