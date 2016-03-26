'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.run = run;

var _globParent = require('glob-parent');

var _globParent2 = _interopRequireDefault(_globParent);

var _pflow = require('pflow');

var _pflow2 = _interopRequireDefault(_pflow);

var _utils = require('./utils');

var _dictionary = require('./dictionary');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Run a sequence of functions.
 * Has support for functions that return a promise.
 * @param {(function|[function, *])} [arg] - e.g. run(fn_a, fn_b, [fn_c, 'fn_c_arg'])
 * @return {function} Returns a function which runs the sequence and returns a promise
 */
function run() {
  for (var _len = arguments.length, sequenceItems = Array(_len), _key = 0; _key < _len; _key++) {
    sequenceItems[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return Promise.resolve(args[0]).then(function (arg_1) {
      return _run(sequenceItems, arg_1, args[1]);
    });
  };
}

function _run(sequenceItems, arg_1, arg_2) {
  var deps = void 0,
      dict = void 0,
      dictp = void 0;

  // If given a dictionary
  // --- if empty, resolve directly
  // --- else, extract dependencies from first definition & make dictionary (promise)
  if (Array.isArray(arg_1)) {
    dict = arg_1;

    if (dict.length >= 1) deps = dependencies(dict[0]);else return Promise.resolve([]);

    dictp = Promise.resolve(dict);

    // If given a pattern and root directory
    // --- 1. build dependencies
    // --- 2. make dictionary (promise)
  } else if (typeof arg_1 === 'string') {
      var pattern = void 0,
          patternParent = void 0;
      var root = void 0;

      if (typeof arg_2 === 'string') {
        pattern = arg_1;
        patternParent = (0, _globParent2['default'])(pattern);
        root = arg_2;
      } else {
        pattern = '';
        patternParent = '';
        root = arg_1;
      }

      deps = dependencies({
        pattern: pattern,
        wd: (0, _utils.cleanPath)(patternParent, { beginning: true, end: true }),
        root: (0, _utils.cleanPath)(root, { end: true })
      });

      dictp = (0, _list2['default'])(pattern, deps).then(function (ls) {
        return (0, _dictionary.build)(ls, deps);
      });

      // Otherwise
      // --- reject
    } else {
        return Promise.reject('Insufficient parameters given.');
      }

  // => Run sequence
  return _pflow2['default'].apply(null, sequence(sequenceItems, deps))(dictp);
}

/*

Deps:

{
  pattern: 'pattern_given_to_function_returned_by_run',
  root: 'root_directory, also_specified_by_user',
  wd: 'working_directory, extracted_from_pattern, see glob-parent_package'
}

*/

function dependencies(definition) {
  return {
    pattern: definition.pattern,
    wd: definition.wd,
    root: definition.root
  };
}

/*

Each result of the previous function
is given to the next function.

The pflow library handles the promises for this sequence.

*/

function sequence(items, deps) {
  return items.map(function (item, idx) {
    return function (rvaluePrevious) {
      var formattedItem = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item : [item];
      var fn = formattedItem[0];
      var fnArgs = [rvaluePrevious, deps].concat(_toConsumableArray(formattedItem.slice(1)));

      // {check} if fn is not a function
      if (fn instanceof Function === false) {
        return Promise.reject('Item ' + (idx + 1) + ' in the sequence \'' + deps.pattern + '\' is not a function');
      }

      // -> continue
      var rvalueCurrent = fn.apply(null, fnArgs);

      // {check} if the same array has been returned, reject
      if (rvaluePrevious === rvalueCurrent) {
        return Promise.reject('Item ' + (idx + 1) + ' in the sequence \'' + deps.pattern + '\' does not return a new array');
      }

      return rvalueCurrent;
    };
  });
}