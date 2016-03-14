'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.run = run;

var _globParent = require('glob-parent');

var _globParent2 = _interopRequireDefault(_globParent);

var _pflow = require('pflow');

var _pflow2 = _interopRequireDefault(_pflow);

var _utils = require('./utils');

var _dictionary = require('./dictionary');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Run a sequence of functions.
 * Has support for functions that return a promise.
 * @param {(function|[function, *])} [arg] - e.g. run(fn_a, fn_b, [fn_c, 'fn_c_arg'])
 * @return {function} Returns a function which runs the sequence and returns a promise
 */
function run() {
  var sequenceItems = [].slice.call(arguments);

  return function (pattern, dir) {
    var attr = arguments.length <= 2 || arguments[2] === void 0 ? {} : arguments[2];

    var root = (0, _utils.cleanPath)(dir, { end: true });
    var wd = (0, _utils.cleanPath)(pattern ? (0, _globParent2['default'])(pattern) : '', { beginning: true, end: true });

    var deps = _extends({}, attr, { pattern: pattern, wd: wd, root: root });

    var l = (0, _list2['default'])(pattern, deps);
    var d = (0, _dictionary.build)(l, deps);
    var p = sequence(sequenceItems, deps);

    return _pflow2['default'].apply(null, p)(d);
  };
}

/*

Deps:

{
  pattern: 'pattern_given_to_function_returned_by_run',
  root: 'root_directory, also_specified_by_user',
  wd: 'working_directory, extracted_from_pattern, see glob-parent_package',

  ...(other_attributes_defined_by_user)
}

*/

function sequence(items, deps) {
  return items.map(function (item) {
    return function (rvaluePrevious) {
      var formattedItem = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item : [item];
      var fn = formattedItem[0];
      var fnArgs = [rvaluePrevious, deps].concat(_toConsumableArray(formattedItem.slice(1)));
      var rvalueCurrent = fn.apply(null, fnArgs);

      // Here you can compare the return value of the current function
      // and the one of the previous function.
      //
      // Possible use cases:
      // - Check if the function returns a new array instead of an old one.
      // - Check if certain objects have been mutated that shouldn't be mutated.

      return rvalueCurrent;
    };
  });
}