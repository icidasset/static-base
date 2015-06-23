import path from "path";

import { build as build_html } from "./build/html";
import { build as build_javascripts } from "./build/javascripts";
import { build as build_json } from "./build/json";
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

    this.options = this.clean_options(base_path, options);
    this.markdown_parser = markdown;

    // paths & directories
    this.derive_paths_from_options();

    // ready
    this.is_ready = true;
  }


  /// Build
  ///
  build(partial=false, minify=false) {
    let promises = [];

    if (!this.is_ready) {
      return false;
    } else if (!this.pages_tree) {
      this.collections_tree = collections.make_tree(this);
      [this.pages_tree, this.navigation_items] = pages.make_tree(this);
    }

    switch (partial) {

      case "html":
        promises.push( build_html(this, minify) );
        break;

      case "css":
      case "stylesheets":
        promises.push( build_stylesheets(this, minify) );
        break;

      case "js":
      case "javascripts":
        promises.push( build_javascripts(this, minify) );
        break;

      case "static_assets":
        promises.push( build_static_assets(this) );
        break;

      case "json":
        promises.push( build_json(this) );
        break;

      default:
        promises.push( build_html(this, minify) );
        promises.push( build_stylesheets(this, minify) );
        promises.push( build_javascripts(this, minify) );
        promises.push( build_static_assets(this) );
        promises.push( build_json(this) );
    }

    return Promise.all(promises);
  }


  /// CLI commands
  ///
  clean() { if (this.is_ready) { clean(this); }}
  watch() { if (this.is_ready) { watch(this); }}


  /// Options
  ///
  clean_options(base_path, options) {
    let obj = Object.assign({ base_path: base_path }, options);

    utils.obj_ensure(obj, "content/frontmatter");
    utils.obj_ensure(obj, "assets");

    // jspm paths
    if (obj.assets.jspm_config_path) {
      obj.assets.jspm_config_path = utils.clean_path(obj.assets.jspm_config_path);
    } else {
      obj.assets.jspm_config_path = "lib/jspm_config.js";
    }

    if (obj.assets.jspm_packages_path) {
      obj.assets.jspm_packages_path = utils.clean_path(obj.assets.jspm_packages_path);
    } else {
      obj.assets.jspm_packages_path = "build/assets/jspm_packages";
    }

    // node_modules path
    if (!obj.node_modules_path) {
      obj.node_modules_path = "node_modules";
    }

    return obj;
  }


  /// Paths & directories
  ///
  derive_paths_from_options() {
    let opts = this.options;
    let paths = {};
    let directories = {};

    directories.content       = utils.obj_get(opts, "content/directory") || "content";
    directories.assets        = utils.obj_get(opts, "assets/directory") || "assets";
    directories.assets_css    = utils.obj_get(opts, "assets/css_directory") || "stylesheets";
    directories.assets_js     = utils.obj_get(opts, "assets/js_directory") || "javascripts";
    directories.assets_static = utils.obj_get(opts, "assets/static_directories") || [];
    directories.build         = utils.obj_get(opts, "build/directory") || "build";
    directories.build_json    = utils.obj_get(opts, "build/json_directory") || "data";

    paths.base            = opts.base_path.replace(/\/+$/, "");
    paths.content         = `${paths.base}/${directories.content}`;
    paths.assets          = `${paths.base}/${directories.assets}`;
    paths.assets_css      = `${paths.base}/${directories.assets}/${directories.assets_css}`;
    paths.assets_js       = `${paths.base}/${directories.assets}/${directories.assets_js}`;
    paths.assets_static   = directories.assets_static.map((p) => `${paths.assets}/${p}`);
    paths.build           = `${paths.base}/${directories.build}`;
    paths.build_json      = `${paths.base}/${directories.build}/${directories.build_json}`;

    paths.jspm_config     = `${paths.base}/${opts.assets.jspm_config_path}`;
    paths.jspm_packages   = `${paths.base}/${opts.assets.jspm_packages_path}`;
    paths.node_modules    = `${paths.base}/${opts.node_modules_path}`;
    paths.node_modules_sb = `${paths.node_modules}/static-base/node_modules`;

    utils.obj_traverse(paths, function(v, k) {
      if (typeof v === "string") paths[k] = path.normalize(v);
      else if (typeof v === "object") paths[k] = v.map((p) => path.normalize(p));
    });

    this.paths = paths;
    this.directories = directories;
  }

}
