import colors from "colors";
import fs from "fs";
import fse from "fs-extra";
import json_beautify from "json-beautify";
import jspm from "jspm";
import path from "path";

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


/// JSPM -> application.js
///
function copy_jspm_config(paths, dirs) {
  fse.copySync(
    `${paths.jspm_config}`,
    `${paths.build}/${dirs.assets}/${dirs.assets_js}/${path.basename(paths.jspm_config)}`
  );
}


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


/// <Build>
///
export function build(static_base, minify=false) {
  console.log("> Build javascripts");

  if (utils.file_exists(`${static_base.paths.assets_js}/application.js`)) {
    add_jspm_to_package_json(static_base.paths, static_base.directories, static_base.options);
    return run_jspm(static_base.paths, static_base.directories, minify);
  }
}
