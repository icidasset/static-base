/*

  TASK:

  Data -> JSON

*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

/// Build JSON
///
function build_json(static_base) {
  var obj = {
    collections_tree: static_base.collections_tree,
    pages_tree: static_base.pages_tree,
    navigation_items: static_base.navigation_items
  };

  var json = JSON.stringify(obj);

  _fsExtra2["default"].mkdirsSync("" + static_base.paths.build_json);
  _fs2["default"].writeFileSync(static_base.paths.build_json + "/default.json", json);
}

/// Build
///

function build(static_base) {
  console.log("> Build JSON");

  build_json(static_base);
}