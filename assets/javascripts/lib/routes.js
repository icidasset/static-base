import page from "../vendor/page";
import _ from "../vendor/underscore";


//
//  Routes
//
Object.keys(App.data._routing_table).forEach(function(k) {
  var table_item = App.data._routing_table[k];
  var route = table_item.route;

  page(
    "/" + route,
    function(route, next) {
      App.state.route_page_path = table_item.page_path;
      next();
    },
    all_routes
  );
});


function all_routes(route) {
  App.state.route = route.path.replace(/^\//, "");
  App.state.route_params = _.extend({}, route.params);
}



//
//  Base
//
function base() {
  var initial = App.state.initial_route.split("/");
  var pathname = window.location.pathname.replace(/^\/+/, "").split("/");

  pathname.pop();
  if (pathname[0] === "") pathname.length = 0;
  if (initial[0] === "") initial.pop();

  return pathname.slice(1, pathname.length - initial.length).join("/");
}


page.base(base());



//
//  Intercept internal link clicks
//
Gator(document).on("click", "[href]", function(e) {
  var href = e.target.getAttribute("href");

  if (!href.match(/^\w+\:\/\//)) {
    page.show("/" + relative_to_absolute(href));
    e.preventDefault();
  }
});



//
//  Helpers
//
function relative_to_absolute(href) {
  return href.replace(/\.\.\//g, "");
}
