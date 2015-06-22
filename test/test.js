import assert from "assert";
import fs from "fs";
import path from "path";

import StaticBase from "../lib/main";


const DEFAULT_ENCODING = "utf-8";


/// Test custom paths
///
describe("Custom paths", function() {


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

  it("should build the correct paths", function() {
    assert.equal(i.paths.base, base);
    assert.equal(i.paths.content, `${base}/${o.content.directory}`);
    assert.equal(i.paths.assets, `${base}/${o.assets.directory}`);
    assert.equal(i.paths.assets_css, `${base}/${o.assets.directory}/${o.assets.css_directory}`);
    assert.equal(i.paths.assets_js, `${base}/${o.assets.directory}/${o.assets.js_directory}`);
    assert.equal(i.paths.build, `${base}/${o.build.directory}`);

    assert.deepEqual(i.paths.assets_static, o.assets.static_directories.map(function(s) {
      return `${base}/${o.assets.directory}/${s}`;
    }));
  });


});



/// Assert output
///
describe("Output", function() {


  let inst = new StaticBase(__dirname, {
    node_modules_path: "../node_modules",

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

  inst.clean();

  let build_promise = inst.build();

  let index_file = fs.readFileSync(
    `${paths.build}/index.html`,
    { encoding: DEFAULT_ENCODING }
  );

  it("should build the correct html files and paths", function() {
    assert( fs.existsSync(`${paths.build}/index.html`) );
    assert( fs.existsSync(`${paths.build}/writings/index.html`) );
    assert( fs.existsSync(`${paths.build}/writings/sample-post-1/index.html`) );
  });

  it("should apply the layout", function() {
    assert.notEqual( index_file.indexOf("<title>Index &mdash; Static Base Test</title>"), -1 );
    assert.notEqual( index_file.indexOf("<body"), -1 );
  });

  it("should render the template", function() {
    assert.notEqual( index_file.indexOf("<h1>Index</h1>"), -1 );
  });

  it("should build css", function() {
    assert( fs.existsSync(`${paths.build}/${dirs.assets}/${dirs.assets_css}/application.css`) );
  });

  it("should copy the static assets", function() {
    assert( fs.existsSync(`${paths.build}/${dirs.assets}/images/sample-image.jpg`) );
  });

  it("should build js and the jspm files", function() {
    // TODO
    return build_promise.then(function() {
      assert( fs.existsSync(`${paths.build}/${dirs.assets}/${dirs.assets_js}/application.js`) );
      assert( fs.existsSync(`package.json`) );
      assert( fs.existsSync(`${inst.options.jspm_config_path}`) );
      assert( fs.existsSync(`${inst.options.jspm_packages_path}`) );
    });
  });


});
