import pathUtils from 'path';

import { cleanPath } from './utils';


/*

Input:

paths = [
  'sub/example.ext',
]

deps = {
  root: '/Users/icidasset/Projects/icid-asset',
  wd: 'src/templates',
}

Output:

[
  {
    path: 'sub/example.ext',
    entirePath: '/Users/icidasset/Projects/icid-asset/src/templates/sub/example.ext',

    wd: 'src/templates',
    root: '/Users/icidasset/Projects/icid-asset',
    dirname: 'sub',
    basename: 'example',
    extname: '.ext',
  }
]

*/
export default function(paths, deps) {
  return paths.map((path) => {
    const cleanedPath = cleanPath(path, { start: true });

    return {
      path: cleanedPath,
      entirePath: pathUtils.join(deps.root, deps.wd, cleanedPath),

      wd: deps.wd,
      root: deps.root,
      dirname: pathUtils.dirname(cleanedPath),
      basename: pathUtils.basename(cleanedPath, pathUtils.extname(cleanedPath)),
      extname: pathUtils.extname(cleanedPath),
    };
  });
}
