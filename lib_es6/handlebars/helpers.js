///
/// [Private]
///
function path_to_root_prefix(current_route) {
  if (!current_route || current_route.length === 0) {
    return "";
  } else {
    var split = current_route.split("/");
    var path_prefix = "";

    for (let s of split) {
      if (s !== "") path_prefix += "../";
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
export function relative_route(options) {
  let current_route = get_route(options, this);
  let context_route = this.__route;

  return remove_double_slashes(path_to_root_prefix(current_route) + context_route);
}


export function asset_path(path_from_assets_directory, options) {
  let current_route = get_route(options, this);
  let p;

  p = path_to_root_prefix(current_route) + "assets/" + path_from_assets_directory;
  p = remove_double_slashes(p);

  return p;
}


///
/// Block helpers
///
export function childPages(options) {
  let output = "";

  if (options.data && options.data.root) {
    let root_key = `${options.data.root.__key}/`;

    Object.keys(options.data.root.__tree || []).forEach(function(tree_key) {
      if (tree_key.indexOf(root_key) === 0) {
        output = output + options.fn(options.data.root.__tree[tree_key]);
      }
    });
  }

  return output;
}


export function navigationItems(options) {
  let output = "";

  if (options.data && options.data.root) {
    (options.data.root.__navigation_items || []).forEach(function(nav_item) {
      let context = options.data.root.__tree[nav_item.page_key];
      output = output + options.fn(context);
    });
  }

  return output;
}


export function ifCurrentPage(options) {
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


export function ifCurrentPageOrChild(options) {
  if (options.data && options.data.root) {
    if ((options.data.root.__key === this.__key) ||
        (options.data.root.__key.indexOf(this.__key + "/") === 0)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  } else {
    return options.inverse(this);
  }
}


export function ifEqual(lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars helper 'ifEqual' needs 2 parameters");
  if (lvalue !== rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
}


export function ifStartsWith(val, check, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars helper 'ifStartsWith' needs 2 parameters");
  if (val.match(new RegExp("^" + check))) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}


export function linkTo(obj, current_route, options) {
  var href;

  if (typeof obj === "string") {
    href = obj;
  } else {
    current_route = get_route(current_route, this);
    href = remove_double_slashes(path_to_root_prefix(current_route) + obj.__route);
  }

  return `<a href="${href}">${options.fn(this)}</a>`;
}


///
/// Other helpers
///
export function concatStrings(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlebars helper 'concatStrings' needs 2 parameters");
  }

  return lvalue + rvalue;
}
