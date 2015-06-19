"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _markdownIt = require("markdown-it");

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var parser = new _markdownIt2["default"]();
exports.parser = parser;