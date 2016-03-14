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
export function run() {
  const sequenceItems = [].slice.call(arguments);

  return (pattern, dir, attr = {}) => {
    const root = cleanPath(dir, { end: true });
    const wd = cleanPath(pattern ? globParent(pattern) : '', { beginning: true, end: true });

    const deps = { ...attr, pattern, wd, root };

    const l = list(pattern, deps);
    const d = dictionary(l, deps);
    const p = sequence(sequenceItems, deps);

    return pflow.apply(null, p)(d);
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
  return items.map((item) => {
    return (rvaluePrevious) => {
      const formattedItem = (typeof item === 'object' ? item : [item]);
      const fn = formattedItem[0];
      const fnArgs = [rvaluePrevious, deps, ...formattedItem.slice(1)];
      const rvalueCurrent = fn.apply(null, fnArgs);

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
