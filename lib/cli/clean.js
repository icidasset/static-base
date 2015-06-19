"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _child_process = require("child_process");

function build_command(static_base) {
  var build_path = static_base.paths.build;

  var cmd = ["find " + build_path];

  var ignore = ["" + build_path + "/" + static_base.directories.assets + "/jspm_packages", "" + build_path + "/" + static_base.directories.assets + "$", "" + build_path + "$"];

  cmd = cmd.concat(ignore.map(function (i) {
    return "grep -v \"" + i + "\"";
  }));

  cmd.push("xargs rm -rf");
  return cmd.join(" | ");
}

exports["default"] = function (static_base) {
  console.log("> Clean");
  (0, _child_process.exec)(build_command(static_base));
};

module.exports = exports["default"];