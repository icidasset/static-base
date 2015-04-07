import "es6-promise";
import "fetch";
import "object.observe";
import "skatejs";

import "./lib/environment";

import "./components/container";
import "./components/header";

import data_promise from "./lib/data";
import setup_routes from "./lib/routes";


data_promise.then(function(data) {
  App.data = data;
  setup_routes();

}, function() {
  console.error("Could not load data.");

});
