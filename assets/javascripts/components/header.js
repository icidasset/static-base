import _ from "../vendor/underscore";


skate("header", {

  created: function(el) {
    this.instance = new Header(el);
  },

  detached: function(el) {
    this.instance.unbind_events();
    this.instance = null;
  }

});



class Header {

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
    var data_object = _.extend({ _all: App.data }, page_data);
    var compiled_template = App.templates.partials.header(data_object);

    this.el.innerHTML = compiled_template;
  }

}
