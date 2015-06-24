/*

  TASK:

  Copy directories:
  - assets/fonts
  - assets/images

  ---> build/assets/{{name}}

  Copy collection assets:
  - collections[collection].assets

  ---> build/assets/collections/{{collection}}

*/

import fse from "fs-extra";
import traverse from "traverse";

import * as utils from "../utils";


/// Copy static-assets directories
///
function copy_static_directories(paths, dirs) {
  paths.assets_static.forEach(function(static_asset_path) {
    let static_asset_dir = static_asset_path.replace(paths.assets, "");

    fse.copySync(
      static_asset_path,
      `${paths.build}/${dirs.assets}/${static_asset_dir}`
    );
  });
}


///
/// Collections
///
function copy_collection_assets(paths, dirs, tree) {
  utils.obj_traverse(tree, function(collection_obj, collection_key) {

    traverse(collection_obj).forEach(function(value) {
      let value_is_object = (typeof value === "object");
      let assets_is_array = (Object.prototype.toString.call(value.assets) === "[object Array]");

      if (value_is_object && assets_is_array) {
        let destination = `${paths.build}/${dirs.assets}/collections/${collection_key}`;

        // make destination directory path
        if (value.assets.length) fse.mkdirsSync(destination);

        // copy assets to destination
        value.assets.forEach(function(asset) {
          fse.copySync(
            `${paths.content}/collections/${collection_key}/${asset}`,
            `${destination}/${asset}`
          );
        });
      }
    });

  });
}


/// Build
///
export function build(static_base, options={}) {
  console.log("> Build static assets");

  let paths = static_base.paths;
  let dirs = static_base.directories;

  copy_static_directories(paths, dirs);
  copy_collection_assets(paths, dirs, static_base.collections_tree);
}
