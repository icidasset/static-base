import colors from "colors";
import fse from "fs-extra";
import jspm from "jspm";


/// JSPM -> application.js
///
function copy_jspm_config(paths, dirs) {
  fse.copySync(
    `${paths.base}/lib/build/jspm_config.js`,
    `${paths.build}/${dirs.assets}/${dirs.assets_js}/jspm_config.js`
  );
}


function run_jspm(paths, dirs) {
  jspm.dlLoader().then(function() {
    return jspm.install(true, { quick: true });

  }).then(function() {
    copy_jspm_config(paths, dirs);

    return jspm.bundleSFX(
      `${paths.assets_js}/application.js`,
      `${paths.build}/${dirs.assets}/${dirs.assets_js}/application.js`,
      { mangle: false, sourceMaps: false }
    );

  }).then(function() {
    console.log(colors.green("JSPM install & bundle success"));

  });
}


/// <Build>
///
export function build(static_base) {
  console.log("> Build javascripts");

  let paths = static_base.paths;
  let dirs = static_base.directories;

  run_jspm(paths, dirs);
}
