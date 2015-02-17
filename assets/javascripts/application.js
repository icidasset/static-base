import "./vendor/gator";

import "./lib/environment";
import "./lib/helpers";
import "./lib/state";

import "./components/header";
import "./components/container";

import data_promise from "./lib/data";
import setup_routes from "./lib/routes";


data_promise.then(function(data) {
  App.data = data;
  setup_routes();

}, function() {
  console.error("Could not load data.");

});
