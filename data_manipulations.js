var underscore = require("underscore")._;


module.exports = [

  //
  //  Routing table
  //
  function() {
    var data = this;

    var traverse = function(obj, table, path_prefix, route_prefix) {
      underscore.each(obj._children, function(c) {
        var child_obj = obj[c];
        var child_obj_route = (child_obj.route ? child_obj.route.replace(/(^\/|\/$)+/g, "") : null);
        var path = path_prefix + c;
        var route = route_prefix + (path == "index" ? "" : (child_obj_route || c));

        table[path] = {
          route: route
        };

        child_obj._route = route;
        if (child_obj._children) traverse(child_obj, table, path + "/", route + "/");
      });
    };

    underscore.each(data._locales, function(l) {
      data[l]._routing_table = {};
      traverse(data[l].pages, data[l]._routing_table, "", "");
    });
  }

];
