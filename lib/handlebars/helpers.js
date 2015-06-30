"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relative_route = relative_route;
exports.asset_path = asset_path;
exports.childPages = childPages;
exports.navigationItems = navigationItems;
exports.ifCurrentPage = ifCurrentPage;
exports.ifCurrentPageOrChild = ifCurrentPageOrChild;
exports.ifEqual = ifEqual;
exports.ifStartsWith = ifStartsWith;
exports.linkTo = linkTo;
exports.concatStrings = concatStrings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sortOn = require("sort-on");

var _sortOn2 = _interopRequireDefault(_sortOn);

///
/// [Private]
///
function path_to_root_prefix(current_route) {
  if (!current_route || current_route.length === 0) {
    return "";
  } else {
    var split = current_route.split("/");
    var path_prefix = "";

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = split[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var s = _step.value;

        if (s !== "") path_prefix += "../";
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return path_prefix;
  }
}

function remove_double_slashes(str) {
  return str.replace(/\/{2,}/g, "/");
}

function get_route(options, context) {
  return options.data && options.data.root ? options.data.root.__route : context.__route;
}

///
/// Path helpers
///

function relative_route(options) {
  var current_route = get_route(options, this);
  var context_route = this.__route;

  return remove_double_slashes(path_to_root_prefix(current_route) + context_route);
}

function asset_path(path_from_assets_directory, options) {
  var current_route = get_route(options, this);
  var p = undefined;

  p = path_to_root_prefix(current_route) + "assets/" + path_from_assets_directory;
  p = remove_double_slashes(p);

  return p;
}

///
/// Block helpers
///

function childPages(options) {
  var output = "";

  if (options.data && options.data.root) {
    (function () {
      var root_key = options.data.root.__key + "/";
      var sort_by = options.hash.sortBy || "__key";
      var tree_keys = [];

      Object.keys(options.data.root.__tree).forEach(function (tree_key) {
        var obj = undefined;

        if (tree_key.indexOf(root_key) === 0) {
          obj = options.data.root.__tree[tree_key];

          tree_keys.push({
            key: tree_key,
            sort_by: obj[sort_by]
          });
        }
      });

      tree_keys = (0, _sortOn2["default"])(tree_keys, "sort_by");

      var sort_dir = (options.hash.sortDirection || "ASC").toUpperCase();
      if (sort_dir === "DESC") tree_keys = tree_keys.reverse();

      tree_keys.forEach(function (t) {
        output = output + options.fn(options.data.root.__tree[t.key]);
      });
    })();
  }

  return output;
}

function navigationItems(options) {
  var output = "";

  if (options.data && options.data.root) {
    (options.data.root.__navigation_items || []).forEach(function (nav_item) {
      var context = options.data.root.__tree[nav_item.page_key];
      output = output + options.fn(context);
    });
  }

  return output;
}

function ifCurrentPage(options) {
  if (options.data && options.data.root) {
    if (options.data.root.__key === this.__key) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  } else {
    return options.inverse(this);
  }
}

function ifCurrentPageOrChild(options) {
  if (options.data && options.data.root) {
    if (options.data.root.__key === this.__key || options.data.root.__key.indexOf(this.__key + "/") === 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  } else {
    return options.inverse(this);
  }
}

function ifEqual(lvalue, rvalue, options) {
  if (arguments.length < 3) throw new Error("Handlebars helper 'ifEqual' needs 2 parameters");
  if (lvalue !== rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
}

function ifStartsWith(val, check, options) {
  if (arguments.length < 3) throw new Error("Handlebars helper 'ifStartsWith' needs 2 parameters");
  if (val.match(new RegExp("^" + check))) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

function linkTo(obj, current_route, options) {
  var href;

  if (typeof obj === "string") {
    href = obj;
  } else {
    current_route = get_route(current_route, this);
    href = remove_double_slashes(path_to_root_prefix(current_route) + obj.__route);
  }

  return "<a href=\"" + href + "\">" + options.fn(this) + "</a>";
}

///
/// Other helpers
///

function concatStrings(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlebars helper 'concatStrings' needs 2 parameters");
  }

  return lvalue + rvalue;
}