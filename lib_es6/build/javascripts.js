import colors from "colors";
import fs from "fs";
import fse from "fs-extra";
import json_beautify from "json-beautify";
import jspm from "jspm";
import path from "path";
import { execSync } from "child_process";

import * as utils from "../utils";


/// JSPM -> setup
///
function add_jspm_to_package_json(paths, dirs, opts) {
  let package_json_path = `${paths.base}/package.json`;
  let should_read = true;
  let obj = {};

  try {
    fs.accessSync(package_json_path);
  } catch (e) {
    should_read = false;
  }

  if (should_read) {
    obj = JSON.parse(fs.readFileSync(package_json_path, { encoding: utils.DEFAULT_ENCODING }));
  }

  if (!obj.jspm) {
    obj.jspm = {
      directories: { packages: opts.assets.jspm_packages_path },
      configFile: opts.assets.jspm_config_path,
      devDependencies: {}
    };

    fs.writeFileSync(
      package_json_path,
      json_beautify(obj, null, 2, 8)
    );

  } else if (!obj.jspm.devDependencies) {
    obj.jspm.devDependencies = {};

    fs.writeFileSync(
      package_json_path,
      json_beautify(obj, null, 2, 8)
    );

  }
}


/// JSPM -> config.js
///
function copy_jspm_config(paths, dirs) {
  fse.copySync(
    `${paths.jspm_config}`,
    `${paths.build}/${dirs.assets}/${dirs.assets_js}/${path.basename(paths.jspm_config)}`
  );
}


/// JSPM -> application.js
///
function run_jspm(paths, dirs, options) {
  jspm.setPackagePath(paths.base);

  // install, build jspm & return promise
  return jspm.dlLoader("babel").then(function() {
    return jspm.install(true, { quick: true });

  }).then(function() {
    copy_jspm_config(paths, dirs);

    return jspm.bundleSFX(
      `${paths.assets_js}/application.js`,
      `${paths.build}/${dirs.assets}/${dirs.assets_js}/application.js`,
      { sourceMaps: options.sourceMaps, minify: options.minify }
    );

  }).then(function() {
    console.log(colors.green("JSPM install & bundle success"));

  });
}


/// Handlebars -> library
///
function copy_handlebars_library(paths, dirs, options) {
  let lib_dir = `${paths.node_modules_sb}/handlebars/dist`;
  let hbs_dest = `${paths.build}/${dirs.assets}/${dirs.assets_js}/handlebars.js`;
  let hbs_runtime_dest = `${paths.build}/${dirs.assets}/${dirs.assets_js}/handlebars.runtime.js`;

  if (!utils.file_exists(hbs_dest, false)) {
    fse.copySync(
      `${lib_dir}/handlebars${options.minify ? ".min" : ""}.js`,
      hbs_dest
    );

    fse.copySync(
      `${lib_dir}/handlebars.runtime${options.minify ? ".min" : ""}.js`,
      hbs_runtime_dest
    );
  }
}


/// Handlebars -> helpers
///
function copy_handlebars_helpers(paths, dirs, options) {
  let sb_base = path.resolve(paths.node_modules_sb, "../");
  let dest = `${paths.build}/${dirs.assets}/${dirs.assets_js}/handlebars_helpers.js`;

  if (!utils.file_exists(dest, false)) {
    let cmd = [
      `${paths.node_modules}/.bin/browserify`,
      `"${sb_base}/lib/handlebars/browserify.js"`,
    ];

    if (options.minify) {
      cmd.push(`| ${paths.node_modules}/.bin/uglifyjs --compress`);
    }

    cmd.push(`> ${dest}`);
    cmd = cmd.join(` `);

    execSync(cmd);
  }
}


/// Handlebars -> templates
///
function build_handlebars_templates(paths, dirs, options) {
  let cmd;

  fse.mkdirsSync(`${paths.build}/${dirs.assets}/${dirs.assets_js}`);

  // pages
  cmd = [
    `${paths.node_modules_sb}/.bin/handlebars`,
    `${paths.base}/templates/pages`,
    `--output ${paths.build}/${dirs.assets}/${dirs.assets_js}/handlebars_templates_pages.js`,
    `--extension hbs`,
    options.minify ? `--min` : ``
  ];

  execSync(cmd.join(" "));

  // partials
  cmd = [
    `${paths.node_modules_sb}/.bin/handlebars`,
    `${paths.base}/templates/partials`,
    `--output ${paths.build}/${dirs.assets}/${dirs.assets_js}/handlebars_templates_partials.js`,
    `--extension hbs`,
    `--partial`,
    options.minify ? `--min` : ``
  ];

  execSync(cmd.join(" "));
}


/// <Build>
///
export function build(static_base, options={}) {
  console.log("> Build javascripts");

  let paths = static_base.paths;
  let dirs = static_base.directories;

  if (utils.file_exists(`${static_base.paths.assets_js}/application.js`)) {
    add_jspm_to_package_json(paths, dirs, static_base.options);

    build_handlebars_templates(paths, dirs, options);
    copy_handlebars_helpers(paths, dirs, options);
    copy_handlebars_library(paths, dirs, options);

    return run_jspm(paths, dirs, options);
  }
}
