/*

  TASK:

  This file will only be used by browserify,
  to register the custom handlebars helpers automatically.

*/

import * as helpers from "./helpers";


Handlebars.registerHelper(helpers);
