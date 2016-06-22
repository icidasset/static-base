import test from 'ava';

import { buildDictionary } from './lib/dictionary';
import { run } from './lib';
import list from './lib/list';


test('should make a valid list', async t => {
  const la = list('*.js', { wd: '', root: process.cwd() });
  const lb = list('src/*.js', { wd: 'src', root: process.cwd() });

  return Promise.all([
    la,
    lb
  ]).then(res => {
    t.is( res[0][0], 'test.js' );
    t.is( res[1][0], 'dictionary.js' );
  });
});


test('should make a valid dictionary', t => {
  const pattern = '**/*.test';
  const path = 'test';
  const wd = 'wd';
  const root = '/root';

  const dict = buildDictionary([path], { pattern, wd, root });
  const fdef = dict[0];

  t.is(fdef.pattern, pattern);
  t.is(fdef.path, path);
  t.is(fdef.wd, wd);
  t.is(fdef.root, root);
});


test('should be able to run a sequence, given a pattern and root directory', async t => {
  return collectDotFiles().then(dict => {
    t.is(dict[0].path, '.babelrc');
    t.is(dict[0].iamadot, true);
  });
});


test('should be able to run a sequence, given no parameters', async t => {
  return run(
    [() => { return [{}] }],
    [metadata, { test: true }]
  )().then(dict => {
    t.is(dict[0].test, true);
  });
});


test('should be able to run a sequence, given a dictionary', async t => {
  return collectDotFiles().then(dict_a => {
    run()(dict_a).then(dict_b => {
      t.deepEqual(dict_a, dict_b);
      t.is(dict_a[0].path, '.babelrc');
    });
  });
});


test('should be able to run a sequence, given a promise of a dictionary', async t => {
  return run()(collectDotFiles()).then(dict => {
    t.is(dict[0].path, '.babelrc');
  });
});


test('should reject when given invalid parameters', async t => {
  return t.throws(
    run([metadata, {}])(1)
  );
});


test('should throw when a function doesn\'t return a new array', async t => {
  return t.throws(
    run(
      () => collectDotFiles(),
      (files) => files
    )(
      process.cwd()
    )
  );
});


test('should throw when not given a function', async t => {
  return t.throws(
    run([])(process.cwd())
  );
});



/*

Test functions

*/

function collectDotFiles() {
  return run([metadata, { iamadot: true }])('.*', process.cwd());
}


function metadata(files, data) {
  return files.map(f => { return { ...f, ...data }});
}
