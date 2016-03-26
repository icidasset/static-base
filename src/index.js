import globParent from 'glob-parent';
import pflow from 'pflow';

import { cleanPath } from './utils';
import { build as dictionary } from './dictionary';
import list from './list';


/**
 * Run a sequence of functions.
 * Has support for functions that return a promise.
 * @param {(function|[function, *])} [arg] - e.g. run(fn_a, fn_b, [fn_c, 'fn_c_arg'])
 * @return {function} Returns a function which runs the sequence and returns a promise
 */
export function run(...sequenceItems) {
  return (...args) => {
    return Promise.resolve(args[0]).then(
      (arg_1) => _run(sequenceItems, arg_1, args[1])
    );
  };
}


function _run(sequenceItems, arg_1, arg_2) {
  let deps, dict, dictp;

  // If given a dictionary
  // --- if empty, resolve directly
  // --- else, extract dependencies from first definition & make dictionary (promise)
  if (Array.isArray( arg_1 )) {
    dict = arg_1;

    if (dict.length >= 1) deps = dependencies( dict[0] );
    else return Promise.resolve( [] );

    dictp = Promise.resolve(dict);

  // If given a pattern and root directory
  // --- 1. build dependencies
  // --- 2. make dictionary (promise)
  } else if (typeof arg_1 === 'string') {
    let pattern, patternParent;
    let root;

    if (typeof arg_2 === 'string') {
      pattern = arg_1;
      patternParent = globParent(pattern);
      root = arg_2;
    } else {
      pattern = '';
      patternParent = '';
      root = arg_1;
    }

    deps = dependencies({
      pattern,
      wd: cleanPath(patternParent, { beginning: true, end: true }),
      root: cleanPath(root, { end: true }),
    });

    dictp = list(pattern, deps).then((ls) => {
      return dictionary(ls, deps);
    });

  // Otherwise
  // --- reject
  } else {
    return Promise.reject('Insufficient parameters given.');

  }

  // => Run sequence
  return pflow.apply(
    null,
    sequence(sequenceItems, deps)
  )(
    dictp
  );
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
    root: definition.root,
  };
}


/*

Each result of the previous function
is given to the next function.

The pflow library handles the promises for this sequence.

*/


function sequence(items, deps) {
  return items.map((item, idx) => {
    return (rvaluePrevious) => {
      const formattedItem = (typeof item === 'object' ? item : [item]);
      const fn = formattedItem[0];
      const fnArgs = [rvaluePrevious, deps, ...formattedItem.slice(1)];

      // {check} if fn is not a function
      if (fn instanceof Function === false) {
        return Promise.reject(
          `Item ${idx + 1} in the sequence '${deps.pattern}' is not a function`
        );
      }

      // -> continue
      const rvalueCurrent = fn.apply(null, fnArgs);

      // {check} if the same array has been returned, reject
      if (rvaluePrevious === rvalueCurrent) {
        return Promise.reject(
          `Item ${idx + 1} in the sequence '${deps.pattern}' does not return a new array`
        );
      }

      return rvalueCurrent;
    };
  });
}
