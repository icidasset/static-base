(function(root) {

if (typeof define === "function" && define.amd) {
  define([], factory);
} else if (typeof exports === "object") {
  module.exports = factory();
} else {
  root.HandlebarsHelpers = factory();
}

function factory() { return {


  asset_path: function(path_from_assets_directory) {
    var route = this._route;

    if (!route || route.length === 0) {
      return "assets/" + path_from_assets_directory;
    } else {
      var split = route.split("/");
      var path_prefix = "";

      for (var i=0, j=split.length; i<j; ++i) {
        if (split[i] !== "") path_prefix += "../";
      }

      return (path_prefix + "assets/" + path_from_assets_directory)
        .replace(/\/{2,}/g, "/");
    }
  }


};}
}(this));
