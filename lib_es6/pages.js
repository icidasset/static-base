import walk from "walkdir";

import * as utils from "./utils";
import { PagesTree } from "./tree";


/// Make Tree
///
/// Processes the files in the `pages` directory.
/// Parses .toml and .md files, and stores it in a `tree`.
///
function handle_file(page_path: string) {
  let obj;

  if (page_path.endsWith(".toml")) {
    obj = utils.parse_toml_file(page_path);
  } else if (page_path.endsWith(".md")) {
    obj = utils.parse_markdown_file(page_path);
  }

  if (obj) {
    this.handle_item(obj, page_path);
  }
}


export function make_tree(static_base) {
  let pages_path = static_base.paths.content + "/pages";
  let tree = new PagesTree(pages_path, static_base.collections_tree);

  walk.sync(pages_path)
      .forEach(handle_file.bind(tree));

  return [
    tree.get_object(),
    tree.make_navigation_items()
  ];
}
