import _ from "../vendor/underscore";


skate("header", {

  created: function(el) {
    el.render = _.bind(el.render, el);
    el.bind_events();
  },

  detached: function(el) {
    el.unbind_events();
  },

  prototype: {


    bind_events() {
      App.stateNotifier.on("change:route_page_path", this.render);
    },

    unbind_events() {
      App.stateNotifier.off("change:route_page_path", this.render);
    },

    render(route_page_path) {
      var page_data = App.helpers.traverse_object(route_page_path, App.data.pages);
      var data_object = _.extend({ _all: App.data }, page_data);
      var compiled_template = App.templates.partials.header(data_object);

      this.innerHTML = compiled_template;
    }


  }

});
