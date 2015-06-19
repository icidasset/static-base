import walk from "walkdir";

import { CollectionTree } from "./tree";
import * as utils from "./utils";


/// Make Tree
///
export function make_tree(static_base) {
  let collections = utils.obj_get(static_base.options, "content.collections");
  let big_tree = {};

  // parse each collection and add it to the "main" tree
  utils.obj_traverse(collections, function(collection_fn, collection_key) {
    let path = `${static_base.paths.content}/collections/${collection_key}`;
    let tree = new CollectionTree(path, collection_fn);

    walk.sync(path).forEach(function(file_path) {
      let item_path = file_path.replace(`${tree.base_path}/`, "");
      collection_fn(file_path, item_path, tree, utils);
    });

    big_tree[collection_key] = tree.get_object();
  });

  return big_tree;
}