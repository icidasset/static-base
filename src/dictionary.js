import pathUtils from 'path';

import { cleanPath } from './utils';


/*

Input:

paths = [
  'sub/example.ext',
]

deps = {
  root: '/Users/icidasset/Projects/portfolio',
  wd: 'src/templates',
  pattern: '**\/*.ext',
}

Output:

[
  {
    path: 'sub/example.ext',
    entirePath: '/Users/icidasset/Projects/portfolio/src/templates/sub/example.ext',

    wd: 'src/templates',
    root: '/Users/icidasset/Projects/portfolio',
    dirname: 'sub',
    basename: 'example',
    extname: '.ext',

    pattern: '**\/*.ext',
  }
]

*/
export function build(paths, deps) {
  return paths.map((path) => buildDefinition(path, deps));
}


export function buildDefinition(path, deps) {
  const cleanedPath = cleanPath(path, { beginning: true });

  return {
    path: cleanedPath,
    entirePath: pathUtils.join(deps.root, deps.wd, cleanedPath),

    pattern: deps.pattern,
    wd: deps.wd,
    root: deps.root,
    dirname: cleanPath(pathUtils.dirname(cleanedPath), { beginning: true, end: true }),
    basename: pathUtils.basename(cleanedPath, pathUtils.extname(cleanedPath)),
    extname: pathUtils.extname(cleanedPath),
  };
}
