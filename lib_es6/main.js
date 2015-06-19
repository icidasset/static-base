import fse from "fs-extra";

import { build as build_html } from "./build/html";
import { build as build_javascripts } from "./build/javascripts";
import { build as build_static_assets } from "./build/static_assets";
import { build as build_stylesheets } from "./build/stylesheets";
import { parser as markdown } from "./markdown";

import * as collections from "./collections";
import * as pages from "./pages";
import * as utils from "./utils";

import clean from "./cli/clean";
import watch from "./cli/watch";


/// Class
///
export default class {

  constructor(base_path, options) {
    if (!base_path) {
      this.is_ready = false;
      return console.error("StaticBase error: base_path was not given");
    }

    this.options = Object.assign({ base_path: base_path }, options);
    this.markdown_parser = markdown;
    this.is_ready = true;

    // paths & directories
    this.derive_paths_from_options();
    this.ensure_paths();

    // trees
    this.collections_tree = collections.make_tree(this);
    [this.pages_tree, this.navigation_items] = pages.make_tree(this);
  }


  /// Build
  ///
  build(partial=false) {
    if (!this.is_ready) {
      return false;
    }

    switch (partial) {

      case "html":
        build_html(this);
        break;

      case "css":
      case "stylesheets":
        build_stylesheets(this);
        break;

      case "js":
      case "javascripts":
        build_javascripts(this);
        break;

      case "static_assets":
        build_static_assets(this);
        break;

      default:
        build_html(this);
        build_stylesheets(this);
        build_javascripts(this);
        build_static_assets(this);
    }
  }


  /// Clean
  ///
  clean() {
    if (this.is_ready) clean(this);
  }


  /// Watch
  ///
  watch() {
    if (this.is_ready) watch(this);
  }


  /// Paths & directories
  ///
  derive_paths_from_options() {
    let opts = this.options;
    let paths = {};
    let directories = {};

    directories.content       = utils.obj_get(opts, "content.directory") || "content";
    directories.assets        = utils.obj_get(opts, "assets.directory") || "assets";
    directories.assets_css    = utils.obj_get(opts, "assets.css_directory") || "stylesheets";
    directories.assets_js     = utils.obj_get(opts, "assets.js_directory") || "javascripts";
    directories.assets_static = utils.obj_get(opts, "assets.static_directories") || [];
    directories.build         = utils.obj_get(opts, "build.directory") || "build";

    paths.base            = opts.base_path.replace(/\/+$/, "");
    paths.content         = `${paths.base}/${directories.content}`;
    paths.assets          = `${paths.base}/${directories.assets}`;
    paths.assets_css      = `${paths.base}/${directories.assets}/${directories.assets_css}`;
    paths.assets_js       = `${paths.base}/${directories.assets}/${directories.assets_js}`;
    paths.assets_static   = directories.assets_static.map((p) => `${paths.assets}/${p}`);
    paths.build           = `${paths.base}/${directories.build}`;

    this.paths = paths;
    this.directories = directories;
  }


  ensure_paths() {
    fse.ensureDirSync(this.paths.assets_css);
    fse.ensureDirSync(this.paths.assets_js);
    this.paths.assets_static.forEach((p) => fse.ensureDirSync(p));
  }

}
