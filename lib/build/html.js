/*

  TASK:

  Parse handlebars templates and partials.
  Generate html files for all pages (template wrapped in layout).

*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _handlebars = require("handlebars");

var _handlebars2 = _interopRequireDefault(_handlebars);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _walkdir = require("walkdir");

var _walkdir2 = _interopRequireDefault(_walkdir);

var _handlebarsHelpers = require("../handlebars/helpers");

var handlebars_helpers = _interopRequireWildcard(_handlebarsHelpers);

var _utils = require("../utils");

var utils = _interopRequireWildcard(_utils);

/// Handlebars
///
function retrieve(path_to_retrieve, base_path, callback) {
  if (typeof path_to_retrieve !== "string") throw new TypeError("Value of argument 'path_to_retrieve' violates contract.");
  if (typeof base_path !== "string") throw new TypeError("Value of argument 'base_path' violates contract.");

  var obj = {};
  var semi_base_path = base_path + "/" + path_to_retrieve;

  _walkdir2["default"].sync(semi_base_path).filter(function (p) {
    return p.endsWith(".hbs");
  }).forEach(function (file_path) {
    var name = utils.path_to_key(file_path, semi_base_path);
    var template = _fs2["default"].readFileSync(file_path, utils.DEFAULT_ENCODING);
    obj[name] = callback(name, template);
  });

  return obj;
}

function retrieve_templates(isolated_handlebars, base_path) {
  if (typeof base_path !== "string") throw new TypeError("Value of argument 'base_path' violates contract.");

  var obj = {};

  obj.partials = retrieve("templates/partials", base_path, function (name, template) {
    isolated_handlebars.registerPartial(name, template);
    return template;
  });

  obj.pages = retrieve("templates/pages", base_path, function (name, template) {
    return isolated_handlebars.compile(template);
  });

  obj.layouts = retrieve("layouts", base_path, function (name, template) {
    return isolated_handlebars.compile(template);
  });

  return obj;
}

function register_handlebars_helpers(isolated_handlebars) {
  utils.obj_traverse(handlebars_helpers, function (fn, name) {
    isolated_handlebars.registerHelper(name, fn);
  });
}

/// <Build>
///

function build(static_base) {
  console.log("> Build html");

  var isolated_handlebars = _handlebars2["default"].create();
  var templates = retrieve_templates(isolated_handlebars, static_base.paths.base);

  register_handlebars_helpers(isolated_handlebars);

  utils.obj_traverse(static_base.pages_tree, function (page_obj) {
    var html_path = utils.route_to_path(page_obj.__route);
    var html_path_dir = _path2["default"].dirname(html_path);

    var page_template = templates.pages[page_obj.__template];
    var page_template_data = Object.assign({
      __tree: static_base.pages_tree,
      __navigation_items: static_base.navigation_items
    }, page_obj);

    // render
    var html = templates.layouts.application(Object.assign({ "yield": page_template(page_template_data) }, page_template_data));

    // make html file
    _fsExtra2["default"].mkdirsSync(static_base.paths.build + "/" + html_path_dir);
    _fs2["default"].writeFileSync(static_base.paths.build + "/" + html_path, html);
  });
}