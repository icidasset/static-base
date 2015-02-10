import _ from "../vendor/underscore";


skate("container", {

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
      var template = App.helpers.get_template("pages/" + route_page_path);
      var compiled_template = template(page_data);

      this.innerHTML = compiled_template;
    }


  }

});
