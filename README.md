# Static Base

A small functional toolset for building static websites.  
Check out [static-base-contrib](https://github.com/icidasset/static-base-contrib)
for some pre-build functions.



## A simple example

```js
import { run } from 'static-base';

run(
  /* get content from files */
  (files) => {
    return files.map(f => { ...f, content: readFile(f.entirePath) });
  },

  /* render markdown */
  (files) => {
    return files.map(f => { ...f, content: markdown(f.content) });
  }

  /* write to disk */
  (files) => {
    return [...files].forEach(file => {
      writeFile(path.join(file.root, 'build', file.path), file.content);
    });
  }

)(
  '**/*.markdown',
  process.cwd()

).then(() => {
  console.log('Build was successful!')

}).catch((err) => {
  console.error('Build error!');
  console.error(err);

});
```



## Documentation

[http://icidasset.github.io/static-base](http://icidasset.github.io/static-base)



## A detailed example and explanation

__Note:__ This example uses functions from `static-base-contrib`,
but the explanation should be easy enough to understand without
any knowledge of said library.

```js
/**
 * Make a dictionary.
 *
 * Which is essentially a collection of objects that contain
 * the path to each file that matches the given glob pattern.
 */
const articles = run(
  [read],                         /* puts content of file in the 'content' attribute */
  [frontmatter],                  /* extracts the frontmatter from 'content' and parses it */
  [markdown, markdownRenderer],   /* parses 'content' as markdown */
  [renameExtension, '.html']      /* change the '.md' extension to '.html' */
)(
  'articles/**/*.md',   /* glob pattern that selects all articles */
  process.cwd()         /* path to the root directory of this project */
);


/**
 * Build collections and store them in the metadata,
 * so that each file has a reference to the other files.
 * Then render their layout and write them to disk.
 */
Promise.all([
  articles
]).then(dictionaries => {
  const collections = {
    articles: dictionaries[0],
  };

  run(
    [ metadata, { collections } ],
    [ template, renderHandlebars ], /* e.g. render article layout */
    [ write, 'build/articles' ]
  )(
    collections.articles
  );
});
```



## Development

```bash
npm install
npm test        # run tests
npm compile     # compile es6 src code
npm run docs    # generate documentation
```
