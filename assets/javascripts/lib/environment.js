window.App = App || {};


//
//  Handlebars
//
_.each(HandlebarsHelpers, function(v, k) {
  Handlebars.registerHelper(k, v);
});
