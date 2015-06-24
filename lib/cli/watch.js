"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _chokidar = require("chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var IGNORED = [/^\.git/, /^node_modules/, /^build/, /jspm_config\.js$/, /(^|\/)\.(\w|-)+/, "package.json"];

function watch_handler(event, path) {
  if (path.endsWith(".scss")) {
    this.build("stylesheets");
  } else if (path.endsWith(".js")) {
    if (path.match(/^lib\//)) {
      this.build();
    } else {
      this.build("javascripts");
    }
  } else if (path.endsWith(".hbs")) {
    this.build("html");
  } else if (path.match(/^content\//)) {
    this.build("html");
    this.build("json");
    this.build("static_assets");
  } else if (path.match(/^assets\//)) {
    this.build("static_assets");
  }

  console.log(_colors2["default"].bold("'" + path + "' changed"));
}

exports["default"] = function (static_base) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  console.log("> Watch");

  _chokidar2["default"].watch(".", { ignored: IGNORED, ignoreInitial: true }).on("all", watch_handler.bind(static_base));
};

module.exports = exports["default"];