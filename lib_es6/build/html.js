/*

  TASK:

  Parse handlebars templates and partials.
  Generate html files for all pages (template wrapped in layout).

*/

import fs from "fs";
import fse from "fs-extra";
import handlebars from "handlebars";
import path from "path";
import walk from "walkdir";
import { minify as minify_html } from "html-minifier";

import * as handlebars_helpers from "../handlebars/helpers";
import * as utils from "../utils";


/// Handlebars
///
function retrieve(path_to_retrieve: string, base_path: string, callback) {
  let obj = {};
  let semi_base_path = `${base_path}/${path_to_retrieve}`;

  walk.sync(semi_base_path)
    .filter((p) => p.endsWith(".hbs"))
    .forEach(function(file_path) {
      let name = utils.path_to_key(file_path, semi_base_path);
      let template = fs.readFileSync(file_path, utils.DEFAULT_ENCODING);
      obj[name] = callback(name, template);
    });

  return obj;
}


function retrieve_templates(isolated_handlebars, base_path: string) {
  let obj = {};

  obj.partials = retrieve("templates/partials", base_path, function(name, template) {
      isolated_handlebars.registerPartial(name, template);
      return template;
  });

  obj.pages = retrieve("templates/pages", base_path, function(name, template) {
      return isolated_handlebars.compile(template);
  });

  obj.layouts = retrieve("layouts", base_path, function(name, template) {
      return isolated_handlebars.compile(template);
  });

  return obj;
}


function register_handlebars_helpers(isolated_handlebars) {
  isolated_handlebars.registerHelper(handlebars_helpers);
}


/// <Build>
///
export function build(static_base, options={}) {
  console.log("> Build html");

  let isolated_handlebars = handlebars.create();
  let templates = retrieve_templates(isolated_handlebars, static_base.paths.base);

  register_handlebars_helpers(
    isolated_handlebars
  );

  utils.obj_traverse(static_base.pages_tree, function(page_obj) {
    let html_path = utils.route_to_path(page_obj.__route);
    let html_path_dir = path.dirname(html_path);

    let page_template = templates.pages[page_obj.__template];
    let page_template_data = Object.assign({
      __tree: static_base.pages_tree,
      __navigation_items: static_base.navigation_items
    }, page_obj);

    // render
    let html = templates.layouts.application(
      Object.assign({ yield: page_template(page_template_data) }, page_template_data)
    );

    if (options.minify) {
      html = minify_html(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        minifyJS: true,
        minifyCSS: true
      });
    }

    // make html file
    fse.mkdirsSync(`${static_base.paths.build}/${html_path_dir}`);
    fs.writeFileSync(`${static_base.paths.build}/${html_path}`, html);
  });
}
