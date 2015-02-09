App.helpers = {

  traverse_object: function(path, obj, split_by) {
    var split = path.split(split_by || "/");
    var pointer = obj;

    for (var i=0, j=split.length; i<j; ++i) {
      pointer = pointer[split[i]];
    }

    return pointer;
  },


  get_template: function(path) {
    return this.traverse_object(path, App.templates);
  }

};
