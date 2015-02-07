/* global __dirname, require */

var gulp = require("gulp"),

    compile_handlebars = require("gulp-compile-handlebars"),
    concat = require("gulp-concat"),
    declare = require("gulp-declare"),
    foreach = require("gulp-foreach"),
    gulp_handlebars = require("gulp-handlebars"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    wrap = require("gulp-wrap"),

    to5ify = require("6to5ify"),
    browserify = require("browserify"),
    bourbon = require("node-bourbon"),
    del = require("del"),
    fs = require("fs"),
    handlebars = require("handlebars"),
    handlebars_helpers = require("./handlebars_helpers"),
    markdown = require("markdown").markdown,
    merge = require("merge-stream"),
    transform = require("vinyl-transform"),
    underscore = require("underscore")._,
    walkdir = require("walkdir"),
    YAML = require("yamljs"),

    gulpsmith = require("gulpsmith"),
    m_layouts = require("metalsmith-layouts");


var paths = {
  data: "data",
  assets_static: ["assets/images", "assets/fonts"],
  assets_stylesheets_application: "assets/stylesheets/application.scss",
  assets_stylesheets_all: "assets/stylesheets/**/*.scss",
  assets_javascripts_application: "assets/javascripts/application.js",
  assets_javascripts_all: "assets/javascripts/**/*.js",
  templates_all: "templates/**/*.hbs",
  templates_pages: "templates/pages/**/*.hbs",
  layouts: "layouts/**/*.html"
};



//
//  Helpers
//
function swallow_error(error) {
  console.log(error.toString());
  this.emit("end");
}


function basename(path) {
  var s = path.split("/");
  return s[s.length - 1].replace(/\.\w+/, "");
}


function traverse(obj, path_array) {
  var pointer = obj;

  for (var i=0, j=path_array.length; i<j; ++i) {
    pointer[path_array[i]] = pointer[path_array[i]] || { _flags: {} };
    pointer = pointer[path_array[i]];
  }

  return pointer;
}


function page_data(locale, file) {
  var p = file.path.replace(file.cwd + "/templates/pages/", "");
  var d = data_object[locale].pages;

  p.split("/").forEach(function(s) {
    s = basename(s);
    if (s !== "") d = d[s];
  });

  return d;
}



//
//  Site config
//
var CONFIG = YAML.load(__dirname + "/config.yml");
var BUILD_DIR = CONFIG.build_directory;



//
//  Parse data
//
var data_paths = fs.existsSync(paths.data) ? walkdir.sync(paths.data) : [];
var data_object = {};
var locales;

data_paths.forEach(function(p) {
  var match_yaml = p.match(/\.yml$/);
  var match_md = p.match(/\.md$/);
  var relative_path, base, split, obj_pointer;

  if (match_yaml || match_md) {
    relative_path = p.replace(__dirname + "/data/", "").replace(/\.\w+$/, "");
    base = basename(relative_path);
    split = relative_path.split("/");
    obj_pointer = traverse(data_object, split);

    if (match_yaml) {
      underscore.extend(obj_pointer, YAML.load(p));
      obj_pointer._flags.is_yaml = true;
    } else if (match_md) {
      obj_pointer.parsed_markdown = markdown.toHTML(fs.readFileSync(p).toString());
      obj_pointer._flags.is_markdown = true;
    }
  }
});

locales = Object.keys(data_object).filter(function(k) {
  var d = data_object[k];
  if (!d._flags.is_markdown && !d._flags.is_yaml) return true;
});



//
//  Copy images & fonts
//
gulp.task("copy_static_assets", ["clean"], function() {
  var merge_args = [];

  paths.assets_static.forEach(function(s) {
    var stream = gulp
      .src(s + "/**/*", { base: s })
      .pipe(gulp.dest(BUILD_DIR + "/" + s));

    merge_args.push(stream);
  });

  return merge.apply(merge, merge_args);
});



//
//  Stylesheets
//
gulp.task("build_application_stylesheet", ["copy_static_assets"], function() {
  return gulp.src(paths.assets_stylesheets_application)
    .pipe(sass({
      includePaths: require("node-bourbon").includePaths,
      outputStyle: "nested"
    }))
    .on("error", swallow_error)
    .pipe(gulp.dest(BUILD_DIR + "/assets/stylesheets"));
});



//
//  Javascripts
//
gulp.task("build_application_javascript", ["build_application_stylesheet"], function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    b.transform(to5ify);
    return b.bundle();
  });

  // handlebars
  var handlebars_stream = gulp.src([
    "./node_modules/handlebars/dist/handlebars.js",
    "./handlebars_helpers.js"
  ]).pipe(concat("handlebars.js"));

  // templates
  var templates_stream = gulp.src(paths.templates_all)
    .pipe(gulp_handlebars({ handlebars: handlebars }))
    .pipe(wrap("Handlebars.template(<%= contents %>)"))
    .pipe(declare({
      namespace: CONFIG.javascript.app_variable_name + ".templates",
      noRedeclare: true,
      processName: declare.processNameByPath
    }))
    .pipe(concat("templates.js"));

  // main javascript
  var js_stream = gulp.src(paths.assets_javascripts_application)
    .pipe(browserified);

  // build
  return merge(handlebars_stream, templates_stream, js_stream)
    .pipe(concat("application.js"))
    .pipe(gulp.dest(BUILD_DIR + "/assets/javascripts"));
});



//
//  HTML
//
gulp.task("build_html_files", ["build_application_javascript"], function() {
  var streams = locales.map(function(locale) {
    return build_html_files(locale, CONFIG.locales.default);
  });

  return merge.apply(merge, streams)
    .pipe(gulp.dest(BUILD_DIR));
});


function build_html_files(locale, default_locale) {
  var handlebars_compile_options = {
    batch: ["./templates/partials"],
    helpers: handlebars_helpers
  };

  var data_base_object = (CONFIG.data.in_html ?
    { data_as_json: JSON.stringify(data_object[locale]) } :
    {}
  );

  return gulp.src(paths.templates_pages)
    // compile handlebars templates
    .pipe(foreach(function(stream, file) {
      var d = page_data(locale, file);

      return stream.pipe(compile_handlebars(
        d, handlebars_compile_options
      ));
    }))
    // build templates + move to new path
    .pipe(foreach(function(stream, file) {
      var d = page_data(locale, file);
      var page_route = d.route.replace(/(^\/|\/$)+/g, "");
      var prefix = (locale == default_locale ? "" : locale + "/");

      return stream.pipe(
        gulpsmith()
          .metadata(underscore.extend(data_base_object, d))
          .use(m_layouts({
            "engine": "handlebars",
            "default": "application.html"
          }))
      ).pipe(rename(prefix + page_route + "/index.html"));
    }));
}



//
//  Clone assets
//
gulp.task("clone_assets", [
  "build_html_files"
], function(clb) {
  var streams = [];

  locales.forEach(function(l) {
    if (l !== CONFIG.locales.default) {
      var stream = gulp
        .src(BUILD_DIR + "/assets/**/*", { base: BUILD_DIR })
        .pipe(gulp.dest(BUILD_DIR + "/" + l));

      streams.push(stream);
    }
  });

  if (streams.length === 0) {
    return clb();
  } else {
    return merge.apply(merge, streams);
  }
});



//
//  Other tasks
//
gulp.task("clean", function(clb) {
  del([BUILD_DIR + "/**"], { force: true }, clb);
});


gulp.task("build", [
  "clean",
  "copy_static_assets",
  "build_application_stylesheet",
  "build_application_javascript",
  "build_html_files",
  "clone_assets"
]);


gulp.task("watch", ["build"], function() {
  gulp.watch(paths.data, ["build"]);
  gulp.watch(paths.layouts, ["build"]);
  gulp.watch(paths.templates_all, ["build"]);
  gulp.watch(paths.assets_stylesheets_all, ["build"]);
  gulp.watch(paths.assets_javascripts_all, ["build"]);
});


gulp.task("default", ["watch"]);
