"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse_toml_file = parse_toml_file;
exports.parse_markdown_file = parse_markdown_file;
exports.extract_title_from_markdown = extract_title_from_markdown;
exports.path_to_key = path_to_key;
exports.key_to_route = key_to_route;
exports.route_to_path = route_to_path;
exports.clean_path = clean_path;
exports.obj_get = obj_get;
exports.obj_set = obj_set;
exports.obj_ensure = obj_ensure;
exports.obj_traverse = obj_traverse;
exports.file_exists = file_exists;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _grayMatter = require("gray-matter");

var _grayMatter2 = _interopRequireDefault(_grayMatter);

var _toml = require("toml");

var _toml2 = _interopRequireDefault(_toml);

var _traverse = require("traverse");

var _traverse2 = _interopRequireDefault(_traverse);

var DEFAULT_ENCODING = "utf-8";

exports.DEFAULT_ENCODING = DEFAULT_ENCODING;
/// {Parsing}
/// Parse TOML file
///

function parse_toml_file(file_path) {
  if (typeof file_path !== "string") throw new TypeError("Value of argument 'file_path' violates contract.");

  var obj = undefined;

  try {
    obj = _toml2["default"].parse(_fs2["default"].readFileSync(file_path));
  } catch (e) {
    console.error("TOML parsing error in '" + file_path + "' on line " + e.line + ": " + e.message + ".");
  }

  return obj;
}

/// Parse Markdown file
///

function parse_markdown_file(parser, file_path) {
  var front_matter_use_toml = arguments[2] === undefined ? false : arguments[2];
  if (typeof file_path !== "string") throw new TypeError("Value of argument 'file_path' violates contract.");

  var file_contents_as_string = _fs2["default"].readFileSync(file_path, { encoding: DEFAULT_ENCODING });
  var front_matter_parser = front_matter_use_toml ? _toml2["default"].parse : false;
  var front_matter = undefined,
      parsed_markdown = undefined,
      result = undefined;

  try {
    front_matter = (0, _grayMatter2["default"])(file_contents_as_string, { parser: front_matter_parser });
    parsed_markdown = parser.render(front_matter.content);
  } catch (e) {
    console.error("Markdown parsing error in '" + file_path + "': " + e.message + ".");
  }

  if (front_matter) {
    result = Object.assign({ parsed_markdown: parsed_markdown }, front_matter.data);
    result.title = result.title || extract_title_from_markdown(front_matter.content);

    return result;
  }
}

/// Extract title from markdown
///

function extract_title_from_markdown(markdown_text) {
  if (typeof markdown_text !== "string") throw new TypeError("Value of argument 'markdown_text' violates contract.");

  var match = markdown_text.match(/^\#{1} ?((\w| |-)+)$/m);
  return match ? match[1] : null;
}

/// {Keys}
/// Path to key
///

function path_to_key(file_path, base_path) {
  if (typeof file_path !== "string") throw new TypeError("Value of argument 'file_path' violates contract.");
  if (typeof base_path !== "string") throw new TypeError("Value of argument 'base_path' violates contract.");

  return file_path.replace(base_path, "").replace(/\.\w+$/, "").replace(/^\/+/, "");
}

/// Key to route
///

function key_to_route(key) {
  if (typeof key !== "string") throw new TypeError("Value of argument 'key' violates contract.");

  return key.replace(/\[index\]/g, "").replace(/\/{2,}/, "/");
}

/// Route to path
///

function route_to_path(route) {
  if (typeof route !== "string") throw new TypeError("Value of argument 'route' violates contract.");

  return ((route === "/" ? "" : route) + "/index.html").replace(/^\//, "");
}

/// Clean path
///

function clean_path(path) {
  if (typeof path !== "string") throw new TypeError("Value of argument 'path' violates contract.");

  return path.replace(/(^\.*\/+|\/+$)/, "");
}

/// {Objects}
/// Get value
///

function obj_get(obj, path) {
  return (0, _traverse2["default"])(obj).get(path.split("."));
}

function obj_set(obj, path, value) {
  return (0, _traverse2["default"])(obj).set(path.split("."), value);
}

function obj_ensure(obj, path) {
  if (!obj_get(obj, path)) obj_set(obj, path, {});
}

function obj_traverse(obj, callback) {
  var level = arguments[2] === undefined ? 1 : arguments[2];

  (0, _traverse2["default"])(obj).forEach(function (x) {
    if (this.level === level) callback(x, this.key);
  });
}

/// {Files}
/// Check if file exists, if not give a warning
///

function file_exists(path) {
  if (typeof path !== "string") throw new TypeError("Value of argument 'path' violates contract.");

  try {
    _fs2["default"].accessSync(path);
    return true;
  } catch (e) {
    console.log(_colors2["default"].yellow("WARNING: '" + path + "' was not found"));
    return false;
  }
}