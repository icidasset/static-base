import { buildDictionary, buildDependencies } from './dictionary';
import list from './list';
import pflow from 'pflow';

export * from './dictionary';
export * from './utils';


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
  let deps, dict, pattern, root;

  // If given a dictionary
  if (Array.isArray(a)) {
    dict = a;

    if (dict.length >= 1) {
      pattern = dict[0].pattern;
    }

  // If given a pattern and root directory
  } else if (
    typeof a === 'string' &&
    typeof b === 'string'
  ) {
    pattern = a;
    root = b;

    deps = buildDependencies(pattern, root);
    dict = list(pattern, deps).then(ls => buildDictionary(ls, deps));

  // Running empty
  } else if (a == null && b == null) {
    dict = [];

  // Otherwise
  } else {
    return Promise.reject('Invalid parameters given.');

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
  const sequenceId = `'${constructSequenceId(items)}' (pattern: '${pattern}')`;

  return items.map((item, idx) => {
    return (rvaluePrevious) => {
      const formattedItem = (Array.isArray(item) ? item : [item]);
      const [fn, ...itemArgs] = formattedItem;
      const fnArgs = [rvaluePrevious, ...itemArgs];

      // {pre} if fn is not a function
      if (fn instanceof Function === false) {
        return Promise.reject(
          `Item ${idx + 1} in the sequence ${sequenceId} is not a function`
        );
      }

      // -> continue
      const rvalueCurrent = fn.apply(null, fnArgs);

      // {post} if the same array has been returned, reject
      if (rvaluePrevious === rvalueCurrent) {
        return Promise.reject(
          `Item ${idx + 1} in the sequence ${sequenceId} does not return a new array`
        );
      }

      // -> continue
      return rvalueCurrent;
    };
  });
}


function constructSequenceId(items) {
  if (!items.length) return '[]';

  const functionNames = items.map(item => {
    const fn = (Array.isArray(item) ? item[0] : item);
    return fn ? fn.name || 'anonymous_fn' : 'undefined_fn';
  });

  return `[${functionNames.join(', ')}]`;
}
