"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.make_tree = make_tree;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _walkdir = require("walkdir");

var _walkdir2 = _interopRequireDefault(_walkdir);

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var _tree = require("./tree");

/// Make Tree
///
/// Processes the files in the `pages` directory.
/// Parses .toml and .md files, and stores it in a `tree`.
///
function handle_file(page_path) {
  if (typeof page_path !== "string") throw new TypeError("Value of argument 'page_path' violates contract.");

  var obj = undefined;

  if (page_path.endsWith(".toml")) {
    obj = utils.parse_toml_file(page_path);
  } else if (page_path.endsWith(".md")) {
    obj = utils.parse_markdown_file(this.static_base.markdown_parser, page_path, !!this.static_base.options.content.frontmatter.use_toml_syntax);
  }

  if (obj) {
    this.tree.handle_item(obj, page_path);
  }
}

function make_tree(static_base) {
  var pages_path = static_base.paths.content + "/pages";
  var tree = new _tree.PagesTree(pages_path, static_base.collections_tree);

  _walkdir2["default"].sync(pages_path).forEach(handle_file.bind({
    static_base: static_base,
    tree: tree
  }));

  return [tree.get_object(), tree.make_navigation_items()];
}