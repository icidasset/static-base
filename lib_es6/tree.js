import * as utils from "./utils";


class Tree {

  constructor(base_path: string) {
    this.__obj = {};
    this.base_path = base_path;
  }


  store(key: string, value, extend=false) {
    this.__obj[key] = extend ? (this.__obj[key] || {}) : value;
    if (extend) Object.assign(this.__obj[key], value);
    return this.__obj[key];
  }


  get_object() {
    return Object.assign({}, this.__obj);
  }

}


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
export class PagesTree extends Tree {

  constructor(base_path, collections_tree) {
    super(base_path);

    this.collections_tree = collections_tree;
  }


  handle_item(item_obj, file_path) {
    let page_key        = utils.path_to_key(file_path, this.base_path);
    let tree_obj        = this.store(page_key, item_obj, true);

    tree_obj.settings   = tree_obj.settings || {};

    tree_obj.__key        = page_key;
    tree_obj.__route      = tree_obj.settings.route;
    tree_obj.__template   = tree_obj.settings.template || page_key;

    if (tree_obj.__route === undefined) {
      tree_obj.__route = utils.key_to_route(page_key);
    }

    // collections
    if (tree_obj.settings.collection) {
      let collection = tree_obj.settings.collection;
      let collection_tree_obj = this.collections_tree[collection.name];

      utils.obj_traverse(collection_tree_obj, (item) => {
        if (item.__item_key && item.__item_route) {
          this.handle_collection_item(collection, tree_obj.__key, tree_obj.__route, item);
        }
      });
    }
  }


  handle_collection_item(collection, page_key: string, page_route: string, item) {
    let route_prefix_a = page_route.length ? `${page_route}/` : ``;
    let route_prefix_b = collection.route_prefix || ``;

    let item_page_key = `${page_key}/${item.__item_key}`;
    let item_page_route = `${route_prefix_a}${route_prefix_b}${item.__item_route}`;

    let attr = {
      __key: item_page_key,
      __route: item_page_route,
      __template: collection.template || item_page_key
    };

    // -> tree
    this.store(
      item_page_key,
      Object.assign(attr, item),
      true
    );
  }


  /// [extra]
  ///
  make_navigation_items() {
    let arr = [];

    utils.obj_traverse(this.__obj, function(page_obj, page_key) {
      let nav_idx = page_obj.settings && page_obj.settings.nav_index;
      if (nav_idx) arr.push({ page_key: page_key, idx: nav_idx });
    });

    arr.sort(function(a, b) {
      if (a.idx > b.idx) return 1;
      else if (a.idx < b.idx) return -1;
      else return 0;
    });

    return arr;
  }

}


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
export class CollectionTree extends Tree {

  handle_data(key: string, item_obj) {
    if (item_obj) {
      item_obj.__item_key   = key;
      item_obj.__item_route = utils.key_to_route(key);

      this.store(key, item_obj, true);
    }
  }


  handle_asset(asset_path: string, key) {
    let obj;

    if (key) {
      this.__obj[key] = this.__obj[key] || {};
      obj = this.__obj[key];
    } else {
      obj = this.__obj;
    }

    asset_path = asset_path.replace(`${this.base_path}/`, "");

    obj.assets = obj.assets || [];
    obj.assets.push(asset_path);
  }

}
