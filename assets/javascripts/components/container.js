import _ from "../vendor/underscore";


skate("container", {

  created: function(el) {
    this.instance = new Container(el);
  },

  detached: function(el) {
    this.instance.unbind_events();
    this.instance = null;
  }

});



class Container {

  constructor(el) {
    this.el = el;
    this.render = _.bind(this.render, this);

    this.bind_events();
  }

  bind_events() {
    App.stateNotifier.on("change:route_page_path", this.render);
  }

  unbind_events() {
    App.stateNotifier.off("change:route_page_path", this.render);
  }

  render(route_page_path) {
    var page_data = App.helpers.traverse_object(route_page_path, App.data.pages);
    var template = App.helpers.get_template("pages/" + route_page_path);
    var compiled_template = template(page_data);

    this.el.innerHTML = compiled_template;
  }

}
