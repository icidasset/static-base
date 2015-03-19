import _ from "underscore";
import ObserveNotifier from "../vendor/observe-notifier";


var initial_state = JSON.parse(
  document.getElementById("initial-state").innerHTML
);


export var state = _.extend({}, initial_state, {
  route: null,
  route_params: {},
  route_page_path: null
});


export var stateNotifier = new ObserveNotifier(state);
