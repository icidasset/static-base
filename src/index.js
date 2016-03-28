import pflow from 'pflow';

import { buildDictionary, buildDependencies } from './dictionary';
import list from './list';


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
export function run(...sequenceItems) {
  return (...args) => {
    const b = args[1];

    // Resolve first argument,
    // in case it's a promise for a Dictionary
    return Promise.resolve(args[0]).then(
      (a) => _run(sequenceItems, a, b)
    );
  };
}


function _run(sequenceItems, a, b) {
  let deps, dict, pattern;

  // If given a dictionary
  if (Array.isArray(a)) {
    dict = a;

    if (dict.length >= 1) pattern = dict[0].pattern;
    else return Promise.resolve([]);

  // If given a pattern and root directory
  } else if (typeof a === 'string') {
    let root;

    if (typeof b === 'string') {
      pattern = a;
      root = b;
    } else {
      pattern = '';
      root = a;
    }

    deps = buildDependencies(pattern, root);
    dict = list(pattern, deps).then(ls => buildDictionary(ls, deps));

  // Otherwise
  } else {
    return Promise.reject('Insufficient parameters given.');

  }

  // => Run sequence
  return pflow.apply(
    null,
    sequence(sequenceItems, pattern)
  )(
    dict
  );
}


/*

Each result of the previous function
is given to the next function.

The pflow library handles the promises for this sequence.

*/


function sequence(items, pattern) {
  return items.map((item, idx) => {
    return (rvaluePrevious) => {
      const formattedItem = (typeof item === 'object' ? item : [item]);
      const fn = formattedItem[0];
      const fnArgs = [rvaluePrevious, ...formattedItem.slice(1)];

      // {check} if fn is not a function
      if (fn instanceof Function === false) {
        return Promise.reject(
          `Item ${idx + 1} in the sequence '${pattern}' is not a function`
        );
      }

      // -> continue
      const rvalueCurrent = fn.apply(null, fnArgs);

      // {check} if the same array has been returned, reject
      if (rvaluePrevious === rvalueCurrent) {
        return Promise.reject(
          `Item ${idx + 1} in the sequence '${pattern}' does not return a new array`
        );
      }

      return rvalueCurrent;
    };
  });
}
