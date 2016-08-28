'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dictionary = require('./dictionary');

Object.keys(_dictionary).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      function get() {
        return _dictionary[key];
      }

      return get;
    }()
  });
});

var _utils = require('./utils');

Object.keys(_utils).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      function get() {
        return _utils[key];
      }

      return get;
    }()
  });
});
exports.run = run;

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _pflow = require('pflow');

var _pflow2 = _interopRequireDefault(_pflow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * Has different sets of parameters:
 *
 * Set 1:
 * `(glob_pattern, root_directory_path)`
 *
 * Set 2:
 * {@link Dictionary}
 *
 * Set 3:
 * A Promise of a {@link Dictionary}
 *
 * Set 4:
 * No parameters. Will create a sequence with an empty array.
 *
 * @callback runCurry
 * @param {...*} args
 * @return {Promise} Returns a promise for a Dictionary
 */

/**
 * Run a sequence of functions.
 * Has support for functions that return a promise.
 * @param {...(function|Array<function, *>)} sequenceItems
 * @return {runCurry}
 */
function run() {
  for (var _len = arguments.length, sequenceItems = Array(_len), _key = 0; _key < _len; _key++) {
    sequenceItems[_key] = arguments[_key];
  }

  return function () {
    var b = arguments.length <= 1 ? void 0 : arguments[1];

    // Resolve first argument,
    // in case it's a promise for a Dictionary
    return Promise.resolve(arguments.length <= 0 ? void 0 : arguments[0]).then(function (a) {
      return _run(sequenceItems, a, b);
    });
  };
}

function _run(sequenceItems, a, b) {
  var deps = void 0,
      dict = void 0,
      pattern = void 0,
      root = void 0;

  // If given a dictionary
  if (Array.isArray(a)) {
    dict = a;

    if (dict.length >= 1) {
      pattern = dict[0].pattern;
    }

    // If given a pattern and root directory
  } else if (typeof a === 'string' && typeof b === 'string') {
    pattern = a;
    root = b;

    deps = (0, _dictionary.buildDependencies)(pattern, root);
    dict = (0, _list2['default'])(pattern, deps).then(function (ls) {
      return (0, _dictionary.buildDictionary)(ls, deps);
    });

    // Running empty
  } else if (a == null && b == null) {
    dict = [];

    // Otherwise
  } else {
    return Promise.reject('Invalid parameters given.');
  }

  // => Run sequence
  return _pflow2['default'].apply(null, sequence(sequenceItems, pattern))(dict);
}

/*

Each result of the previous function
is given to the next function.

The pflow library handles the promises for this sequence.

*/

function sequence(items, pattern) {
  var sequenceId = '\'' + constructSequenceId(items) + '\' (pattern: \'' + pattern + '\')';

  return items.map(function (item, idx) {
    return function (rvaluePrevious) {
      var formattedItem = Array.isArray(item) ? item : [item];

      var _formattedItem = _toArray(formattedItem);

      var fn = _formattedItem[0];

      var itemArgs = _formattedItem.slice(1);

      var fnArgs = [rvaluePrevious].concat(_toConsumableArray(itemArgs));

      // {pre} if fn is not a function
      if (fn instanceof Function === false) {
        return Promise.reject('Item ' + (idx + 1) + ' in the sequence ' + sequenceId + ' is not a function');
      }

      // -> continue
      var rvalueCurrent = fn.apply(null, fnArgs);

      // {post} if the same array has been returned, reject
      if (rvaluePrevious === rvalueCurrent) {
        return Promise.reject('Item ' + (idx + 1) + ' in the sequence \'' + sequenceId + '\' does not return a new array');
      }

      // -> continue
      return rvalueCurrent;
    };
  });
}

function constructSequenceId(items) {
  if (!items.length) return '[]';

  var functionNames = items.map(function (item) {
    var fn = Array.isArray(item) ? item[0] : item;
    return fn ? fn.name || 'anonymous_fn' : 'undefined_fn';
  });

  return '[' + functionNames.join(', ') + ']';
}