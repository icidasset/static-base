# Static Base

A small functional toolset for building static websites.  
Check out [static-base-contrib](https://github.com/icidasset/static-base)
for some functions.


## Usage

```js
import { run } from 'static-base';


run(
  read,
  [write, 'build']
)(
  'src/**/*.html',
  process.cwd() // root directory
);


function read(files, deps) {
  return files.map((f) => {
    return {
      ...f,
      content: fs.readFileSync(f.entirePath),
    };
  });
}


function write(files, deps, destination) {
  files.forEach((f) => {
    const dir = join(f.root, destination, f.dirname);
    mkdirp.sync(dir);
    fs.writeFileSync(join(dir, `${f.basename}${f.extname}`), f.content);
  });

  return [...files];
}
```
