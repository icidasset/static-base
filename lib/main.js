"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

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

    this.options = Object.assign({ base_path: base_path }, options);
    this.markdown_parser = _markdown.parser;
    this.is_ready = true;

    // paths & directories
    this.derive_paths_from_options();
    this.ensure_paths();

    // trees
    this.collections_tree = collections.make_tree(this);

    var _pages$make_tree = pages.make_tree(this);

    var _pages$make_tree2 = _slicedToArray(_pages$make_tree, 2);

    this.pages_tree = _pages$make_tree2[0];
    this.navigation_items = _pages$make_tree2[1];
  };

  _createClass(_class, [{
    key: "build",

    /// Build
    ///
    value: function build() {
      var partial = arguments[0] === undefined ? false : arguments[0];

      if (!this.is_ready) {
        return false;
      }

      switch (partial) {

        case "html":
          (0, _buildHtml.build)(this);
          break;

        case "css":
        case "stylesheets":
          (0, _buildStylesheets.build)(this);
          break;

        case "js":
        case "javascripts":
          (0, _buildJavascripts.build)(this);
          break;

        case "static_assets":
          (0, _buildStatic_assets.build)(this);
          break;

        default:
          (0, _buildHtml.build)(this);
          (0, _buildStylesheets.build)(this);
          (0, _buildJavascripts.build)(this);
          (0, _buildStatic_assets.build)(this);
      }
    }
  }, {
    key: "clean",

    /// Clean
    ///
    value: function clean() {
      if (this.is_ready) (0, _cliClean2["default"])(this);
    }
  }, {
    key: "watch",

    /// Watch
    ///
    value: function watch() {
      if (this.is_ready) (0, _cliWatch2["default"])(this);
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

      this.paths = paths;
      this.directories = directories;
    }
  }, {
    key: "ensure_paths",
    value: function ensure_paths() {
      _fsExtra2["default"].ensureDirSync(this.paths.assets_css);
      _fsExtra2["default"].ensureDirSync(this.paths.assets_js);
      this.paths.assets_static.forEach(function (p) {
        return _fsExtra2["default"].ensureDirSync(p);
      });
    }
  }]);

  return _class;
})();

exports["default"] = _default;
module.exports = exports["default"];