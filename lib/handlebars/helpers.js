///
/// [Private]
///
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relative_path = relative_path;
exports.asset_path = asset_path;
exports.ifEqual = ifEqual;
exports.ifStartsWith = ifStartsWith;
exports.linkTo = linkTo;
exports.concatStrings = concatStrings;
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

function get_route(route, context) {
  return route == null || typeof route !== "string" ? context.__route : route;
}

///
/// Path helpers
///

function relative_path(path, current_route) {
  current_route = get_route(current_route, this);
  return remove_double_slashes(path_to_root_prefix(current_route) + path);
}

function asset_path(path_from_assets_directory, current_route) {
  current_route = get_route(current_route, this);

  var p = path_to_root_prefix(current_route) + "assets/" + path_from_assets_directory;
  p = remove_double_slashes(p);

  return p;
}

///
/// Block helpers
///

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