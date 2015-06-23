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
function run_jspm(paths, dirs, minify) {
  jspm.setPackagePath(paths.base);

  // install, build jspm & return promise
  return jspm.dlLoader("babel").then(function() {
    return jspm.install(true, { quick: true });

  }).then(function() {
    copy_jspm_config(paths, dirs);

    return jspm.bundleSFX(
      `${paths.assets_js}/application.js`,
      `${paths.build}/${dirs.assets}/${dirs.assets_js}/application.js`,
      { sourceMaps: !minify, minify: minify }
    );

  }).then(function() {
    console.log(colors.green("JSPM install & bundle success"));

  });
}


/// Handlebars templates
///
function build_handlebars_templates(paths, dirs, minify) {
  fse.mkdirsSync(`${paths.build}/${dirs.assets}/${dirs.assets_js}`);

  let cmd = [
    `${paths.node_modules_sb}/.bin/handlebars`,
    `${paths.base}/templates`,
    `--output ${paths.build}/${dirs.assets}/${dirs.assets_js}/handlebars_templates.js`,
    `--commonjs`,
    `--extension hbs`,
    minify ? `--min` : ``
  ];

  execSync(cmd.join(" "));
}


/// <Build>
///
export function build(static_base, minify=false) {
  console.log("> Build javascripts");

  let paths = static_base.paths;
  let dirs = static_base.directories;

  if (utils.file_exists(`${static_base.paths.assets_js}/application.js`)) {
    add_jspm_to_package_json(paths, dirs, static_base.options);

    return Promise.all([
      run_jspm(paths, dirs, minify),
      build_handlebars_templates(paths, dirs, minify)
    ]);
  }
}
