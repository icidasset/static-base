import page from "page";
import _ from "underscore";
import {state} from "../lib/state";


function setup_routes() {
  Object.keys(App.data._routing_table).forEach(function(k) {
    var table_item = App.data._routing_table[k];
    var route = table_item.route;

    page(
      "/" + route,
      function(route, next) {
        state.route_page_path = table_item.page_path;
        next();
      },
      all_routes
    );
  });
}


function all_routes(route) {
  state.route = route.path.replace(/^\//, "");
  state.route_params = _.extend({}, route.params);
}



//
//  Base
//
function base() {
  var initial = state.initial_route.split("/");
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
document.addEventListener("click", function(event) {
  if (event.target.tagName.toLowerCase() === "a") {
    var href = event.target.getAttribute("href");

    if (href && !href.match(/^\w+\:\/\//)) {
      page.show("/" + relative_to_absolute(href));
      event.preventDefault();
    }
  }
});



//
//  Helpers
//
function relative_to_absolute(href) {
  return href.replace(/\.\.\//g, "");
}



//
//  Export
//
export default setup_routes;
