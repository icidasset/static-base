import "./vendor/es6-promise";
import "./vendor/fetch";
import "./vendor/gator";
import "./vendor/isarray";
import "./vendor/object-observe-lite";
import "./vendor/observe-notifier";
import "./vendor/path-to-regexp";
import "./vendor/skate";

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
