'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.run = run;

var _pflow = require('pflow');

var _pflow2 = _interopRequireDefault(_pflow);

var _dictionary = require('./dictionary');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @callback runCurry
 * @param {...*} args - Opt 1, a pattern + root dir. Opt 2, a root dir. Opt 3, a dictionary. Opt 4, a promise of a dictionary.
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
      pattern = void 0;

  // If given a dictionary
  if (Array.isArray(a)) {
    dict = a;

    if (dict.length >= 1) pattern = dict[0].pattern;else return Promise.resolve([]);

    // If given a pattern and root directory
  } else if (typeof a === 'string') {
      var root = void 0;

      if (typeof b === 'string') {
        pattern = a;
        root = b;
      } else {
        pattern = '';
        root = a;
      }

      deps = (0, _dictionary.buildDependencies)(pattern, root);
      dict = (0, _list2['default'])(pattern, deps).then(function (ls) {
        return (0, _dictionary.buildDictionary)(ls, deps);
      });

      // Otherwise
    } else {
        return Promise.reject('Insufficient parameters given.');
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
  return items.map(function (item, idx) {
    return function (rvaluePrevious) {
      var formattedItem = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item : [item];
      var fn = formattedItem[0];
      var fnArgs = [rvaluePrevious].concat(_toConsumableArray(formattedItem.slice(1)));

      // {check} if fn is not a function
      if (fn instanceof Function === false) {
        return Promise.reject('Item ' + (idx + 1) + ' in the sequence \'' + pattern + '\' is not a function');
      }

      // -> continue
      var rvalueCurrent = fn.apply(null, fnArgs);

      // {check} if the same array has been returned, reject
      if (rvaluePrevious === rvalueCurrent) {
        return Promise.reject('Item ' + (idx + 1) + ' in the sequence \'' + pattern + '\' does not return a new array');
      }

      return rvalueCurrent;
    };
  });
}