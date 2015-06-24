import bourbon from "node-bourbon";
import fs from "fs";
import fse from "fs-extra";
import sass from "node-sass";

import * as utils from "../utils";


/// application.css
///
function build_application_css(paths, dirs, options) {
  return new Promise(function(resolve, reject) {

    let result;

    try {
      result = sass.renderSync({
        file: `${paths.assets_css}/application.scss`,
        includePaths: [].concat(bourbon.includePaths),
        outputStyle: options.minify ? "compressed" : "nested"
      });
    } catch (err) {
      reject(`(${dirs.assets_css}) ${err}`);
    }

    let css = result.css;

    fse.mkdirsSync(`${paths.build}/${dirs.assets}/${dirs.assets_css}`);
    fs.writeFileSync(`${paths.build}/${dirs.assets}/${dirs.assets_css}/application.css`, css);

    resolve();

  });
}


/// <Build>
///
export function build(static_base, options={}) {
  console.log("> Build stylesheets");

  if (utils.file_exists(`${static_base.paths.assets_css}/application.scss`)) {
    return build_application_css(static_base.paths, static_base.directories, options);
  }
}
