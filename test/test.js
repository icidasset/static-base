import assert from "assert";
import fs from "fs";
import path from "path";

import StaticBase from "../lib/main";


const DEFAULT_ENCODING = "utf-8";


/// Test custom paths
///
(function() {


  let base = __dirname;

  let o = {
    content: {
      directory: "input"
    },
    assets: {
      directory: "resources",
      css_directory: "css",
      js_directory: "js",
      static_directories: []
    },
    build: {
      directory: "output"
    },

    // don't make trees,
    // because these directories don't actually exist
    skip_trees: true
  };


  let i = new StaticBase(base, o);

  assert.equal(i.paths.base, base);
  assert.equal(i.paths.content, `${base}/${o.content.directory}`);
  assert.equal(i.paths.assets, `${base}/${o.assets.directory}`);
  assert.equal(i.paths.assets_css, `${base}/${o.assets.directory}/${o.assets.css_directory}`);
  assert.equal(i.paths.assets_js, `${base}/${o.assets.directory}/${o.assets.js_directory}`);
  assert.equal(i.paths.build, `${base}/${o.build.directory}`);

  assert.deepEqual(i.paths.assets_static, o.assets.static_directories.map(function(s) {
    return `${base}/${o.assets.directory}/${s}`;
  }));


})();



/*

Test output

? build/index.html
? build/index.html contains '<title>Index — Static Base Test</title>'

*/
(function() {


  let base = __dirname;

  let inst = new StaticBase(base, {
    content: {
      collections: {

        blog: function(file_path, item_path, tree, parsers) {
          if (file_path.endsWith(".md")) {
            let key = path.basename(item_path, ".md");
            let parse_result = parsers.parse_markdown_file(file_path);
            if (parse_result.published) tree.handle_data(key, parse_result);
          }
        }

      }
    },

    assets: {
      static_directories: ["images"]
    }
  });

  let paths = inst.paths;
  let dirs = inst.directories;

  // make a build
  inst.clean();
  inst.build();

  // test - if the correct html files were build
  assert( fs.existsSync(`${paths.build}/index.html`) );
  assert( fs.existsSync(`${paths.build}/writings/index.html`) );
  assert( fs.existsSync(`${paths.build}/writings/sample-post-1/index.html`) );

  // test - if the layout was applied
  let index_file = fs.readFileSync(
    `${paths.build}/index.html`,
    { encoding: DEFAULT_ENCODING }
  );

  assert.notEqual( index_file.indexOf("<title>Index &mdash; Static Base Test</title>"), -1 );
  assert.notEqual( index_file.indexOf("<body"), -1 );

  // test - if the [index] template was rendered
  assert.notEqual( index_file.indexOf("<h1>Index</h1>"), -1 );

  // test - assets
  // assert( fs.existsSync(`${paths.build}/${dirs.assets}/${dirs.assets_js}/application.js`) );
  assert( fs.existsSync(`${paths.build}/${dirs.assets}/${dirs.assets_css}/application.css`) );
  assert( fs.existsSync(`${paths.build}/${dirs.assets}/images/sample-image.jpg`) );

  // test - collection assets
  // TODO


})();
