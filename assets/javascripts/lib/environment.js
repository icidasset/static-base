import _ from "../vendor/underscore";


//
//  Namespace
//
window.App = App || {};


//
//  Handlebars
//
_.each(HandlebarsHelpers, function(v, k) {
  Handlebars.registerHelper(k, v);
});
