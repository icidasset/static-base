"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _buildHtml = require("./build/html");

var _buildJavascripts = require("./build/javascripts");

var _buildStatic_assets = require("./build/static_assets");

var _buildStylesheets = require("./build/stylesheets");

var _markdown = require("./markdown");

var _collections = require("./collections");

var collections = _interopRequireWildcard(_collections);

var _pages = require("./pages");

var pages = _interopRequireWildcard(_pages);

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var _cliClean = require("./cli/clean");

var _cliClean2 = _interopRequireDefault(_cliClean);

var _cliWatch = require("./cli/watch");

var _cliWatch2 = _interopRequireDefault(_cliWatch);

/// Class
///

var _default = (function () {
  var _class = function _default(base_path, options) {
    _classCallCheck(this, _class);

    if (!base_path) {
      this.is_ready = false;
      return console.error("StaticBase error: base_path was not given");
    }

    this.options = this.clean_options(base_path, options);
    this.markdown_parser = _markdown.parser;

    // paths & directories
    this.derive_paths_from_options();

    // trees
    if (!options.skip_trees) {
      this.collections_tree = collections.make_tree(this);

      var _pages$make_tree = pages.make_tree(this);

      var _pages$make_tree2 = _slicedToArray(_pages$make_tree, 2);

      this.pages_tree = _pages$make_tree2[0];
      this.navigation_items = _pages$make_tree2[1];

      this.is_ready = true;
    }
  };

  _createClass(_class, [{
    key: "build",

    /// Build
    ///
    value: function build() {
      var partial = arguments[0] === undefined ? false : arguments[0];

      var promises = [];

      if (!this.is_ready) {
        return false;
      }

      switch (partial) {

        case "html":
          promises.push((0, _buildHtml.build)(this));
          break;

        case "css":
        case "stylesheets":
          promises.push((0, _buildStylesheets.build)(this));
          break;

        case "js":
        case "javascripts":
          promises.push((0, _buildJavascripts.build)(this));
          break;

        case "static_assets":
          promises.push((0, _buildStatic_assets.build)(this));
          break;

        default:
          promises.push((0, _buildHtml.build)(this));
          promises.push((0, _buildStylesheets.build)(this));
          promises.push((0, _buildJavascripts.build)(this));
          promises.push((0, _buildStatic_assets.build)(this));
      }

      return Promise.all(promises);
    }
  }, {
    key: "clean",

    /// CLI commands
    ///
    value: function clean() {
      if (this.is_ready) {
        (0, _cliClean2["default"])(this);
      }
    }
  }, {
    key: "watch",
    value: function watch() {
      if (this.is_ready) {
        (0, _cliWatch2["default"])(this);
      }
    }
  }, {
    key: "clean_options",

    /// Options
    ///
    value: function clean_options(base_path, options) {
      var obj = Object.assign({ base_path: base_path }, options);

      utils.obj_ensure(obj, "content.frontmatter");
      utils.obj_ensure(obj, "assets");

      // jspm paths
      if (obj.assets.jspm_config_path) {
        obj.assets.jspm_config_path = utils.clean_path(obj.assets.jspm_config_path);
      } else {
        obj.assets.jspm_config_path = "lib/jspm_config.js";
      }

      if (obj.assets.jspm_packages_path) {
        obj.assets.jspm_packages_path = utils.clean_path(obj.assets.jspm_packages_path);
      } else {
        obj.assets.jspm_packages_path = "build/assets/jspm_packages";
      }

      // node_modules path
      if (!obj.node_modules_path) {
        obj.node_modules_path = "node_modules";
      }

      return obj;
    }
  }, {
    key: "derive_paths_from_options",

    /// Paths & directories
    ///
    value: function derive_paths_from_options() {
      var opts = this.options;
      var paths = {};
      var directories = {};

      directories.content = utils.obj_get(opts, "content.directory") || "content";
      directories.assets = utils.obj_get(opts, "assets.directory") || "assets";
      directories.assets_css = utils.obj_get(opts, "assets.css_directory") || "stylesheets";
      directories.assets_js = utils.obj_get(opts, "assets.js_directory") || "javascripts";
      directories.assets_static = utils.obj_get(opts, "assets.static_directories") || [];
      directories.build = utils.obj_get(opts, "build.directory") || "build";

      paths.base = opts.base_path.replace(/\/+$/, "");
      paths.content = "" + paths.base + "/" + directories.content;
      paths.assets = "" + paths.base + "/" + directories.assets;
      paths.assets_css = "" + paths.base + "/" + directories.assets + "/" + directories.assets_css;
      paths.assets_js = "" + paths.base + "/" + directories.assets + "/" + directories.assets_js;
      paths.assets_static = directories.assets_static.map(function (p) {
        return "" + paths.assets + "/" + p;
      });
      paths.build = "" + paths.base + "/" + directories.build;

      paths.jspm_config = "" + paths.base + "/" + opts.assets.jspm_config_path;
      paths.jspm_packages = "" + paths.base + "/" + opts.assets.jspm_packages_path;
      paths.node_modules = "" + paths.base + "/" + opts.node_modules_path;

      utils.obj_traverse(paths, function (v, k) {
        if (typeof v === "string") paths[k] = _path2["default"].normalize(v);else if (typeof v === "object") paths[k] = v.map(function (p) {
          return _path2["default"].normalize(p);
        });
      });

      this.paths = paths;
      this.directories = directories;
    }
  }]);

  return _class;
})();

exports["default"] = _default;
module.exports = exports["default"];