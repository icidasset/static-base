/*

  TASK:

  This file will only be used by browserify,
  to register the custom handlebars helpers automatically.

*/

"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _helpers = require("./helpers");

var helpers = _interopRequireWildcard(_helpers);

Handlebars.registerHelper(helpers);