"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make_tree = make_tree;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _walkdir = require("walkdir");

var _walkdir2 = _interopRequireDefault(_walkdir);

var _tree = require("./tree");

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

/// Make Tree
///

function make_tree(static_base) {
  var collections = utils.obj_get(static_base.options, "content.collections");
  var big_tree = {};

  // parsers
  var parsers = {
    parse_toml_file: utils.parse_toml_file,
    parse_markdown_file: function parse_markdown_file(file_path) {
      return utils.parse_markdown_file(static_base.markdown_parser, file_path, !!static_base.options.content.frontmatter.use_toml_syntax);
    }
  };

  // parse each collection and add it to the "main" tree
  utils.obj_traverse(collections, function (collection_fn, collection_key) {
    var path = static_base.paths.content + "/collections/" + collection_key;
    var tree = new _tree.CollectionTree(path, collection_fn);

    _walkdir2["default"].sync(path).forEach(function (file_path) {
      var item_path = file_path.replace(tree.base_path + "/", "");
      collection_fn(file_path, item_path, tree, parsers);
    });

    big_tree[collection_key] = tree.get_object();
  });

  return big_tree;
}