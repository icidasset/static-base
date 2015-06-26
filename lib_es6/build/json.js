/*

  TASK:

  Data -> JSON

*/

import fs from "fs";
import fse from "fs-extra";


/// Build JSON
///
function build_json(static_base) {
  let obj = {
    __tree: static_base.pages_tree,
    __navigation_items: static_base.navigation_items
  };

  let json = JSON.stringify(
    obj
  );

  fse.mkdirsSync(`${static_base.paths.build_json}`);
  fs.writeFileSync(`${static_base.paths.build_json}/default.json`, json);
}


/// Build
///
export function build(static_base, options={}) {
  console.log("> Build json");

  build_json(static_base);
}
