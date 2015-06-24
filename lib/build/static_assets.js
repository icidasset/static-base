/*

  TASK:

  Copy directories:
  - assets/fonts
  - assets/images

  ---> build/assets/{{name}}

  Copy collection assets:
  - collections[collection].assets

  ---> build/assets/collections/{{collection}}

*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _traverse = require("traverse");

var _traverse2 = _interopRequireDefault(_traverse);

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

/// Copy static-assets directories
///
function copy_static_directories(paths, dirs) {
  paths.assets_static.forEach(function (static_asset_path) {
    var static_asset_dir = static_asset_path.replace(paths.assets, "");

    _fsExtra2["default"].copySync(static_asset_path, paths.build + "/" + dirs.assets + "/" + static_asset_dir);
  });
}

///
/// Collections
///
function copy_collection_assets(paths, dirs, tree) {
  utils.obj_traverse(tree, function (collection_obj, collection_key) {

    (0, _traverse2["default"])(collection_obj).forEach(function (value) {
      var value_is_object = typeof value === "object";
      var assets_is_array = Object.prototype.toString.call(value.assets) === "[object Array]";

      if (value_is_object && assets_is_array) {
        (function () {
          var destination = paths.build + "/" + dirs.assets + "/collections/" + collection_key;

          // make destination directory path
          if (value.assets.length) _fsExtra2["default"].mkdirsSync(destination);

          // copy assets to destination
          value.assets.forEach(function (asset) {
            _fsExtra2["default"].copySync(paths.content + "/collections/" + collection_key + "/" + asset, destination + "/" + asset);
          });
        })();
      }
    });
  });
}

/// Build
///

function build(static_base) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  console.log("> Build static assets");

  var paths = static_base.paths;
  var dirs = static_base.directories;

  copy_static_directories(paths, dirs);
  copy_collection_assets(paths, dirs, static_base.collections_tree);
}