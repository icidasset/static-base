"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var Tree = (function () {
  function Tree(base_path) {
    _classCallCheck(this, Tree);

    if (typeof base_path !== "string") throw new TypeError("Value of argument 'base_path' violates contract.");

    this.__obj = {};
    this.base_path = base_path;
  }

  _createClass(Tree, [{
    key: "store",
    value: function store(key, value) {
      var extend = arguments[2] === undefined ? false : arguments[2];
      if (typeof key !== "string") throw new TypeError("Value of argument 'key' violates contract.");

      this.__obj[key] = extend ? this.__obj[key] || {} : value;
      if (extend) Object.assign(this.__obj[key], value);
      return this.__obj[key];
    }
  }, {
    key: "get_object",
    value: function get_object() {
      return Object.assign({}, this.__obj);
    }
  }]);

  return Tree;
})();

/// Pages
///
/// # Tree format
/// { "page_key": {
///     "__key": "page_key",
///     "__route": "page_route",
///     "__template": "page_template",
///
///     "other_property": ...
/// }}
///
/// # [extra] Navigation-items format
/// [ { page_key: "example" } ]
///
///

var PagesTree = (function (_Tree) {
  function PagesTree(base_path, collections_tree) {
    _classCallCheck(this, PagesTree);

    _get(Object.getPrototypeOf(PagesTree.prototype), "constructor", this).call(this, base_path);

    this.collections_tree = collections_tree;
  }

  _inherits(PagesTree, _Tree);

  _createClass(PagesTree, [{
    key: "handle_item",
    value: function handle_item(item_obj, file_path) {
      var _this = this;

      var page_key = utils.path_to_key(file_path, this.base_path);
      var tree_obj = this.store(page_key, item_obj, true);

      tree_obj.settings = tree_obj.settings || {};

      tree_obj.__key = page_key;
      tree_obj.__route = tree_obj.settings.route;
      tree_obj.__template = tree_obj.settings.template || page_key;

      if (tree_obj.__route === undefined) {
        tree_obj.__route = utils.key_to_route(page_key);
      }

      // collections
      if (tree_obj.settings.collection) {
        (function () {
          var collection = tree_obj.settings.collection;
          var collection_tree_obj = _this.collections_tree[collection.name];

          utils.obj_traverse(collection_tree_obj, function (item) {
            if (item.__item_key && item.__item_route) {
              _this.handle_collection_item(collection, tree_obj.__key, tree_obj.__route, item);
            }
          });
        })();
      }
    }
  }, {
    key: "handle_collection_item",
    value: function handle_collection_item(collection, page_key, page_route, item) {
      if (typeof page_key !== "string") throw new TypeError("Value of argument 'page_key' violates contract.");
      if (typeof page_route !== "string") throw new TypeError("Value of argument 'page_route' violates contract.");

      var route_prefix_a = page_route.length ? page_route + "/" : "";
      var route_prefix_b = collection.route_prefix || "";

      var item_page_key = page_key + "/" + item.__item_key;
      var item_page_route = "" + route_prefix_a + route_prefix_b + item.__item_route;

      var attr = {
        __key: item_page_key,
        __route: item_page_route,
        __template: collection.template || item_page_key
      };

      // -> tree
      this.store(item_page_key, Object.assign(attr, item), true);
    }
  }, {
    key: "make_navigation_items",

    /// [extra]
    ///
    value: function make_navigation_items() {
      var arr = [];

      utils.obj_traverse(this.__obj, function (page_obj, page_key) {
        var nav_idx = page_obj.settings && page_obj.settings.nav_index;
        if (nav_idx) arr.push({ page_key: page_key, idx: nav_idx });
      });

      arr.sort(function (a, b) {
        if (a.idx > b.idx) return 1;else if (a.idx < b.idx) return -1;else return 0;
      });

      return arr;
    }
  }]);

  return PagesTree;
})(Tree);

exports.PagesTree = PagesTree;

/// Collections
///
/// # Tree format
/// { "assets": [
///     "collection-sub-directory-name/filename.ext"
///   ],
///
///   "item_key": {
///     "__item_key": "page_key",
///     "__item_route": "page_route",
///
///     "other_property": ...
/// }}
///

var CollectionTree = (function (_Tree2) {
  function CollectionTree() {
    _classCallCheck(this, CollectionTree);

    _get(Object.getPrototypeOf(CollectionTree.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(CollectionTree, _Tree2);

  _createClass(CollectionTree, [{
    key: "handle_data",
    value: function handle_data(key, item_obj) {
      if (typeof key !== "string") throw new TypeError("Value of argument 'key' violates contract.");

      if (item_obj) {
        item_obj.__item_key = key;
        item_obj.__item_route = utils.key_to_route(key);

        this.store(key, item_obj, true);
      }
    }
  }, {
    key: "handle_asset",
    value: function handle_asset(asset_path, key) {
      if (typeof asset_path !== "string") throw new TypeError("Value of argument 'asset_path' violates contract.");

      var obj = undefined;

      if (key) {
        this.__obj[key] = this.__obj[key] || {};
        obj = this.__obj[key];
      } else {
        obj = this.__obj;
      }

      asset_path = asset_path.replace(this.base_path + "/", "");

      obj.assets = obj.assets || [];
      obj.assets.push(asset_path);
    }
  }]);

  return CollectionTree;
})(Tree);

exports.CollectionTree = CollectionTree;