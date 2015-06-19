import bourbon from "node-bourbon";
import fs from "fs";
import fse from "fs-extra";
import sass from "node-sass";


/// application.css
///
function build_application_css(paths, dirs) {
  let result = sass.renderSync({
    file: `${paths.assets_css}/application.scss`,
    includePaths: [].concat(bourbon.includePaths),
    outputStyle: "compressed"
  });

  fse.mkdirsSync(`${paths.build}/${dirs.assets}/${dirs.assets_css}`);
  fs.writeFileSync(`${paths.build}/${dirs.assets}/${dirs.assets_css}/application.css`, result.css);
}


/// <Build>
///
export function build(static_base) {
  console.log("> Build stylesheets");

  let paths = static_base.paths;
  let dirs = static_base.directories;

  build_application_css(paths, dirs);
}
