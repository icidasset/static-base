import chai from "chai";
import chai_as_promised from "chai-as-promised";
import fs from "fs";
import path from "path";

import StaticBase from "../lib/main";


const DEFAULT_ENCODING = "utf-8";


chai.use(chai_as_promised);


let assert = chai.assert;


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
    }
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

  let build_promise = inst.build("all");
  let index_file = fs.readFileSync(
    `${paths.build}/index.html`,
    { encoding: DEFAULT_ENCODING }
  );

  it("should make a successful build", function() {
    return assert.isFulfilled(build_promise);
  });

  it("should build the correct html files and paths", function() {
    return build_promise.then(function() {
      assert_exist(`${paths.build}/index.html`);
      assert_exist(`${paths.build}/writings/index.html`);
      assert_exist(`${paths.build}/writings/sample-post-1/index.html`);
    });
  });

  it("should apply the layout", function() {
    return build_promise.then(function() {
      assert.notEqual( index_file.indexOf("<title>Index &mdash; Static Base Test</title>"), -1 );
      assert.notEqual( index_file.indexOf("<body"), -1 );
    });
  });

  it("should render the template", function() {
    return build_promise.then(function() {
      assert.notEqual( index_file.indexOf("<h1>Index</h1>"), -1 );
    });
  });

  it("should build css", function() {
    return build_promise.then(function() {
      assert_exist(`${paths.build}/${dirs.assets}/${dirs.assets_css}/application.css`);
    });
  });

  it("should copy the static assets", function() {
    return build_promise.then(function() {
      assert_exist(`${paths.build}/${dirs.assets}/images/sample-image.jpg`);
    });
  });

  it("should build js and the jspm files", function() {
    return build_promise.then(function() {
      assert_exist(`${paths.build}/${dirs.assets}/${dirs.assets_js}/application.js`);
      assert_exist(`${paths.base}/package.json`);
      assert_exist(`${paths.base}/${inst.options.assets.jspm_config_path}`);
      assert_exist(`${paths.base}/${inst.options.assets.jspm_packages_path}`);
    });
  });

  it("should build a json file", function() {
    return build_promise.then(function() {
      assert_exist(`${paths.build_json}/default.json`);
    });
  });


});



/// [Helpers]
///
function assert_exist(_path) {
  assert.doesNotThrow(
    function() {
      return fs.accessSync(_path);
    },
    Error
  );
}
