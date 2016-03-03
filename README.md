# Static Base

A small functional toolset for building static websites.  
Check out [static-base-contrib](https://github.com/icidasset/static-base)
for some functions.

__Work in progress.__


## Usage

```js
import { run } from 'static-base';


run(
  read,
  [frontmatter, 'yaml']
)(
  'src/**/*.html',
  process.cwd() // root directory
);


function read(deps, files) {
  return files.map((f) => {
    return {
      ...f,
      content: fs.readFileSync(f.entirePath),
    };
  });
}


function frontmatter(lang, deps, files) {
  return files.map((f) => {
    const m = graymatter(f.content, { lang });

    return {
      ...f,
      metadata: { ...f.metadata, ...m.data },
      content: m.content,
    };
  });
}
```
